import React, { useState, useEffect } from "react"; // React hooks for state and lifecycle
import { useNavigate } from "react-router-dom";     // Navigation between routes
import axios from "axios";                          // HTTP client for API calls
import "../styles/Register.css";                    // Component-specific styling


const RegistrationForm = () => {
  const navigate = useNavigate();

  // 1. Initialize form states
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    mobileNumber: "",
    country: "",
    city: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [errorMessage, setErrorMessage] = useState("");   // For validation and server errors
  const [loading, setLoading] = useState(false);          // For showing loading state
  const [isRegistered, setIsRegistered] = useState(false); // Tracks successful registration
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // 2. Handle input changes and update formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Validate form inputs
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    // Check if all fields are filled
    if (
      !formData.name ||
      !formData.position ||
      !formData.email ||
      !formData.mobileNumber ||
      !formData.country ||
      !formData.city ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.gender
    ) {
      setErrorMessage("Please fill out all required fields.");
      return false;
    }

    // Validate email format
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Validate 10-digit phone number
    if (!phoneRegex.test(formData.mobileNumber)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }

    return true; // All validations passed
  };

  // 4. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form action
    setErrorMessage("");

    if (!validateForm()) return; // Abort if validation fails

    try {
      setLoading(true); // Show loader

      // Send registration request to backend
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);

      // Save JWT token to localStorage
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      console.log("Registration success:", response.data);
      setIsRegistered(true); // Trigger navigation
    } catch (error) {
      console.error("Error:", error);

      // Extract server error message
      if (error.response?.data?.message) {
        const serverMessage = error.response.data.message;

        if (typeof serverMessage === "string") {
          setErrorMessage(serverMessage);
        } else if (Array.isArray(serverMessage)) {
          setErrorMessage(serverMessage.join(", "));
        } else {
          setErrorMessage("An error occurred. Please check the form.");
        }
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // 5. Redirect to /tasks if registration is successful
  useEffect(() => {
    if (isRegistered) {
      navigate("/tasks");
    }
  }, [isRegistered, navigate]);

  // 6. Render the form UI
  return (
    <div className="registration-container">
      <div className="left-section">
        <img src="/images/registration.png" alt="Logo" />
      </div>

      <div className="right-section">
        <h2>Registration</h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name & Position */}
          <div className="input-group">
            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Position</label>
              <select name="position" value={formData.position} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="input-group">
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Phone Number</label>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Enter your phone number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Country & City */}
          <div className="input-group">
            <div>
              <label>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="input-group">
          <div>
  <label>Password</label>
  <div className="input-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter password"
    value={formData.password}
    onChange={handleChange}
    required
  />
  <span
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

</div>



<div>
  <label>Confirm Password</label>
  <div className="input-wrapper">
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    placeholder="Confirm password"
    value={formData.confirmPassword}
    onChange={handleChange}
    required
  />
  <span
    className="toggle-password"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </span>
</div>
</div>
          </div>

          {/* Gender Selection */}
          <div className="gender-section">
            <label>Gender:</label>
            <div className="gender-options">
              {["Male", "Female", "Other", "prefer-not-to-say"].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    required
                  />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Next Step"}
          </button>

          {/* Link to Sign In */}
          <p className="login-text">
            Already have an account? <a href="/">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
