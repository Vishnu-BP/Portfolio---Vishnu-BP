const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// @route POST /api/auth/login
// @desc Authenticate user & get token (Phase 2.3)
// @access Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route POST /api/auth/register (Run this once to create the first Admin user)
// @desc Register a new admin user (SHOULD BE DELETED AFTER FIRST USE)
// @access Public (Temporarily)
router.post('/register', async (req, res) => {
    // SECURITY NOTE: This endpoint should be removed or highly protected after the initial admin user is created.
    const { username, password } = req.body;
    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ username, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                message: 'Admin user created successfully. Remove this endpoint immediately.'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
