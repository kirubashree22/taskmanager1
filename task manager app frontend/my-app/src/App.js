// Import core routing tools from React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import the various page components for different routes
import Login from "./components/Login";                     // Login screen
import Registration from "./components/Registration";       // Registration screen
import TaskList from "./components/TaskList ";              // Main Task dashboard
import ForgotPassword from "./components/ForgotPassword";   // Forgot password form
import ResetPassword from "./components/ResetPassword";     // Password reset screen

// Define the main App component
function App() {
  return (
    // Wrap the entire app with <Router> to enable client-side routing
    <Router>
      {/* All route definitions go inside <Routes> */}
      <Routes>

        {/* Default route → shows login page */}
        <Route path="/" element={<Login />} />

        {/* Registration route → opens the registration form */}
        <Route path="/register" element={<Registration />} />

        {/* Task list route → user is redirected here after login/registration */}
        <Route path="/tasks" element={<TaskList />} />


        {/* Forgot password route → user enters their email to receive a reset link */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Reset password route → comes with a token in URL to securely reset password */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}

// Export the App component so it can be rendered in index.js
export default App;
