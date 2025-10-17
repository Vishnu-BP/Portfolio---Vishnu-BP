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
if (process.env.NODE_ENV === 'production') {
    
    // Define the correct build path once
    const buildPath = path.join(__dirname, '..', 'client', 'build');
    
    // 1. Static Middleware: Serve compiled assets (CSS, JS, images)
    app.use(express.static(buildPath));

    // 2. Catch-all Middleware: For ANY GET request not matched by the API, 
    //    send the index.html file. This is the safest way to handle client-side routing.
    app.use((req, res, next) => {
        // Only handle GET requests that are not for API routes
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            // Send the main index.html for any request not caught by the API routes
            res.sendFile(path.join(buildPath, 'index.html'), (err) => {
                if (err) {
                    next(err); // Pass error to Express error handler
                }
            });
        } else {
            next(); // Move to next middleware (or let Express handle it if no more middleware)
        }
    });
}
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------


// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));