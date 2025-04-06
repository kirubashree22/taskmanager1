// Import Sequelize data types (like STRING, UUID, ENUM)
const { DataTypes } = require("sequelize");

// Get the Sequelize instance (configured database connection)
const { sequelize } = require("../config/database");

// Import the User model so we can define the foreign key relationship
const User = require("./user.model");

// Define the "Task" model
const Task = sequelize.define("Task", {
  //  Primary Key - Unique ID for each task (UUID)
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Automatically generates a new UUID
    primaryKey: true,
  },

  //  Task Name - Required string
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Name is required
  },

  //  Task Description - Optional longer text
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  //  Task Status - Enum (must be one of "pending", "in-progress", or "completed")
  status: {
    type: DataTypes.ENUM("pending", "in-progress", "completed"),
    defaultValue: "pending", // Default value when not provided
  },

  //  Foreign Key to User table (each task belongs to a user)
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,  // Reference the User model
      key: "id",    // Use the 'id' field in the User model
    },
  },
});

//  Define association: A Task belongs to a User
// If a user is deleted, all their tasks are also deleted (CASCADE)
Task.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE", // Automatically delete task if related user is deleted
});

//  Export the model so it can be used in controllers or elsewhere
module.exports = Task;
