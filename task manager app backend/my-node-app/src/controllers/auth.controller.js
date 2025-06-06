const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");

const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); // Utility function for sending emails

// ===========================
// Login Controller
// ===========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Check if user exists in DB
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 2: Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 3: Generate JWT token
    const token = generateToken(user);

    // Step 4: Return token and basic user details
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        country: user.country,
        city: user.city,
        state: user.state,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ===========================
// Register Controller
// ===========================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      password,
      country,
      city,
      state,
      gender,
    } = req.body;
    console.log("bodycheck", req.body);

    // Step 1: Check if user already exists by email
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Step 2: Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 3: Create new user in DB
    user = await User.create({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
      country,
      city,
      state,
      gender,
    });

    // Step 4: Generate JWT token
    const token = generateToken(user);

    // Step 5: Return token and basic user details
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        country: user.country,
        city: user.city,
        state: user.state,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    console.error("Full error:", JSON.stringify(error, null, 2));

    // Step 6: Handle DB uniqueness constraint errors
    const pgError = error.original || error;

    if (pgError.code === "23505") {
      if (pgError.detail && pgError.detail.includes("mobile_number")) {
        return res
          .status(400)
          .json({ message: "Mobile number already exists" });
      }
      if (pgError.detail && pgError.detail.includes("email")) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    res.status(500).json({ message: "Something went wrong" });
  }
};

// ===========================
// Forgot Password Controller
// ===========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Step 1: Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Generate reset token and save hashed token in DB
    const resetToken = user.generatePasswordResetToken(); // generates plain + hashed token
    console.log("Before saving:", user.resetPasswordToken, user.resetPasswordExpires);
await user.save();
console.log("After saving:", user.resetPasswordToken, user.resetPasswordExpires);

    // Step 3: Create reset URL
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    // Step 4: Send email with reset link
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetURL}\n\nIf you did not request this, ignore this email.`,
    });

    // Step 5: Response
    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ===========================
// Reset Password Controller
// ===========================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Step 1: Hash the token from the URL to match DB value
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Step 2: Find the user with matching token and check expiration
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    // Step 3: If token invalid or expired
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Step 4: Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Step 5: Clear the reset token fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
