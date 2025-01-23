import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Import Firebase auth

const ProtectedRoute = () => {
  const user = auth.currentUser; // Check if the user is logged in

  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, render the requested component
  return <Outlet />;
};

export default ProtectedRoute;