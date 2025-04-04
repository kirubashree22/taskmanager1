import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import axios from "axios"; // Import axios for API calls
import "../styles/Login.css"; // Import the CSS file
import { Link } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);
  // useEffect(() => {
  //   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  //   if (token) {
  //     navigate("/tasks");
  //   }
  // }, []);
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    const rememberMe = localStorage.getItem("rememberMe") === "true";
  
    if (rememberMe && savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true,
      });
    }
  }, []);
  
  
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
  
      console.log("Login Success:", response.data);
  
      const { token, user } = response.data;
  
      // Store token and user details based on "Remember Me"
      if (formData.rememberMe) {
        // Always store token and user based on choice
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      
        // 🔁 Store credentials for next login
        localStorage.setItem("savedEmail", formData.email);
        localStorage.setItem("savedPassword", formData.password);
        localStorage.setItem("rememberMe", "true");
      } else {
        // Store session-only login
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      
        //  Clear remembered credentials
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
        localStorage.setItem("rememberMe", "false");
      }
      
      
  
      // Redirect to Task Page
      navigate("/tasks");
  
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError("Invalid email or password. Please try again.");
    }
  };
  

  return (
    <div className="container">
      {/* Left Section - Login Form */}
      <div className="login-box">
        <h2>Login</h2>
        <p>
          Don't have an account yet? <a href="/register">Sign Up</a>
        </p>

        {error && <p className="error-message">{error}</p>} {/* Display errors */}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password Input */}
      
<Link to="/forgot-password" className="forgot">Forgot Password?</Link>


          <input
            type="password"
            name="password"
            placeholder="Enter 6 characters or more"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Remember Me Checkbox */}
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

          {/* Login Button */}
          <button type="submit" className="login-btn">LOGIN</button>

      
         

       
        </form>
      </div>

      {/* Right Section - Illustration */}
      <div className="illustration">
        <img src="/images/illustration.jpg" alt="Login Illustration" />
      </div>
    </div>
  );
};

export default Login;
