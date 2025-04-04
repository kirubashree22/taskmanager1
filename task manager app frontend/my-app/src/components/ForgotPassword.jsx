import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setMessage("Error sending reset link. Try again.");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Send Reset Link</button>
          {message && <p className="info-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
