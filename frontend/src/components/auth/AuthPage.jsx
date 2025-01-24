import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

  // Function to switch between login and signup
  const switchAuthModeHandler = (mode) => {
    setIsLogin(mode === "login");
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login onSwitch={switchAuthModeHandler} />
      ) : (
        <Signup onSwitch={switchAuthModeHandler} />
      )}
    </div>
  );
};

export default AuthPage;
