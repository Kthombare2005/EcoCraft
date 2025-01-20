import { useState } from "react";
import PropTypes from "prop-types";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
      setError("");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="text-primary font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Send Reset Link
          </button>
        </form>
        {message && <p className="text-success mt-2">{message}</p>}
        {error && <p className="text-danger mt-2">{error}</p>}
        <p className="mt-4 text-sm">
          Remembered your password?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => onSwitch("login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

// Add PropTypes validation
ForgotPassword.propTypes = {
  onSwitch: PropTypes.func.isRequired,
};

export default ForgotPassword;
