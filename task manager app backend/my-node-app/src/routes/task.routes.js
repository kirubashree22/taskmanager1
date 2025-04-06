// ==========================
// 1. Import dependencies
// ==========================
const express = require("express"); // Import Express framework
const {
  getTasks,      // Controller function to fetch tasks
  createTask,    // Controller function to create a task
  updateTask,    // Controller function to update a task
  deleteTask     // Controller function to delete a task
} = require("../controllers/task.controller");

const authMiddleware = require("../middleware/authMiddleware"); // Middleware to protect routes

// Create a new router object using Express
const router = express.Router();

// ==========================
// 2. Define Routes
// ==========================

// --------------------------------------
// Route: GET /
// Purpose: Fetch all tasks for the user
// Middleware: authMiddleware
// Controller: getTasks
// --------------------------------------
router.get("/", authMiddleware, getTasks);
// Pseudocode:
// - When GET request is made to "/"
// - Use authMiddleware to verify the user
// - If verified, call getTasks to return tasks

// --------------------------------------
// Route: POST /
// Purpose: Create a new task
// Middleware: authMiddleware
// Controller: createTask
// --------------------------------------
router.post("/", authMiddleware, createTask);
// Pseudocode:
// - When POST request is made to "/"
// - Authenticate using authMiddleware
// - If valid, create a new task using createTask

// --------------------------------------
// Route: PUT /:id
// Purpose: Update a task by ID
// Middleware: authMiddleware
// Controller: updateTask
// --------------------------------------
router.put("/:id", authMiddleware, updateTask);
// Pseudocode:
// - When PUT request is made to "/:id"
// - Authenticate the user
// - If valid, update the task with the given ID using updateTask

// --------------------------------------
// Route: DELETE /:id
// Purpose: Delete a task by ID
// Middleware: authMiddleware
// Controller: deleteTask
// --------------------------------------
router.delete("/:id", authMiddleware, deleteTask);
// Pseudocode:
// - When DELETE request is made to "/:id"
// - Authenticate the user
// - If valid, delete the task with the given ID using deleteTask

// ==========================
// 3. Export the router
// ==========================
module.exports = router;
// Pseudocode:
// - Export the router to be used in the main Express app
