import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirecting after registration
import axios from "axios";
import "../styles/Register.css"; // Import the CSS file

const RegistrationForm = () => {
  const navigate = useNavigate(); // Hook for navigation after successful registration

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

  const [error, setError] = useState(""); // Error message state
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/; 
    
    if (!formData.name || !formData.position || !formData.email || !formData.mobileNumber || 
        !formData.country || !formData.city || !formData.password || !formData.confirmPassword || 
        !formData.gender) {
      setErrorMessage("Please fill out all required fields.");
      return false;
    }
  
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
  
    if (!phoneRegex.test(formData.mobileNumber)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return false;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
  
    return true;
  };
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
  
    if (!validateForm()) return;
  
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Registration success:', response.data);
      navigate('/tasks'); // Redirect to /tasks
    } catch (error) {
      console.error('Error:', error);
  
     
      if (error.response && error.response.data) {
        const serverMessage = error.response.data.message;
  
        
        if (typeof serverMessage === 'string') {
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
      setLoading(false);
    }
  };
  
  
  
  


  return (
    <div className="registration-container">
      <div className="left-section">
        <img src="/images/registration.png" alt="Logo" />
      </div>

      <div className="right-section">
        <h2>Registration</h2>

        {error && <p className="error">{error}</p>} {/* Display error message */}

        <form onSubmit={handleSubmit}>
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
  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
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
  pattern="[0-9]{10}"
  title="Enter a 10-digit phone number"
/>
            </div>
          </div>

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

          <div className="input-group">
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          {errorMessage && (
  <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
)}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Next Step"}
          </button>

          <p className="login-text">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
