// // import { Route, Routes } from "react-router-dom";
// // import AuthPage from "./components/auth/AuthPage"; // Ensure this is correctly importing AuthPage
// // import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
// // import ScraperDashboard from "./components/Dashboards/ScraperDashboard";
// // import ArtisanDashboard from "./components/Dashboards/ArtisanDashboard";

// // const App = () => {
// //   return (
// //     <Routes>
// //       {/* Routing based on paths */}
// //       <Route path="/" element={<AuthPage />} />
// //       <Route path="/dashboard/seller" element={<SellerDashboard />} />
// //       <Route path="/dashboard/scraper" element={<ScraperDashboard />} />
// //       <Route path="/dashboard/artisan" element={<ArtisanDashboard />} />
// //     </Routes>
// //   );
// // };

// // export default App;



// import { Route, Routes } from "react-router-dom";
// import AuthPage from "./components/auth/AuthPage"; // Ensure this is correctly importing AuthPage
// import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
// import ScraperDashboard from "./components/Dashboards/ScraperDashboard";
// import ArtisanDashboard from "./components/Dashboards/ArtisanDashboard";
// import Profile from "./components/Dashboards/SellerDashboard/Profile"; // Import Profile page

// const App = () => {
//   return (
//     <Routes>
//       {/* Routing based on paths */}
//       <Route path="/" element={<AuthPage />} />
//       <Route path="/dashboard/seller" element={<SellerDashboard />} />
//       <Route path="/dashboard/scraper" element={<ScraperDashboard />} />
//       <Route path="/dashboard/artisan" element={<ArtisanDashboard />} />
//       <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
//     </Routes>
//   );
// };

// export default App;





import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ✅ Remove extra Router import
import PropTypes from "prop-types";
import { auth, onAuthStateChanged } from "./firebaseConfig";

import AuthPage from "./components/auth/AuthPage";
import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
import Profile from "./components/Dashboards/SellerDashboard/Profile";

const ProtectedRoute = ({ element }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? element : <Navigate to="/" />;
};

// ✅ Fix: Add PropTypes validation for `element`
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

const RedirectToDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to="/dashboard/seller" /> : <Navigate to="/" />;
};

const App = () => {
  return (
    <Routes> {/* ✅ No Router here */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<RedirectToDashboard />} />
      <Route path="/dashboard/seller" element={<ProtectedRoute element={<SellerDashboard />} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile isSidebarCollapsed={false} />} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
