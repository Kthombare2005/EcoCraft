// import { useState } from "react";
// import PropTypes from "prop-types"; // Import PropTypes for validation
// import { db, auth } from "../../firebaseConfig"; // Import Firestore and Firebase Auth from your firebaseConfig
// import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
// import { createUserWithEmailAndPassword } from "firebase/auth"; // Import Firebase Authentication
// import "./AuthPage.css";
// import Image2 from "../../assets/Image2.png"; // Import the image
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons for password visibility toggle
// import { log } from "../../utils/log";

// const Signup = ({ onSwitch }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState(""); // For Confirm Password field
//   const [name, setName] = useState("");
//   const [ContactNumber, setContactNumber] = useState(""); // Updated field name
//   const [accountType, setAccountType] = useState("seller"); // Default account type set to 'seller'

//   const [emailError, setEmailError] = useState("");
//   const [ContactNumberError, setContactNumberError] = useState(""); // Updated error for ContactNumber
//   const [passwordError, setPasswordError] = useState("");
//   const [confirmPasswordError, setConfirmPasswordError] = useState(""); // For Confirm Password error

//   const [signupError, setSignupError] = useState(""); // For Signup error
//   const [signupSuccess, setSignupSuccess] = useState(""); // For Signup success

//   const [showPassword, setShowPassword] = useState(false); // To toggle visibility for Password
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false); // To toggle visibility for Confirm Password

//   // Handle form submission and validation
//   const handleSignup = async (e) => {
//     e.preventDefault();

//     // Basic validations
//     let isValid = true;

//     // Email Validation (must be a valid Gmail address)
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//     if (!emailRegex.test(email)) {
//       setEmailError("Please enter a valid Gmail address.");
//       isValid = false;
//     } else {
//       setEmailError("");
//     }

//     // Contact Number Validation (must be 10 digits)
//     const ContactNumberRegex = /^[0-9]{10}$/;
//     if (!ContactNumberRegex.test(ContactNumber)) {
//       setContactNumberError("Contact number must be 10 digits.");
//       isValid = false;
//     } else {
//       setContactNumberError("");
//     }

//     // Password Validation (must match the criteria)
//     if (password.length < 6) {
//       setPasswordError("Password must be at least 6 characters.");
//       isValid = false;
//     } else {
//       setPasswordError("");
//     }

//     // Confirm Password Validation (must match the password)
//     if (password !== confirmPassword) {
//       setConfirmPasswordError("Passwords do not match.");
//       isValid = false;
//     } else {
//       setConfirmPasswordError("");
//     }

//     // If all validations pass, submit the form
//     if (isValid) {
//       try {
//         // Create user using Firebase Authentication
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Add data to Firestore with the user's UID as the document ID under the 'users' collection
//         const userRef = doc(db, "users", user.uid); // Use "users" collection and user's UID as the document ID
//         await setDoc(userRef, {
//           name,
//           email,
//           ContactNumber, // Updated field name
//           accountType,
//         });

//         setSignupSuccess("Signup successful! Redirecting to login...");
//         setSignupError(""); // Clear any previous errors
//         log("User data stored in Firestore successfully!");

//         setTimeout(() => {
//           onSwitch("login"); // Switch to the login page after a brief delay
//         }, 3000); // Redirect after 3 seconds
//       } catch (error) {
//         if (error.code === "auth/email-already-in-use") {
//           setSignupError("An account with this email already exists.");
//         } else {
//           setSignupError("An error occurred while signing up. Please try again.");
//         }
//         setSignupSuccess(""); // Clear any success messages
//         console.error("Error during signup: ", error);
//       }
//     }
//   };

//   // Handle Contact Number Input
//   const handleContactNumberChange = (e) => {
//     const value = e.target.value;
//     // Allow only numbers, and restrict input to 10 digits
//     if (/^[0-9]{0,10}$/.test(value)) {
//       setContactNumber(value);
//       setContactNumberError(""); // Clear error when input is valid
//     } else {
//       setContactNumberError("Please enter a valid 10-digit contact number.");
//     }
//   };

//   return (
//     <div className="auth-container">
//       {/* Left Panel: Signup Text and Image */}
//       <div className="left-panel">
//         <h1>Welcome to Eco-Craft 🌱</h1>
//         <p>
//           Join Eco-Craft today and turn your scrap into value! ♻️🌍 Whether you&apos;re looking to sell scrap materials or create sustainable, eco-friendly products, our platform connects you with artisans and buyers from around the world. 🌿💚
//         </p>
//         <img src={Image2} alt="Eco-Craft" className="welcome-image" />
//       </div>

//       {/* Right Panel: Signup Form */}
//       <div className="right-panel">
//         <div className="auth-card">
//           <h2>Signup</h2>
//           <form onSubmit={handleSignup}>
//             {/* Account Type Selection */}
//             <div className="mb-4">
//               <label className="form-label">Account Type</label>
//               <select
//                 className="form-control"
//                 value={accountType}
//                 onChange={(e) => setAccountType(e.target.value)}
//               >
//                 <option value="seller">Seller</option>
//                 <option value="scraper">Scraper</option>
//                 <option value="artisan">Artisan</option>
//               </select>
//             </div>

//             {/* Common Fields for All Account Types */}
//             <div className="mb-4">
//               <label className="form-label">Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="form-label">Contact Number</label>
//               <div className="input-group">
//                 <span className="input-group-text">+91</span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter your contact number"
//                   value={ContactNumber}
//                   onChange={handleContactNumberChange} // Updated handler for contact number
//                   required
//                 />
//               </div>
//               {ContactNumberError && <div className="text-danger">{ContactNumberError}</div>}
//             </div>

//             <div className="mb-4">
//               <label className="form-label">Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               {emailError && <div className="text-danger">{emailError}</div>}
//             </div>

//             <div className="mb-4">
//               <label className="form-label">Create Password</label>
//               <div className="input-group">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="form-control"
//                   placeholder="Create a password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <span
//                   className="input-group-text"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>
//               {passwordError && <div className="text-danger">{passwordError}</div>}
//             </div>

//             <div className="mb-4">
//               <label className="form-label">Confirm Password</label>
//               <div className="input-group">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   className="form-control"
//                   placeholder="Confirm your password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//                 <span
//                   className="input-group-text"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>
//               {confirmPasswordError && <div className="text-danger">{confirmPasswordError}</div>}
//             </div>

//             {/* Show signup success or error */}
//             {signupError && <div className="text-danger">{signupError}</div>}
//             {signupSuccess && <div className="text-success">{signupSuccess}</div>}

//             <button type="submit" className="btn btn-primary w-100">
//               Signup
//             </button>
//           </form>

//           <p className="haveaccount">
//             Already have an account?{" "}
//             <span onClick={() => onSwitch("login")} style={{ cursor: "pointer" }} className="LoginHere">
//               Login here
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// Signup.propTypes = {
//   onSwitch: PropTypes.func.isRequired, // onSwitch is required to be passed as a prop
// };

// export default Signup;

import { useState } from "react";
import PropTypes from "prop-types";
import { db, auth } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./AuthPage.css";
import Image2 from "../../assets/Image2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { log } from "../../utils/log";
import statesJson from "../../assets/states.json";
import citiesJson from "../../assets/cities.json";

const Signup = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [accountType, setAccountType] = useState("seller");
  const [shopAddress, setShopAddress] = useState("");

  const [emailError, setEmailError] = useState("");
  const [ContactNumberError, setContactNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setState(selectedState);
    setCity(""); // Reset city selection when state changes
    setCities(citiesJson[selectedState] || []);
  };

  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   let isValid = true;

  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  //   if (!emailRegex.test(email)) {
  //     setEmailError("Please enter a valid Gmail address.");
  //     isValid = false;
  //   } else {
  //     setEmailError("");
  //   }

  //   const ContactNumberRegex = /^[0-9]{10}$/;
  //   if (!ContactNumberRegex.test(ContactNumber)) {
  //     setContactNumberError("Contact number must be 10 digits.");
  //     isValid = false;
  //   } else {
  //     setContactNumberError("");
  //   }

  //   if (password.length < 6) {
  //     setPasswordError("Password must be at least 6 characters.");
  //     isValid = false;
  //   } else {
  //     setPasswordError("");
  //   }

  //   if (password !== confirmPassword) {
  //     setConfirmPasswordError("Passwords do not match.");
  //     isValid = false;
  //   } else {
  //     setConfirmPasswordError("");
  //   }

  //   if (accountType === "scraper" && shopAddress.trim() === "") {
  //     setSignupError("Shop Address is required for scrapers.");
  //     isValid = false;
  //   }

  //   if (isValid) {
  //     try {
  //       const userCredential = await createUserWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );
  //       const user = userCredential.user;
  //       const userRef = doc(db, "users", user.uid);

  //       const userData = {
  //         name,
  //         email,
  //         ContactNumber,
  //         accountType,
  //       };

  //       if (accountType === "scraper") {
  //         userData.shopAddress = shopAddress;
  //       }

  //       await setDoc(userRef, userData);

  //       setSignupSuccess("Signup successful! Redirecting to login...");
  //       setSignupError("");

  //       log("User data stored in Firestore successfully!");

  //       setTimeout(() => {
  //         onSwitch("login");
  //       }, 3000);
  //     } catch (error) {
  //       if (error.code === "auth/email-already-in-use") {
  //         setSignupError("An account with this email already exists.");
  //       } else {
  //         setSignupError(
  //           "An error occurred while signing up. Please try again."
  //         );
  //       }
  //       setSignupSuccess("");
  //       console.error("Error during signup: ", error);
  //     }
  //   }
  // };




  const handleSignup = async (e) => {
    e.preventDefault();
    let isValid = true;
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid Gmail address.");
      isValid = false;
    } else {
      setEmailError("");
    }
  
    const ContactNumberRegex = /^[0-9]{10}$/;
    if (!ContactNumberRegex.test(ContactNumber)) {
      setContactNumberError("Contact number must be 10 digits.");
      isValid = false;
    } else {
      setContactNumberError("");
    }
  
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }
  
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
  
    if (accountType === "scraper" && shopAddress.trim() === "") {
      setSignupError("Shop Address is required for scrapers.");
      isValid = false;
    }
  
    if (isValid) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);
  
        // Generate Unique ID based on account type
        const generateUniqueId = (prefix) => {
          return `${prefix}${Date.now().toString().slice(-6)}`; // Example: SELL-123456
        };
  
        let userId;
        switch (accountType) {
          case "seller":
            userId = generateUniqueId("SELL-");
            break;
          case "scraper":
            userId = generateUniqueId("SCRP-");
            break;
          case "artisan":
            userId = generateUniqueId("ARTS-");
            break;
          default:
            userId = generateUniqueId("USER-");
        }
  
        const userData = {
          userId, // Store the generated ID
          name,
          email,
          ContactNumber,
          accountType,
        };
  
        if (accountType === "scraper") {
          userData.shopAddress = shopAddress;
        }
  
        await setDoc(userRef, userData);
  
        setSignupSuccess("Signup successful! Redirecting to login...");
        setSignupError("");
  
        log("User data stored in Firestore successfully!");
  
        setTimeout(() => {
          onSwitch("login");
        }, 3000);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setSignupError("An account with this email already exists.");
        } else {
          setSignupError("An error occurred while signing up. Please try again.");
        }
        setSignupSuccess("");
        console.error("Error during signup: ", error);
      }
    }
  };
  


  return (
    <div className="auth-container">
      <div className="left-panel">
        <h1>Welcome to Eco-Craft 🌱</h1>
        <p>
          Join Eco-Craft today and turn your scrap into value! ♻️🌍 Whether
          you&apos;re looking to sell scrap materials or create sustainable,
          eco-friendly products, our platform connects you with artisans and
          buyers from around the world. 🌿💚
        </p>
        <img src={Image2} alt="Eco-Craft" className="welcome-image" />
      </div>

      <div className="right-panel">
        <div
          className="auth-card"
          style={{
            maxWidth: accountType === "scraper" ? "550px" : "500px",
            width: "100%", // Increase width for scraper
            padding: "20px",
          }}
        >
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-2">
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

            <div className={accountType === "scraper" ? "mb-2" : "mb-3"}>
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

            <div className={accountType === "scraper" ? "mb-2" : "mb-3"}>
              <label className="form-label">Contact Number</label>
              <div className="input-group" style={{ height: "36px" }}>
                <span className="input-group-text" style={{ height: "100%" }}>
                  +91
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your contact number"
                  value={ContactNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
                    setContactNumber(value);

                    if (value.length < 10) {
                      setContactNumberError(
                        "Contact number must be 10 digits."
                      );
                    } else {
                      setContactNumberError(""); // Clear error if valid
                    }
                  }}
                  maxLength="10"
                  required
                  style={{
                    height: "100%",
                    fontSize: "14px",
                    padding: "4px 8px",
                  }}
                />
              </div>
              {ContactNumberError && (
                <div className="text-danger">{ContactNumberError}</div>
              )}
            </div>

            <div className={accountType === "scraper" ? "mb-2" : "mb-3"}>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (!e.target.value.endsWith("@gmail.com")) {
                    setEmailError("Email must be a valid Gmail address.");
                  } else {
                    setEmailError(""); // Clear error if valid
                  }
                }}
                required
              />
              {emailError && <div className="text-danger">{emailError}</div>}
            </div>

            {accountType === "scraper" && (
              <>
                <div className="col-12 mb-2">
                  <label className="form-label">Shop Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your shop address"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label">State</label>
                    <select
                      className="form-control"
                      value={state}
                      onChange={handleStateChange}
                      required
                    >
                      <option value="">Select State</option>
                      {statesJson.states.map((stateName) => (
                        <option key={stateName} value={stateName}>
                          {stateName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <select
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      disabled={!state}
                    >
                      <option value="">Select City</option>
                      {cities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className={accountType === "scraper" ? "mt-2" : "mt-3"}>
              <label className="form-label">Create Password</label>
              <div className="input-group" style={{ height: "36px" }}>
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
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && (
                <div className="text-danger">{passwordError}</div>
              )}
            </div>

            <div className={accountType === "scraper" ? "mt-2" : "mt-3"}>
              <label className="form-label">Confirm Password</label>
              <div className="input-group" style={{ height: "36px" }}>
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
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {confirmPasswordError && (
                <div className="text-danger">{confirmPasswordError}</div>
              )}
            </div>

            {signupError && <div className="text-danger">{signupError}</div>}
            {signupSuccess && (
              <div className="text-success">{signupSuccess}</div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              Signup
            </button>
          </form>

          <p className="haveaccount">
            Already have an account?{" "}
            <span onClick={() => onSwitch("login")} className="LoginHere">
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

Signup.propTypes = {
  onSwitch: PropTypes.func.isRequired,
};

export default Signup;

// import { useState } from "react";
// import PropTypes from "prop-types";
// import "./AuthPage.css";
// import Image2 from "../../assets/Image2.png";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useMediaQuery } from "@mui/material";

// const Signup = ({ onSwitch }) => {
//   const isSmallScreen = useMediaQuery("(max-width: 600px)");
//   const isMediumScreen = useMediaQuery("(max-width: 772px)");
//   const isLargeScreen = useMediaQuery("(max-width: 1072px)");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [name, setName] = useState("");
//   const [ContactNumber, setContactNumber] = useState("");
//   const [accountType, setAccountType] = useState("seller");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   return (
//     <div
//       className="auth-container"
//       style={{
//         flexDirection: isSmallScreen || isMediumScreen || isLargeScreen ? "column" : "row",
//         padding: "10px",
//         width: isMediumScreen || isLargeScreen ? "100%" : "auto",
//         overflowX: "hidden",
//       }}
//     >
//       {!isMediumScreen && !isLargeScreen && (
//         <div
//           className="left-panel"
//           style={{
//             display: isSmallScreen ? "none" : "block",
//             width: "50%",
//           }}
//         >
//           <h1>Welcome to Eco-Craft 🌱</h1>
//           <p>Join Eco-Craft today and turn your scrap into value! ♻️🌍</p>
//           <img
//             src={Image2}
//             alt="Eco-Craft"
//             className="welcome-image"
//             style={{ maxWidth: "100%", height: "auto" }}
//           />
//         </div>
//       )}
//       <div
//         className="right-panel"
//         style={{
//           width: isSmallScreen || isMediumScreen || isLargeScreen ? "100%" : "50%",
//           maxWidth: "600px",
//           margin: "0 auto",
//           padding: isMediumScreen || isLargeScreen ? "10px" : "0",
//         }}
//       >
//         <div
//           className="auth-card"
//           style={{
//             padding: isSmallScreen || isMediumScreen ? "10px" : "30px",
//           }}
//         >
//           <h1 style={{ textAlign: "center", marginBottom: "16px" }}>Welcome to Eco-Craft 🌱</h1>
//           <h2 style={{ textAlign: "center" }}>Signup</h2>
//           <form>
//             <div className="mb-4">
//               <label className="form-label">Account Type</label>
//               <select
//                 className="form-control"
//                 value={accountType}
//                 onChange={(e) => setAccountType(e.target.value)}
//               >
//                 <option value="seller">Seller</option>
//                 <option value="scraper">Scraper</option>
//                 <option value="artisan">Artisan</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="form-label">Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="form-label">Contact Number</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your contact number"
//                 value={ContactNumber}
//                 onChange={(e) => setContactNumber(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="form-label">Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="form-label">Create Password</label>
//               <div className="input-group">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="form-control"
//                   placeholder="Create a password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <span
//                   className="input-group-text"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="form-label">Confirm Password</label>
//               <div className="input-group">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   className="form-control"
//                   placeholder="Confirm your password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//                 <span
//                   className="input-group-text"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                 </span>
//               </div>
//             </div>
//             <button type="submit" className="btn btn-primary w-100">
//               Signup
//             </button>
//           </form>
//           <p className="haveaccount">
//             Already have an account? <span onClick={() => onSwitch("login")} className="LoginHere">Login here</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// Signup.propTypes = {
//   onSwitch: PropTypes.func.isRequired,
// };

// export default Signup;
