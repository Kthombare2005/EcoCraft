import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { auth, db, onAuthStateChanged } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import AuthPage from "./components/auth/AuthPage";
import SellerDashboard from "./components/Dashboards/SellerDashboard/SellerDashboard";
import ScraperDashboard from "./components/Dashboards/ScraperDashboard/ScraperDashboard";
import Profile from "./components/Dashboards/Profile";
import ScrapManagement from "./components/Dashboards/SellerDashboard/ScrapManagement";
import AvailableRequests from "./components/Dashboards/ScraperDashboard/AvailableRequests";
import AcceptedRequests from "./components/Dashboards/ScraperDashboard/AcceptedRequests";
import AcceptedPickups from "./components/Dashboards/SellerDashboard/AcceptedPickups";

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
          setUserRole(userDoc.data().accountType);
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

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.array.isRequired,
};

const RedirectToDashboard = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().accountType);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <Navigate to="/" />;
  return userRole === "scraper" ? <Navigate to="/dashboard/scraper" /> : <Navigate to="/dashboard/seller" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<RedirectToDashboard />} />

      <Route path="/dashboard/seller" element={<ProtectedRoute element={<SellerDashboard />} allowedRoles={["seller"]} />} />
      <Route path="/dashboard/seller/scrap-management" element={<ProtectedRoute element={<ScrapManagement />} allowedRoles={["seller"]} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={["seller", "scraper"]} />} />
      <Route path="/dashboard/seller/accepted-pickups" element={<AcceptedPickups />} />

      <Route path="/dashboard/scraper" element={<ProtectedRoute element={<ScraperDashboard />} allowedRoles={["scraper"]} />} />
      <Route path="/dashboard/scraper/requests" element={<ProtectedRoute element={<AvailableRequests />} allowedRoles={["scraper"]} />} />
      <Route path="/dashboard/scraper/accepted" element={<ProtectedRoute element={<AcceptedRequests />} allowedRoles={["scraper"]} />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;




