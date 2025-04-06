// Import Sequelize from sequelize package
const { Sequelize } = require("sequelize");

// Load environment variables from the .env file
require("dotenv").config(); // This allows us to use DB credentials stored in .env

// Initialize Sequelize instance with database credentials and connection options
//  We're using PostgreSQL as the dialect here
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database name
  process.env.DB_USER,       // Username
  process.env.DB_PASSWORD,   // Password
  {
    host: process.env.DB_HOST,  // Host where DB is running (e.g., localhost)
    dialect: "postgres",        // Specify we're using PostgreSQL
    logging: false              // Disable SQL logging in the console
  }
);

// Create an async function to connect to the database
//  This function is used to test and establish a connection
const connectDB = async () => {
  try {
    // Attempt to authenticate and connect to the DB
    await sequelize.authenticate(); // Verifies connection with DB using provided credentials
    console.log("Database connected successfully."); //  Connection successful
  } catch (error) {
    // Handle connection errors (e.g., wrong password, DB down, etc.)
    console.error("Database connection failed:", error); //  Connection failed
    process.exit(1); // Exit the process to prevent app from running without DB
  }
};

// Export both sequelize instance and connectDB function
module.exports = { sequelize, connectDB };
