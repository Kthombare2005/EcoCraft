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




import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import "./AuthPage.css";

const Signup = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup", formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <p className="auth-footer mt-4">
          Already have an account?{" "}
          <span onClick={() => onSwitch("login")}>Login here</span>
        </p>
      </div>
    </div>
  );
};

// Validate that onSwitch is a required function
Signup.propTypes = {
  onSwitch: PropTypes.func.isRequired,
};

export default Signup;
