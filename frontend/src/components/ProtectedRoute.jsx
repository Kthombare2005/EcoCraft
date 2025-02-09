// import { Navigate, Outlet } from "react-router-dom";
// import { auth } from "../firebaseConfig"; // Import Firebase auth

// const ProtectedRoute = () => {
//   const user = auth.currentUser; // Check if the user is logged in

//   if (!user) {
//     // If the user is not logged in, redirect to the login page
//     return <Navigate to="/" replace />;
//   }

//   // If the user is logged in, render the requested component
//   return <Outlet />;
// };

// export default ProtectedRoute;




import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import { Navigate, Outlet } from "react-router-dom";
import { auth, db, onAuthStateChanged } from "../firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // ✅ Fetch user role from Firestore
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// ✅ Fix: Add PropTypes Validation
ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensures `allowedRoles` is an array of strings
};

export default ProtectedRoute;
