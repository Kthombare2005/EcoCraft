import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // State to manage login/signup page toggle

  // Function to switch between login and signup
  const switchAuthModeHandler = () => {
    setIsLogin((prevMode) => !prevMode); // Toggle between login and signup
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login onSwitch={switchAuthModeHandler} /> // Pass switch function as prop
      ) : (
        <Signup onSwitch={switchAuthModeHandler} /> // Pass switch function as prop
      )}
    </div>
  );
};

export default AuthPage;
