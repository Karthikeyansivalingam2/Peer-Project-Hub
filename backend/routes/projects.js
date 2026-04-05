const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const User = require('../models/User');
const authenticate = require('../middleware/firebaseAuth');

// Get analytics stats
router.get('/stats', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Find most liked project using aggregation to sort by likes array length
    const topProjects = await Project.aggregate([
      { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $sort: { likesCount: -1 } },
      { $limit: 1 }
    ]);
    const topProject = topProjects.length > 0 ? topProjects[0] : null;

    res.json({
      totalProjects,
      totalUsers,
      topProjectTitle: topProject ? topProject.title : 'N/A',
      topProjectId: topProject ? topProject._id : null
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Project.countDocuments();
    const projects = await Project.find().populate('user', 'email firebaseUid').sort({ createdAt: -1 }).skip(skip).limit(limit);

    // Calculate average rating for each project
    const projectsWithRating = projects.map(project => {
      const ratings = project.ratings || [];
      const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
      return { ...project.toObject(), averageRating: Math.round(averageRating * 10) / 10 };
    });

    res.json({
      projects: projectsWithRating,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', 'email firebaseUid');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment views
    project.views += 1;
    await project.save();

    // Calculate average rating
    const ratings = project.ratings || [];
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;

    res.json({ ...project.toObject(), averageRating: Math.round(averageRating * 10) / 10 });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get projects for a specific user (by Firebase UID)
router.get('/user/:userId', async (req, res) => {
  try {
    const appUser = await User.findOne({ firebaseUid: req.params.userId });
    if (!appUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const projects = await Project.find({ user: appUser._id }).populate('user', 'email firebaseUid').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', authenticate, async (req, res) => {
  const { title, description, tags, githubLink, liveDemoLink } = req.body;
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const project = new Project({ title, description, tags, githubLink, liveDemoLink, user: user._id });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update project
router.put('/:id', authenticate, async (req, res) => {
  const { title, description, tags, githubLink, liveDemoLink } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user || !project.user.equals(user._id)) {
      return res.status(403).json({ error: 'Forbidden: only project owner can update' });
    }

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.tags = tags ?? project.tags;
    project.githubLink = githubLink ?? project.githubLink;
    project.liveDemoLink = liveDemoLink ?? project.liveDemoLink;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user || !project.user.equals(user._id)) {
      return res.status(403).json({ error: 'Forbidden: only project owner can delete' });
    }

    await project.remove();
    await Comment.deleteMany({ project: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comments
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ project: req.params.id }).populate('user', 'email');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/comments', authenticate, async (req, res) => {
  const { text } = req.body;
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const comment = new Comment({ text, user: user._id, project: req.params.id });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const uid = req.firebaseUser.uid;
    const alreadyLiked = project.likes.includes(uid);

    if (alreadyLiked) {
      project.likes = project.likes.filter((userId) => userId !== uid);
    } else {
      project.likes.push(uid);
    }

    await project.save();
    res.json({ likes: project.likes, liked: !alreadyLiked });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rate project
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const uid = req.firebaseUser.uid;
    const existingRatingIndex = project.ratings.findIndex(r => r.userId === uid);

    if (existingRatingIndex >= 0) {
      project.ratings[existingRatingIndex].rating = rating;
    } else {
      project.ratings.push({ userId: uid, rating });
    }

    await project.save();

    const averageRating = project.ratings.length > 0 ? project.ratings.reduce((sum, r) => sum + r.rating, 0) / project.ratings.length : 0;

    res.json({ averageRating: Math.round(averageRating * 10) / 10, userRating: rating });
  } catch (error) {
    console.error('Error rating project:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;