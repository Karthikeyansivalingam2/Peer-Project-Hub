const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Project = require('./models/Project');
const Comment = require('./models/Comment');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Comment.deleteMany();

    // Create users
    const user1 = new User({ email: 'user1@example.com', firebaseUid: 'uid1', name: 'User One' });
    const user2 = new User({ email: 'user2@example.com', firebaseUid: 'uid2', name: 'User Two' });
    await user1.save();
    await user2.save();

    // Create projects
    const project1 = new Project({
      title: 'Sample Project 1',
      description: 'A sample project description',
      tags: ['React', 'Node.js'],
      githubLink: 'https://github.com/user/project1',
      liveDemoLink: 'https://demo1.com',
      user: user1._id
    });
    const project2 = new Project({
      title: 'Sample Project 2',
      description: 'Another sample project',
      tags: ['Vue', 'MongoDB'],
      githubLink: 'https://github.com/user/project2',
      user: user2._id
    });
    await project1.save();
    await project2.save();

    // Create comments
    const comment1 = new Comment({
      text: 'Great project!',
      user: user2._id,
      project: project1._id
    });
    await comment1.save();

    console.log('Sample data seeded');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();