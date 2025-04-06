// Import jsonwebtoken library for token creation
const jwt = require("jsonwebtoken");

// Load environment variables (e.g., JWT_SECRET) from .env file
require("dotenv").config(); 

// Function to generate JWT token for a given user
const generateToken = (user) => {
    // Sign a new JWT token:
    // - Payload includes user id and email
    // - Uses secret key from environment variables
    // - Token expires in 1 year
    return jwt.sign(
        { id: user.id, email: user.email }, // Payload data to embed in the token
        process.env.JWT_SECRET,            // Secret key used to sign the token
        { expiresIn: "1y" }                // Token expiration time (1 year)
    );
};

// Export the generateToken function so it can be used in other files (like controllers)
module.exports = generateToken;
