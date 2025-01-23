// import { useState } from "react";
// import PropTypes from "prop-types"; // Import PropTypes for validation
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import auth and signInWithEmailAndPassword
// import { db } from "../../firebaseConfig"; // Import Firestore from your firebaseConfig
// import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
// import "./AuthPage.css";
// import Image2 from "../../assets/Image2.png"; // Import the image
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons for password visibility toggle

// const Login = ({ onSwitch }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(""); // State to capture error messages
//   const [showPassword, setShowPassword] = useState(false); // To toggle visibility for Password

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       // Get the auth object
//       const auth = getAuth();

//       // Attempt to log in with email and password
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Fetch the user's account type from Firestore (assuming it's stored there)
//       const userRef = doc(db, "users", user.uid); // Access the user's document
//       const docSnap = await getDoc(userRef);

//       if (docSnap.exists()) {
//         const accountType = docSnap.data().accountType; // Get the account type from Firestore

//         // Redirect based on account type
//         if (accountType === "seller") {
//           // Add navigation logic for Seller Dashboard
//           window.location.href = "/dashboard/seller"; // Example redirect
//         } else if (accountType === "scraper") {
//           // Add navigation logic for Scraper Dashboard
//           window.location.href = "/dashboard/scraper"; // Example redirect
//         } else if (accountType === "artisan") {
//           // Add navigation logic for Artisan Dashboard
//           window.location.href = "/dashboard/artisan"; // Example redirect
//         }
//       }
//     } catch (error) {
//       setError("Wrong email or password. Please try again.");
//       console.error("Login error: ", error);
//     }
//   };

//   return (
//     <div className="auth-container">
//       {/* Left Panel: Login Text and Image */}
//       <div className="left-panel">
//         <h1>Welcome Back to Eco-Craft 🌱</h1>
//         <p>
//           Login to manage your scrap or eco-friendly products! ♻️🌍
//           Whether you&apos;re selling scrap materials or crafting sustainable products, Eco-Craft connects you with artisans and buyers worldwide. 🌿💚
//         </p>
//         <img src={Image2} alt="Eco-Craft" className="welcome-image" />
//       </div>

//       {/* Right Panel: Login Form */}
//       <div className="right-panel">
//         <div className="auth-card">
//           <h2>Login</h2>
//           <form onSubmit={handleLogin}>
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
//               <label className="form-label">Password</label>
//               <div className="input-group">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="form-control"
//                   placeholder="Enter your password"
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

//             {/* Show error message if login fails */}
//             {error && <div className="text-danger">{error}</div>}

//             <button type="submit" className="btn btn-primary w-100">
//               Login
//             </button>
//           </form>

//           <p className="Account">
//             Don&apos;t have an account?{" "}
//             <span onClick={() => onSwitch("signup")} style={{ cursor: "pointer" }} className="SignupButton">
//               Sign up here
//             </span>
//           </p>
//           <p>
//             Forgot password?{" "}
//             <span onClick={() => onSwitch("forgotPassword")} style={{ cursor: "pointer" }} className="ResetPassword">
//               Reset it here
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// Login.propTypes = {
//   onSwitch: PropTypes.func.isRequired, // onSwitch is required to be passed as a prop
// };

// export default Login;




import { useState } from "react";
import PropTypes from "prop-types";
import { signInWithEmailAndPassword, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, db, googleProvider, githubProvider } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./AuthPage.css";
import Image2 from "../../assets/Image2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false); // For account type selection modal
  const [user, setUser] = useState(null); // To store the authenticated user

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const accountType = docSnap.data().accountType;
        switch (accountType) {
          case "seller":
            window.location.href = "/dashboard/seller";
            break;
          case "scraper":
            window.location.href = "/dashboard/scraper";
            break;
          case "artisan":
            window.location.href = "/dashboard/artisan";
            break;
          default:
            setError("Unknown account type.");
        }
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      setError("Wrong email or password. Please try again.");
      console.error("Login error: ", error);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if the email already exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);

      if (signInMethods.length > 0) {
        // Email already exists, show error message
        setError("Account already exists. Please log in with your existing account.");
        return; // Exit the function to prevent further execution
      }

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // User exists, redirect based on account type
        const accountType = docSnap.data().accountType;
        switch (accountType) {
          case "seller":
            window.location.href = "/dashboard/seller";
            break;
          case "scraper":
            window.location.href = "/dashboard/scraper";
            break;
          case "artisan":
            window.location.href = "/dashboard/artisan";
            break;
          default:
            window.location.href = "/";
        }
      } else {
        // User doesn't exist, show account type selection modal
        setUser(user);
        setShowModal(true);
      }
    } catch (error) {
      setError("Failed to login with Google.");
      console.error("Google login error: ", error);
    }
  };

  // Handle GitHub login
  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      // Check if the email already exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);

      if (signInMethods.length > 0) {
        // Email already exists, show error message
        setError("Account already exists. Please log in with your existing account.");
        return; // Exit the function to prevent further execution
      }

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // User exists, redirect based on account type
        const accountType = docSnap.data().accountType;
        switch (accountType) {
          case "seller":
            window.location.href = "/dashboard/seller";
            break;
          case "scraper":
            window.location.href = "/dashboard/scraper";
            break;
          case "artisan":
            window.location.href = "/dashboard/artisan";
            break;
          default:
            window.location.href = "/";
        }
      } else {
        // User doesn't exist, show account type selection modal
        setUser(user);
        setShowModal(true);
      }
    } catch (error) {
      setError("Failed to login with GitHub.");
      console.error("GitHub login error: ", error);
    }
  };

  // Account Type Selection Modal
  const AccountTypeModal = ({ user }) => {
    const [accountType, setAccountType] = useState("seller");

    const handleSubmit = async () => {
      try {
        // Store the account type in Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          accountType,
          email: user.email,
          name: user.displayName || "Unknown",
        });

        // Redirect based on account type
        switch (accountType) {
          case "seller":
            window.location.href = "/dashboard/seller";
            break;
          case "scraper":
            window.location.href = "/dashboard/scraper";
            break;
          case "artisan":
            window.location.href = "/dashboard/artisan";
            break;
          default:
            window.location.href = "/";
        }
      } catch (error) {
        console.error("Error saving account type:", error);
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Select Your Account Type</h2>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="form-control"
          >
            <option value="seller">Seller</option>
            <option value="scraper">Scraper</option>
            <option value="artisan">Artisan</option>
          </select>
          <button onClick={handleSubmit} className="btn btn-primary mt-3">
            Submit
          </button>
        </div>
      </div>
    );
  };

  // Add PropTypes validation for AccountTypeModal
  AccountTypeModal.propTypes = {
    user: PropTypes.shape({
      uid: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      displayName: PropTypes.string,
    }).isRequired,
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="left-panel">
        <h1>Welcome Back to Eco-Craft 🌱</h1>
        <p>
          Login to manage your scrap or eco-friendly products! ♻️🌍 Whether you&apos;re selling scrap materials or crafting sustainable products, Eco-Craft connects you with artisans and buyers worldwide. 🌿💚
        </p>
        <img src={Image2} alt="Eco-Craft" className="welcome-image" />
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="auth-card">
          <h2>Login</h2>
          {!showModal ? (
            <>
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
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {error && <div className="text-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              <div className="text-center my-3">OR</div>

              <button
                type="button"
                className="btn btn-outline-dark w-100 mb-3"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="me-2" /> Continue with Google
              </button>

              <button
                type="button"
                className="btn btn-outline-dark w-100"
                onClick={handleGithubLogin}
              >
                <FaGithub className="me-2" /> Continue with GitHub
              </button>

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
            </>
          ) : (
            <AccountTypeModal user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onSwitch: PropTypes.func.isRequired,
};

export default Login;