const Task = require("../models/task.model"); // Import Task model
const { Op } = require("sequelize"); // Sequelize operators for filtering

// =======================================
//  Get All Tasks (with Pagination + Search + Filter)
// =======================================
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id; //  Get user ID from authenticated token

    //  Extract query parameters (or set defaults)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search || ""; // Optional search text

    const offset = (page - 1) * limit; //  Pagination offset

    //  Construct WHERE clause dynamically
    const whereClause = {
      userId, //  Only fetch tasks that belong to the logged-in user
      ...(status && { status }), //  Optional filter by status
      ...(search && {
        name: {
          [Op.iLike]: `%${search}%`, //  Case-insensitive partial search for task name
        },
      }),
    };

    //  Fetch tasks with count and apply filters/pagination
    const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    // Return tasks + pagination info
    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
      tasks,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =======================================
//  Create a New Task
// =======================================
exports.createTask = async (req, res) => {
  try {
    const { name, description, status } = req.body; //  Get task details from request body

    console.log("Received data:", req.body);
    console.log("User ID:", req.user.id); //  User ID from token

    //  Validate required fields
    if (!name || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    //  Create new task associated with user
    const task = await Task.create({
      name,
      description,
      status,
      userId: req.user.id, // Link task to authenticated user
    });

    console.log("Task created successfully:", task);
    res.status(201).json({ success: true, message: "Task Created", task });

  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// =======================================
//  Update an Existing Task
// =======================================
exports.updateTask = async (req, res) => {
  try {
    //  Find task by ID and user ownership
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    //  If task not found or doesn't belong to user
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    //  Update task fields from request body
    await task.update(req.body);
    res.json({ success: true, message: "Task Updated", task });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// =======================================
// Delete a Task
// =======================================
exports.deleteTask = async (req, res) => {
  try {
    // 🔍 Find task by ID and user
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    //  If task not found
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    //  Delete task from DB
    await task.destroy();
    res.json({ success: true, message: "Task Deleted" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
