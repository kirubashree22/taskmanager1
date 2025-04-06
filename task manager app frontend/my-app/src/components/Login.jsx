import React, { useState, useEffect } from "react";
// Import navigation hook to allow redirecting the user to another route
import { useNavigate } from "react-router-dom";
// Import axios for making HTTP requests to backend API
import axios from "axios";
// Import login page styles
import "../styles/Login.css";
// Import link component for routing to other pages 
import { Link } from "react-router-dom";



const Login = () => {
  // Initialize state to store email, password, and rememberMe checkbox
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // State for tracking error messages for example login failure in this scenario.
  const [error, setError] = useState("");

  // Get navigate function from React Router to handle redirects
  const navigate = useNavigate();

  // Whenever formData changes, log it to the console -----debugginggg
  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // When the component mounts, check if saved credentials exist in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    // If "Remember Me" was checked and values are stored, prefill the form
    if (rememberMe && savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true,
      });
    }
  }, []);

  // Update form fields whenever the user types or toggles the checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // If checkbox, use checked value or otherwise, use input value
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Handle form submission when the user clicks the Login button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setError(""); // Clear any previous errors

    try {
      // Send a POST request to the backend login API with email and password
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // If login is successful, extract token and user details from response
      console.log("Login Success:", response.data);
      const { token, user } = response.data;

      // Check if user clicked the  remember me
      if (formData.rememberMe) {
        // Store token and user in localStorage for persistent login
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Also store email and password for auto-filling login form next time
        localStorage.setItem("savedEmail", formData.email);
        localStorage.setItem("savedPassword", formData.password);
        localStorage.setItem("rememberMe", "true");
      } else {
        // Store login data in sessionStorage (cleared when tab/browser is closed)
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        // Clear any previously saved login credentials
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
        localStorage.setItem("rememberMe", "false");
      }

      // Redirect user to the /tasks page after successful login
      navigate("/tasks");

    } catch (error) {
      // If login fails, show a generic error message 
      console.error("Login Error:", error.response?.data || error.message);
      setError("Invalid email or password. Please try again.");
      setFormData(prev => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className="container">
      {/* Left side of the login page that holds the form */}
      <div className="login-box">
        <h2>Login</h2>
        <p>
          Don't have an account yet? <a href="/register">Sign Up</a>
        </p>

        {/* Show error message if login fails */}
        {error && <p className="error-message">{error}</p>}

        {/* Login form with email, password, and remember me checkbox */}
        <form onSubmit={handleSubmit}>
          {/* Email input field */}
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Link to Forgot Password page */}
          <Link to="/forgot-password" className="forgot">Forgot Password?</Link>

          {/* Password input field */}
          <input
            type="password"
            name="password"
            placeholder="Enter 6 characters or more"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Remember Me checkbox */}
          <div className="remember">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
          </div>

          {/* Submit button to login */}
          <button type="submit" className="login-btn">LOGIN</button>
        </form>
      </div>

      {/* Right side of the login page that shows an illustration */}
      <div className="illustration">
        <img src="/images/illustration.jpg" alt="Login Illustration" />
      </div>
    </div>
  );
};

export default Login;
