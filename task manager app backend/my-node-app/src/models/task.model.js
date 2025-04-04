const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); 


const User = require("./user.model");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM("pending", "in-progress", "completed"),
    defaultValue: "pending",
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: "id" },
  },
});

Task.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Task;
