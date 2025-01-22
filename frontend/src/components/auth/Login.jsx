import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import auth and signInWithEmailAndPassword
import { db } from "../../firebaseConfig"; // Import Firestore from your firebaseConfig
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import "./AuthPage.css";
import Image2 from "../../assets/Image2.png"; // Import the image
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons for password visibility toggle

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to capture error messages
  const [showPassword, setShowPassword] = useState(false); // To toggle visibility for Password

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Get the auth object
      const auth = getAuth();

      // Attempt to log in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user's account type from Firestore (assuming it's stored there)
      const userRef = doc(db, "users", user.uid); // Access the user's document
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const accountType = docSnap.data().accountType; // Get the account type from Firestore

        // Redirect based on account type
        if (accountType === "seller") {
          // Add navigation logic for Seller Dashboard
          window.location.href = "/dashboard/seller"; // Example redirect
        } else if (accountType === "scraper") {
          // Add navigation logic for Scraper Dashboard
          window.location.href = "/dashboard/scraper"; // Example redirect
        } else if (accountType === "artisan") {
          // Add navigation logic for Artisan Dashboard
          window.location.href = "/dashboard/artisan"; // Example redirect
        }
      }
    } catch (error) {
      setError("Wrong email or password. Please try again.");
      console.error("Login error: ", error);
    }
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
        <img src={Image2} alt="Eco-Craft" className="welcome-image" />
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
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Show error message if login fails */}
            {error && <div className="text-danger">{error}</div>}

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
