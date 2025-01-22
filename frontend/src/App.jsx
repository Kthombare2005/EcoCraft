import { useState } from "react";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";

const App = () => {
  const [page, setPage] = useState("login"); // State to manage the current page (login, signup, forgotPassword)

  return (
    <div className="app-container">
      {/* Conditional rendering based on the current page */}
      {page === "login" && <Login onSwitch={setPage} />}
      {page === "signup" && <Signup onSwitch={setPage} />}
      {page === "forgotPassword" && <ForgotPassword onSwitch={setPage} />}
    </div>
  );
};

export default App;
