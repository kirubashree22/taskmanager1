const Task = require("../models/task.model");


const { Op } = require("sequelize");

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search || ""; // <-- new line

    const offset = (page - 1) * limit;

    const whereClause = {
      userId,
      ...(status && { status }),
      ...(search && {
        name: {
          [Op.iLike]: `%${search}%` // Case-insensitive partial match
        }
      }),
    };

    const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// 📝 Create a New Task
exports.createTask = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    console.log("Received data:", req.body);
    console.log("User ID:", req.user.id);

    if (!name || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const task = await Task.create({
      name,
      description,
      status,
      userId: req.user.id,
    });

    console.log("Task created successfully:", task);
    res.status(201).json({ success: true, message: "Task Created", task });

  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// 📝 Update an Existing Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.update(req.body);
    res.json({ success: true, message: "Task Updated", task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 📝 Delete a Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await task.destroy();
    res.json({ success: true, message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
