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

// Pre-save hook to generate slug (Corrected for safe creation and updates)
BlogSchema.pre('save', function(next) {
    // Generate slug if the document is NEW (creation) OR the title field is modified (update)
    if (this.isNew || this.isModified('title')) {
        
        // 1. Generate the slug from the title
        let generatedSlug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric/spaces with hyphen
            .replace(/^-*|-*$/g, ''); // Trim hyphens from start/end
            
        // 2. Assign the slug
        this.slug = generatedSlug;

        // 3. Fallback for empty slug (e.g., if title was only symbols)
        if (!this.slug) {
            // Use a fallback slug with a timestamp to ensure uniqueness and compliance
            this.slug = 'blog-post-' + Date.now(); 
        }
    }
    
    // NOTE: This corrected logic ensures the slug is created during a POST request, 
    // resolving the 'Path `slug` is required.' validation error.
    
    next();
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;