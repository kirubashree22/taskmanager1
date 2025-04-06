// Import required modules and configuration
const express = require("express"); // Express framework to create server and handle routing
const { sequelize, connectDB } = require("./src/config/database"); // Sequelize ORM and DB connection util
require("dotenv").config(); // Load environment variables from .env file
const cors = require('cors'); // Middleware to allow Cross-Origin Resource Sharing

// Initialize the Express application
const app = express(); // Create an instance of the Express app

// ==========================
// Middleware Configuration
// ==========================

// Parse incoming JSON requests
app.use(express.json());

// Enable CORS to allow requests from different origins
app.use(cors());

// ==========================
// Database Initialization
// ==========================

// Establish connection to the database
connectDB();

// Sync Sequelize models with the database without dropping existing tables
sequelize.sync({ force: false }) // Set force to true if you want to reset tables on every restart
  .then(() => console.log(" Database models synchronized."))
  .catch(err => console.error("Database sync failed:", err));

// ==========================
// API Route Definitions
// ==========================

// Route for authentication (e.g., login, register)
app.use("/api/auth", require("./src/routes/auth.routes"));

// Route for managing tasks (e.g., CRUD operations on tasks)
app.use("/api/tasks", require("./src/routes/task.routes"));

// ==========================
// Server Startup
// ==========================

const PORT = process.env.PORT || 5000; // Use environment variable or fallback to port 5000

// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
