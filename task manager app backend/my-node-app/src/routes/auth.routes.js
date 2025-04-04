const express = require("express");
const { register, login,forgotPassword,resetPassword } = require("../controllers/auth.controller");
const router = express.Router();
const sendEmail = require("../utils/sendEmail"); 

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpiry: { [Op.gt]: Date.now() },
        },
      });
  
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
  
      await user.save();
  
      res.status(200).json({ message: "✅ Password has been reset!" });
    } catch (error) {
      console.error("Reset error:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

module.exports = router;
