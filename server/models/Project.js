const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], // Array of strings e.g., ['React', 'Node.js']
    required: true,
  },
  category: {
    type: String,
    required: true, // e.g., 'Web', 'ML/AI', 'Mobile'
  },
  imageUrl: {
    type: String, // URL from Cloudinary
    default: 'https://placehold.co/400x250/2563EB/ffffff?text=Image+Placeholder'
  },
  liveLink: {
    type: String,
    default: '#',
  },
  githubLink: {
    type: String,
    default: '#',
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
