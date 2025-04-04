const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");

const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail"); // Utility function for sending emails

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

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


exports.register = async (req, res) => {
  try {
    const { name, email, mobileNumber, password, country, city, state, gender } = req.body;
    console.log('bodycheck', req.body);

    // Check if user already exists by email
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
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

    // Generate JWT Token
    const token = generateToken(user);

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
  } 
  catch (error) {
    console.error("Error in register:", error);
    console.error("Full error:", JSON.stringify(error, null, 2)); 
  
    const pgError = error.original || error;
  
    if (pgError.code === '23505') {
      if (pgError.detail && pgError.detail.includes('mobile_number')) {
        return res.status(400).json({ message: 'Mobile number already exists' });
      }
      if (pgError.detail && pgError.detail.includes('email')) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
  
    res.status(500).json({ message: "Something went wrong" });
  }
  
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

  
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetURL}\n\nIf you did not request this, ignore this email.`,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

