const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // Import sequelize instance
const crypto = require("crypto"); // Import crypto for generating secure tokens

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "mobile_number",
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: false,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,  
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,  
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Method to generate password reset token
User.prototype.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
  return resetToken;
};

module.exports = User;
