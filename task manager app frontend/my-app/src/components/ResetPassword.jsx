// 1. Import necessary modules and hooks from React and other libraries
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/Resetpassword.css"; // Custom styles

// 2. Define the ResetPassword component
const ResetPassword = () => {
  const { token } = useParams();             // 3. Extract token from URL
  const navigate = useNavigate();            // 4. For redirecting to login

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // 5. Handle form submission
  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage("Password reset successful! Redirecting to login...");
      setMessageType("success");

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Token may have expired.");
      setMessageType("error");
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /><br />

        <button type="submit">Reset Password</button>
      </form>

      {message && (
        <p className={messageType === 'success' ? 'message-success' : 'message-error'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
