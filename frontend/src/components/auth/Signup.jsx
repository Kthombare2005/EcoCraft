import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { db } from "../../firebaseConfig"; // Import Firestore from your firebaseConfig
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import "./AuthPage.css";
import Image2 from "../../assets/Image2.png"; // Import the image
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons for password visibility toggle

const Signup = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // For Confirm Password field
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [accountType, setAccountType] = useState("seller"); // Default account type set to 'seller'

  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // For Confirm Password error
  const [showPassword, setShowPassword] = useState(false); // To toggle visibility for Password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // To toggle visibility for Confirm Password

  // Handle form submission and validation
  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validations
    let isValid = true;

    // Email Validation (must be a valid Gmail address)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid Gmail address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Contact Number Validation (must be 10 digits)
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
      setContactError("Contact number must be 10 digits.");
      isValid = false;
    } else {
      setContactError("");
    }

    // Password Validation (must match the criteria)
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Confirm Password Validation (must match the password)
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // If all validations pass, submit the form
    if (isValid) {
      try {
        // Add data to Firestore based on account type
        const userRef = collection(db, accountType); // Dynamically select the collection
        await addDoc(userRef, {
          name,
          email,
          contact,
          accountType,
        });

        console.log("User data stored in Firestore successfully!");
        onSwitch("login"); // Switch to the login page after successful signup
      } catch (error) {
        console.error("Error storing data in Firestore: ", error);
      }
    }
  };

  // Handle Contact Number Input
  const handleContactChange = (e) => {
    const value = e.target.value;
    // Allow only numbers, and restrict input to 10 digits
    if (/^[0-9]{0,10}$/.test(value)) {
      setContact(value);
      setContactError(""); // Clear error when input is valid
    } else {
      setContactError("Please enter a valid 10-digit contact number.");
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel: Signup Text and Image */}
      <div className="left-panel">
        <h1>Welcome to Eco-Craft 🌱</h1>
        <p>
          Join Eco-Craft today and turn your scrap into value! ♻️🌍 Whether you&apos;re looking to sell scrap materials or create sustainable, eco-friendly products, our platform connects you with artisans and buyers from around the world. 🌿💚
        </p>
        <img src={Image2} alt="Eco-Craft" className="welcome-image" />
      </div>

      {/* Right Panel: Signup Form */}
      <div className="right-panel">
        <div className="auth-card">
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            {/* Account Type Selection */}
            <div className="mb-4">
              <label className="form-label">Account Type</label>
              <select
                className="form-control"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="seller">Seller</option>
                <option value="scraper">Scraper</option>
                <option value="artisan">Artisan</option>
              </select>
            </div>

            {/* Common Fields for All Account Types */}
            <div className="mb-4">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Contact Number</label>
              <div className="input-group">
                <span className="input-group-text">+91</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your contact number"
                  value={contact}
                  onChange={handleContactChange} // Updated handler for contact number
                  required
                />
              </div>
              {contactError && <div className="text-danger">{contactError}</div>}
            </div>

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
              {emailError && <div className="text-danger">{emailError}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Create Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Create a password"
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
              {passwordError && <div className="text-danger">{passwordError}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {confirmPasswordError && <div className="text-danger">{confirmPasswordError}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Signup
            </button>
          </form>

          <p className="haveaccount">
            Already have an account?{" "}
            <span onClick={() => onSwitch("login")} style={{ cursor: "pointer" }} className="LoginHere">
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

Signup.propTypes = {
  onSwitch: PropTypes.func.isRequired, // onSwitch is required to be passed as a prop
};

export default Signup;
