// import  { useState } from "react";
// import PropTypes from "prop-types"; // Import PropTypes for validation
// import "./AuthPage.css";

// const Login = ({ onSwitch }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();
//     console.log("Login", { email, password });
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Login</h2>
//         <form onSubmit={handleLogin}>
//           {/* Email Field */}
//           <div className="mb-4">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           {/* Password Field */}
//           <div className="mb-4">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           {/* Submit Button */}
//           <button type="submit" className="btn btn-primary w-100">
//             Login
//           </button>
//         </form>
//         {/* Footer Links */}
//         <p className="auth-footer mt-4">
//           Don’t have an account?{" "}
//           <span onClick={() => onSwitch("signup")}>Sign up here</span>
//         </p>
//         <p className="auth-footer">
//           Forgot your password?{" "}
//           <span onClick={() => onSwitch("forgotPassword")}>Reset here</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// // Validate that onSwitch is a required function
// Login.propTypes = {
//   onSwitch: PropTypes.func.isRequired,
// };

// export default Login;






import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import "./AuthPage.css";
import image2 from "../../assets/Image2.png"; // Path to your image

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login", { email, password });
  };

  return (
    <div className="auth-container">
      <div className="left-panel">
        <h1>Welcome to Eco-Craft 🌱</h1>
        <p>
          Join us in transforming waste into value! ♻️🌍
          <br />
          Our platform connects artisans from all over the world to create
          sustainable, eco-friendly products from recycled materials! 🌿💚
        </p>
        <img src={image2} alt="Eco-Craft Artisan" className="welcome-image" />
      </div>

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
          <p className="auth-footer mt-4">
            Don’t have an account?{" "}
            <span onClick={() => onSwitch("signup")}>Sign up here</span>
          </p>
          <p className="auth-footer">
            Forgot your password?{" "}
            <span onClick={() => onSwitch("forgotPassword")}>Reset here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Validate that onSwitch is a required function
Login.propTypes = {
  onSwitch: PropTypes.func.isRequired,
};

export default Login;
