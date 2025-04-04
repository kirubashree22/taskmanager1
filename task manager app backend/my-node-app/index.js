const express = require("express");
const { sequelize, connectDB } = require("./src/config/database");
require("dotenv").config();
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// Sync Database
sequelize.sync({ force: false }) 
  .then(() => console.log("✅ Database models synchronized."))
  .catch(err => console.error("❌ Database sync failed:", err));

// Routes
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/tasks", require("./src/routes/task.routes")); // 🔹 Add Task Routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
