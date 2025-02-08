
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "./loader.css"; // For Animate.css if needed

const Loader = ({ type = "framer" }) => {
  if (type === "framer") {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          width: "50px",
          height: "50px",
          background: "#318CE7",
          borderRadius: "50%",
          margin: "auto",
        }}
      ></motion.div>
    );
  } else {
    return (
      <div className="animate__animated animate__bounce animate__infinite">
        <div
          style={{
            width: "50px",
            height: "50px",
            background: "#318CE7",
            borderRadius: "50%",
            margin: "auto",
          }}
        ></div>
      </div>
    );
  }
};

// Add PropTypes for validation
Loader.propTypes = {
  type: PropTypes.string,
};

export default Loader;
