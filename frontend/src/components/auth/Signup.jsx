// import  { useState } from "react";
// import PropTypes from "prop-types";
// import "./AuthPage.css";
// // import image1 from "../../assets/Image1.png";
// import image2 from "../../assets/Image2.png";
// import image3 from "../../assets/Image4.png";

// const Signup = ({ onSwitch }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = (e) => {
//     e.preventDefault();
//     console.log("Signup", formData);
//   };

//   return (
//     <div className="auth-container">
//       {/* Left Panel */}
//       <div className="left-panel collage-container">
//         <div className="collage">
//           {/* <img src={image1} alt="Eco-Craft 1" className="collage-img collage-img-1" /> */}
//           <img src={image2} alt="Eco-Craft 2" className="collage-img collage-img-2" />
//           <img src={image3} alt="Eco-Craft 3" className="collage-img collage-img-3" />
//         </div>
//         <h1>Join Eco-Craft</h1>
//         <p>
//           Create an account to start transforming waste into value and connect
//           with artisans worldwide.
//         </p>
//       </div>

//       {/* Right Panel */}
//       <div className="right-panel">
//         <div className="auth-card">
//           <h2>Sign Up</h2>
//           <form onSubmit={handleSignup}>
//             <div className="mb-4">
//               <label className="form-label">Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="name"
//                 placeholder="Enter your name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="form-label">Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="form-label">Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn btn-primary w-100">
//               Sign Up
//             </button>
//           </form>
//           <p className="mt-4 text-sm">
//             Already have an account?{" "}
//             <span
//               className="text-primary cursor-pointer"
//               onClick={() => onSwitch("login")}
//             >
//               Login here
//             </span>
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




// import { useState } from "react";
// import PropTypes from "prop-types"; // Import PropTypes for validation
// import "./AuthPage.css";

// const Signup = ({ onSwitch }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = (e) => {
//     e.preventDefault();
//     console.log("Signup", formData);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Sign Up</h2>
//         <form onSubmit={handleSignup}>
//           <div className="mb-4">
//             <label className="form-label">Name</label>
//             <input
//               type="text"
//               className="form-control"
//               name="name"
//               placeholder="Enter your name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">
//             Sign Up
//           </button>
//         </form>
//         <p className="auth-footer mt-4">
//           Already have an account?{" "}
//           <span onClick={() => onSwitch("login")}>Login here</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// // Validate that onSwitch is a required function
// Signup.propTypes = {
//   onSwitch: PropTypes.func.isRequired,
// };

// export default Signup;




import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import "./AuthPage.css";
import Image2 from "../../assets/Image2.png"; // Import the image

const Signup = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup", { email, password });
  };

  return (
    <div className="auth-container">
      {/* Left Panel: Signup Text and Image */}
      <div className="left-panel">
        <h1>Welcome to Eco-Craft 🌱</h1>
        <p>
          Join Eco-Craft today and turn your scrap into value! ♻️🌍 Whether you&apos;re looking to sell scrap materials or create sustainable, eco-friendly products, our platform connects you with artisans and buyers from around the world. 🌿💚
        </p>
        <img src={Image2} alt="Eco-Craft" className="welcome-image" /> {/* Image here */}
      </div>

      {/* Right Panel: Signup Form */}
      <div className="right-panel">
        <div className="auth-card">
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
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
