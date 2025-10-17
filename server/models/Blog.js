const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    // Automatically generated from title for SEO-friendly URLs
  },
  summary: {
    type: String,
    required: true,
  },
  content: {
    type: String, // Stores the full article in Markdown format
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  }
}, {
  timestamps: true
});

// Pre-save hook to generate slug (basic implementation)
BlogSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
    }
    next();
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
