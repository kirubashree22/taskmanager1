// 1. Import necessary libraries
import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests
import "../styles/Login.css"; // Custom styles

// 2. Define the ForgotPassword functional component
const ForgotPassword = () => {
  // 3. Declare state variables using React Hooks
  const [email, setEmail] = useState("");         // Stores the user's email input
  const [message, setMessage] = useState("");     // Stores the success or error message to display
  const [loading, setLoading] = useState(false);// for loading screen 


  // 4. Define the form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setMessage("Error sending reset link. Try again.");
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };
  

  // 8. Render the UI elements
  return (
    <div className="container">
      {/* Login box container */}
      <div className="login-box">
        {/* Page heading */}
        <h2>Forgot Password</h2>

        {/* Password reset form */}
        <form onSubmit={handleSubmit}>
          {/* Email label and input */}
          <label>Email Address</label>
          <input
            type="email"                        // Email input field
            name="email"                        // Field name
            placeholder="you@example.com"       // Placeholder text
            value={email}                       // Bind input to state variable
            onChange={(e) => setEmail(e.target.value)} // Update state on change
            required                            // HTML5 validation
          />

          {/* Submit button */}
          <button type="submit" className="login-btn" disabled={loading}>
  {loading ? "Sending..." : "Send Reset Link"}
</button>


          {/* Conditional message display */}
          {message && <p className="info-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

// 9. Export the component to use in routes or parent components
export default ForgotPassword;
