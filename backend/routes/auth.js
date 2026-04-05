const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middleware/firebaseAuth');

router.post('/register', async (req, res) => {
  const { email, firebaseUid, name } = req.body;
  try {
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = new User({ email, firebaseUid, name });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE user profile
router.put('/profile', authenticate, async (req, res) => {
  const { name, bio } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.firebaseUser.uid },
      { name, bio },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/bookmark/:projectId', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const projectId = req.params.projectId;
    const alreadyBookmarked = user.bookmarks.some((bookmark) => bookmark.toString() === projectId);

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter((bookmark) => bookmark.toString() !== projectId);
    } else {
      user.bookmarks.push(projectId);
    }

    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bookmarks', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).populate('bookmarks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;