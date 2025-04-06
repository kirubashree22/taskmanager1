// Import required modules
const { DataTypes } = require("sequelize"); // Sequelize data types
const { sequelize } = require("../config/database"); // Sequelize DB instance
const crypto = require("crypto"); // Node module to generate secure random tokens

// Define the "User" model
const User = sequelize.define("User", {
  // Primary key - unique identifier for each user
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID v4
    primaryKey: true,
  },

  // Name field - cannot be null
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Email field - must be unique, required, and follow email format
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }, // Sequelize built-in email validator
  },

  // Mobile number - unique, required, stored as "mobile_number" in DB
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "mobile_number", // Changes the column name in the DB
    unique: true,
  },

  // Password field - required
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Country - required string
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // City - required string
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Gender field - must be one of the defined enum values
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: false,
  },

  // Token for password reset functionality (optional field)
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Expiration time for the reset token (optional field)
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Define an instance method on User model to generate reset token
User.prototype.generatePasswordResetToken = function () {
  // Generate a random token (32 bytes, hex string)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token using SHA-256 and store in DB
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set expiration time to 1 hour from now
  this.resetPasswordExpires = Date.now() + 3600000;

  // Return the plain reset token (will be sent to user's email)
  return resetToken;
};

// Export the User model
module.exports = User;
