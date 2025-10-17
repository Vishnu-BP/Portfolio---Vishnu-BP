// Load environment variables from .env file
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Import Routes (Will be created in Phase 2.4 and 2.5) ---
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogs');
const contactRoutes = require('./routes/contact');


// --- Database Connection ---
connectDB();

// --- Initialization ---
const app = express();
const PORT = process.env.PORT || 5000;


// --- Middleware ---

// Enable CORS (Cross-Origin Resource Sharing)
// This allows your React frontend (e.g., on port 3000) to communicate with this backend (on port 5000).
// In production, you would restrict this to your actual deployed frontend URL.
app.use(cors({
    origin: '*', // Allows all origins for development ease. Restrict this later.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Body parser: allows the app to accept JSON data from the client
app.use(express.json());


// --- Define Core API Routes ---

// Authentication routes (Login/Admin)
app.use('/api/auth', authRoutes);

// Project management routes (CRUD)
app.use('/api/projects', projectRoutes);

// Blog management routes (CRUD)
app.use('/api/blogs', blogRoutes);

// Contact form submission route (Nodemailer)
app.use('/api/contact', contactRoutes);


// --- Health Check / Default Route ---
app.get('/', (req, res) => {
    res.send('Portfolio API is running...');
});


// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
