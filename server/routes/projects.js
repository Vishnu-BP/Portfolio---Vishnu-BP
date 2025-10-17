const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route GET /api/projects
// @desc Fetch all projects (Phase 2.4 - Public Access)
// @access Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// @route POST /api/projects
// @desc Add a new project (Phase 2.4 - Protected Access)
// @access Private (Admin)
router.post('/', protect, async (req, res) => {
  // NOTE on Image Upload: In a real implementation, Multer/Cloudinary logic would go here
  // to handle the file upload before saving the document.
  const { name, description, tags, category, imageUrl, liveLink, githubLink } = req.body;

  try {
    const newProject = await Project.create({ 
        name, description, tags, category, imageUrl, liveLink, githubLink 
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: 'Invalid project data or missing required fields' });
  }
});

// @route PUT /api/projects/:id
// @desc Update an existing project (Phase 2.4 - Protected Access)
// @access Private (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
        // Update all fields from request body
        Object.assign(project, req.body); 

        const updatedProject = await project.save();
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

// @route DELETE /api/projects/:id
// @desc Delete a project (Phase 2.4 - Protected Access)
// @access Private (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const result = await Project.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project' });
    }
});


module.exports = router;
