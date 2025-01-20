import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import "./AuthPage.css";

const ResetPassword = ({ onSwitch }) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    console.log("Reset Password Request for:", email);
    // Add logic to handle password reset (e.g., Firebase reset email)
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Send Reset Link
          </button>
        </form>
        {/* Footer Links */}
        <p className="auth-footer mt-4">
          Remember your password?{" "}
          <span onClick={() => onSwitch("login")}>Login here</span>
        </p>
      </div>
    </div>
  );
};

// Validate that onSwitch is a required function
ResetPassword.propTypes = {
  onSwitch: PropTypes.func.isRequired,
};

export default ResetPassword;
