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



// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";
// import SellerDashboard from "./components/dashboard/SellerDashboard";
// import ScraperDashboard from "./components/dashboard/ScraperDashboard";
// import ArtisanDashboard from "./components/dashboard/ArtisanDashboard";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard/seller" element={<SellerDashboard />} />
//         <Route path="/dashboard/scraper" element={<ScraperDashboard />} />
//         <Route path="/dashboard/artisan" element={<ArtisanDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
