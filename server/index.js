// Load environment variables from .env file
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); // Import the path module

// --- Import Routes ---
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

// **PRODUCTION NOTE:** Since the frontend and backend are now on the same domain (monolithic),
// we don't need to enable wide-open CORS. We can simplify or remove it entirely if needed.
// Leaving it simple for now, as it's often still required for security headers or pre-flight checks.
app.use(cors({
    origin: '*', // You can restrict this to your Render URL if needed, but '*' is fine for same-origin calls.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Body parser: allows the app to accept JSON data from the client
app.use(express.json());


// --- Define Core API Routes (Routes prefixed with /api) ---

// Authentication routes (Login/Admin)
app.use('/api/auth', authRoutes);

// Project management routes (CRUD)
app.use('/api/projects', projectRoutes);

// Blog management routes (CRUD)
app.use('/api/blogs', blogRoutes);

// Contact form submission route (Nodemailer)
app.use('/api/contact', contactRoutes);


// --- Health Check / Default Route (Before Frontend Logic) ---
app.get('/', (req, res) => {
    res.send('Portfolio API is running...');
});


// ----------------------------------------------------------------------
// --- Monolithic Deployment: Serve Frontend Assets in Production ---
// ----------------------------------------------------------------------

// Check if the application is running in a production environment 
// AND if the client/build directory exists (created by the Build Command)
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    // Serve any static files from the client/build directory
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

    // Handle all other GET requests that don't match an API route 
    // by serving the main index.html file (the entry point for React)
    app.get('*', (req, res) => {
        // Ensure the path correctly points to client/build/index.html
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}
// ----------------------------------------------------------------------


// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));