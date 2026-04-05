const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  githubLink: { type: String, required: true },
  liveDemoLink: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: [String], default: [] },
  ratings: [{ userId: String, rating: Number }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);