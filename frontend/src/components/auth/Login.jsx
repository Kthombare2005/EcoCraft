import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import "./AuthPage.css";
import Image2 from "../../assets/Image2.png"; // Import the image

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login", { email, password });
  };

  return (
    <div className="auth-container">
      {/* Left Panel: Login Text and Image */}
      <div className="left-panel">
        <h1>Welcome Back to Eco-Craft 🌱</h1>
        <p>
          Login to manage your scrap or eco-friendly products! ♻️🌍
          Whether you&apos;re selling scrap materials or crafting sustainable products, Eco-Craft connects you with artisans and buyers worldwide. 🌿💚
        </p>
        <img src={Image2} alt="Eco-Craft" className="welcome-image" /> {/* Image here */}
      </div>

      {/* Right Panel: Login Form */}
      <div className="right-panel">
        <div className="auth-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
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
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="Account">
            Don&apos;t have an account?{" "}
            <span onClick={() => onSwitch("signup")} style={{ cursor: "pointer" }} className="SignupButton">
              Sign up here
            </span>
          </p>
          <p>
            Forgot password?{" "}
            <span onClick={() => onSwitch("forgotPassword")} style={{ cursor: "pointer" }} className="ResetPassword">
              Reset it here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onSwitch: PropTypes.func.isRequired, // onSwitch is required to be passed as a prop
};

export default Login;
