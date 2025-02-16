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





// import { useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom"; // ✅ Remove extra Router import
// import PropTypes from "prop-types";
// import { auth, onAuthStateChanged } from "./firebaseConfig";

// import AuthPage from "./components/auth/AuthPage";
// import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
// import Profile from "./components/Dashboards/SellerDashboard/Profile";

// const ProtectedRoute = ({ element }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return user ? element : <Navigate to="/" />;
// };

// // ✅ Fix: Add PropTypes validation for `element`
// ProtectedRoute.propTypes = {
//   element: PropTypes.element.isRequired,
// };

// const RedirectToDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return user ? <Navigate to="/dashboard/seller" /> : <Navigate to="/" />;
// };

// const App = () => {
//   return (
//     <Routes> {/* ✅ No Router here */}
//       <Route path="/" element={<AuthPage />} />
//       <Route path="/dashboard" element={<RedirectToDashboard />} />
//       <Route path="/dashboard/seller" element={<ProtectedRoute element={<SellerDashboard />} />} />
//       <Route path="/profile" element={<ProtectedRoute element={<Profile isSidebarCollapsed={false} />} />} />
//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// export default App;




// import { useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import { auth, onAuthStateChanged } from "./firebaseConfig";

// import AuthPage from "./components/auth/AuthPage";
// import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
// import ScraperDashboard from "./components/Dashboards/ScraperDashboard/ScraperSidebar"; // ✅ Import Scraper Dashboard
// import Profile from "./components/Dashboards/SellerDashboard/Profile";
// import ScrapManagement from "./components/Dashboards/SellerDashboard/ScrapManagement";

// const ProtectedRoute = ({ element }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return user ? element : <Navigate to="/" />;
// };

// // ✅ Fix: Add PropTypes validation for `element`
// ProtectedRoute.propTypes = {
//   element: PropTypes.element.isRequired,
// };

// const RedirectToDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return user ? <Navigate to="/dashboard/seller" /> : <Navigate to="/" />;
// };

// const App = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<AuthPage />} />
//       <Route path="/dashboard" element={<RedirectToDashboard />} />

//       {/* ✅ Seller Routes */}
//       <Route path="/dashboard/seller" element={<ProtectedRoute element={<SellerDashboard />} />} />
//       <Route
//         path="/dashboard/seller/scrap-management"
//         element={<ProtectedRoute element={<ScrapManagement />} />}
//       />
//       <Route path="/profile" element={<ProtectedRoute element={<Profile isSidebarCollapsed={false} />} />} />

//       {/* ✅ Scraper Dashboard Route */}
//       <Route path="/dashboard/scraper" element={<ProtectedRoute element={<ScraperDashboard />} />} />

//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// };

// export default App;




import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { auth, db, onAuthStateChanged } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import AuthPage from "./components/auth/AuthPage";
import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
import ScraperDashboard from "./components/Dashboards/ScraperDashboard/ScraperDashboard"; // ✅ Import Scraper Dashboard
import Profile from "./components/Dashboards/Profile";
import ScrapManagement from "./components/Dashboards/SellerDashboard/ScrapManagement";
import AvailableRequests from "./components/Dashboards/ScraperDashboard/AvailableRequests";
import AcceptedRequests from "./components/Dashboards/ScraperDashboard/AcceptedRequests"; // ✅ Import Accepted Requests

const ProtectedRoute = ({ element, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().accountType); // ✅ Get the user role (scraper/seller)
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return element;
};

// ✅ Fix: Add PropTypes validation
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.array.isRequired,
};

const RedirectToDashboard = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().accountType); // ✅ Get the role
        }
      }
      // setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" />;
  return userRole === "scraper" ? <Navigate to="/dashboard/scraper" /> : <Navigate to="/dashboard/seller" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<RedirectToDashboard />} />

      {/* ✅ Seller Routes */}
      <Route path="/dashboard/seller" element={<ProtectedRoute element={<SellerDashboard />} allowedRoles={["seller"]} />} />
      <Route path="/dashboard/seller/scrap-management" element={<ProtectedRoute element={<ScrapManagement />} allowedRoles={["seller"]} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={["seller", "scraper"]} />} />

      {/* ✅ Scraper Dashboard Route */}
      <Route path="/dashboard/scraper" element={<ProtectedRoute element={<ScraperDashboard />} allowedRoles={["scraper"]} />} />
      <Route path="/dashboard/scraper/requests" element={<ProtectedRoute element={<AvailableRequests />} allowedRoles={["scraper"]} />} />
      <Route path="/dashboard/scraper/accepted" element={<ProtectedRoute element={<AcceptedRequests />} allowedRoles={["scraper"]} />} /> {/* ✅ NEW ROUTE ADDED */}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;




