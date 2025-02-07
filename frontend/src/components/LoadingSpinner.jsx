import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <motion.div
    initial={{ scale: 0.5 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
    className="animate__animated animate__fadeIn"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <div
      style={{
        width: "60px",
        height: "60px",
        border: "6px solid #ddd",
        borderTop: "6px solid #318CE7",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    ></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </motion.div>
);

export default LoadingSpinner;
