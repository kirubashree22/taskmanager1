// Import required modules
const express = require("express");

// Import controller functions for auth routes
const { register, login, forgotPassword, resetPassword } = require("../controllers/auth.controller");

// Create a new Express router instance
const router = express.Router();

// Import utility to send emails (for forgot password logic)

const User = require("../models/user.model");
const { Op } = require("sequelize");

// ===========================================
//  Define the routes for authentication
// ===========================================

// Route: POST /register
// Registers a new user
router.post("/register", register);

// Route: POST /login
//  Logs in an existing user
router.post("/login", login);

// Route: POST /forgot-password
//  Handles request to send a reset link to user’s email
router.post("/forgot-password", forgotPassword);

// Route: POST /reset-password/:token
//  Resets user’s password using a token from the email
router.post("/reset-password/:token", resetPassword);




// Export the router so it can be used in other files (like in app.js/index.js)
module.exports = router;
