// import { Route, Routes } from "react-router-dom";
// import AuthPage from "./components/auth/AuthPage"; // Ensure this is correctly importing AuthPage
// import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
// import ScraperDashboard from "./components/Dashboards/ScraperDashboard";
// import ArtisanDashboard from "./components/Dashboards/ArtisanDashboard";

// const App = () => {
//   return (
//     <Routes>
//       {/* Routing based on paths */}
//       <Route path="/" element={<AuthPage />} />
//       <Route path="/dashboard/seller" element={<SellerDashboard />} />
//       <Route path="/dashboard/scraper" element={<ScraperDashboard />} />
//       <Route path="/dashboard/artisan" element={<ArtisanDashboard />} />
//     </Routes>
//   );
// };

// export default App;



import { Route, Routes } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage"; // Ensure this is correctly importing AuthPage
import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
import ScraperDashboard from "./components/Dashboards/ScraperDashboard";
import ArtisanDashboard from "./components/Dashboards/ArtisanDashboard";
import Profile from "./components/Dashboards/SellerDashboard/Profile"; // Import Profile page

const App = () => {
  return (
    <Routes>
      {/* Routing based on paths */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard/seller" element={<SellerDashboard />} />
      <Route path="/dashboard/scraper" element={<ScraperDashboard />} />
      <Route path="/dashboard/artisan" element={<ArtisanDashboard />} />
      <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
    </Routes>
  );
};

export default App;



