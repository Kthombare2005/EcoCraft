import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "./Loader.css"; // For Animate.css if needed
import { Box, CircularProgress } from '@mui/material';

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

const LoadingSpinner = () => {
  return (
    <Box 
      sx={{ 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <CircularProgress 
        size={40}
        thickness={4}
        sx={{ 
          color: "#1a237e",
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(0.95)',
              boxShadow: '0 0 0 0 rgba(26, 35, 126, 0.7)',
            },
            '70%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 10px rgba(26, 35, 126, 0)',
            },
            '100%': {
              transform: 'scale(0.95)',
              boxShadow: '0 0 0 0 rgba(26, 35, 126, 0)',
            },
          },
          animation: 'pulse 2s infinite',
        }}
      />
    </Box>
  );
};

export default Loader;
export { LoadingSpinner };
