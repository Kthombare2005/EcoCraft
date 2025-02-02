// import PropTypes from "prop-types"; // Import PropTypes for validation
// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "./Sidebar.css";

// const Sidebar = ({ onToggle }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const location = useLocation();

//   const toggleSidebar = () => {
//     const newState = !isCollapsed;
//     setIsCollapsed(newState);
//     onToggle(newState); // Notify parent component
//   };

//   useEffect(() => {
//     if (window.innerWidth <= 768) {
//       setIsCollapsed(true); // Default collapsed on small screens
//     }
//   }, []);

//   return (
//     <div className={`navigation ${isCollapsed ? "collapsed" : ""}`}>
//       <ul>
//         <li className="brand">
//           {!isCollapsed && (
//             <span className="title">
//               Eco<span>Craft</span>
//             </span>
//           )}
//         </li>
//         <li className={location.pathname === "/dashboard/seller" ? "active" : ""}>
//           <Link to="/dashboard/seller">
//             <span className="icon">
//               <ion-icon name="home-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Home</span>}
//           </Link>
//         </li>
//         <li className={location.pathname === "/profile" ? "active" : ""}>
//           <Link to="/profile">
//             <span className="icon">
//               <ion-icon name="person-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Profile</span>}
//           </Link>
//         </li>
//         {/* Add more menu items as needed */}
//         <li className="logout">
//           <Link to="/logout">
//             <span className="icon">
//               <ion-icon name="log-out-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Logout</span>}
//           </Link>
//         </li>
//       </ul>
//       <div className="toggle" onClick={toggleSidebar}>
//         <ion-icon
//           name={isCollapsed ? "chevron-forward-outline" : "chevron-back-outline"}
//         ></ion-icon>
//       </div>
//     </div>
//   );
// };

// // Add PropTypes validation
// Sidebar.propTypes = {
//   onToggle: PropTypes.func.isRequired, // Ensure 'onToggle' is passed as a function
// };

// export default Sidebar;


// import PropTypes from "prop-types";
// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "./Sidebar.css";

// const Sidebar = ({ onToggle }) => {
//   const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);
//   const location = useLocation();

//   useEffect(() => {
//     const handleResize = () => {
//       setIsCollapsed(window.innerWidth <= 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => {
//     setIsCollapsed((prevState) => {
//       const newState = !prevState;
//       onToggle(newState);
//       return newState;
//     });
//   };

//   return (
//     <div className={`navigation ${isCollapsed ? "collapsed" : ""}`}>
//       <ul>
//         <li className="brand">
//           {!isCollapsed && (
//             <span className="title">
//               Eco<span>Craft</span>
//             </span>
//           )}
//         </li>
//         <li className={location.pathname === "/dashboard/seller" ? "active" : ""}>
//           <Link to="/dashboard/seller">
//             <span className="icon">
//               <ion-icon name="home-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Home</span>}
//           </Link>
//         </li>
//         <li className={location.pathname === "/profile" ? "active" : ""}>
//           <Link to="/profile">
//             <span className="icon">
//               <ion-icon name="person-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Profile</span>}
//           </Link>
//         </li>
//         <li className="logout">
//           <Link to="/logout">
//             <span className="icon">
//               <ion-icon name="log-out-outline"></ion-icon>
//             </span>
//             {!isCollapsed && <span className="title">Logout</span>}
//           </Link>
//         </li>
//       </ul>
//       <div className="toggle" onClick={toggleSidebar}>
//         <ion-icon
//           name={isCollapsed ? "chevron-forward-outline" : "chevron-back-outline"}
//         ></ion-icon>
//       </div>
//     </div>
//   );
// };

// Sidebar.propTypes = {
//   onToggle: PropTypes.func.isRequired,
// };

// export default Sidebar;




import { useState, useEffect } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Typography, Box } from "@mui/material";
import { Home, Store, Build, AccountCircle, ExitToApp, Menu } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, onAuthStateChanged } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  // Fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid)); // Replace 'users' with your Firestore collection name
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.error("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Monitor authentication state and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        setUser(null); // Clear user data if not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  // Define the menu items
  const menuItems = [
    { text: "Home", icon: <Home />, path: "/dashboard/seller" },
    { text: "Sell Scrap", icon: <Store />, path: "/sell-scrap" },
    { text: "Transform Scrap", icon: <Build />, path: "/transform-scrap" },
    { text: "Profile", icon: <AccountCircle />, path: "/profile" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: open ? 250 : 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 250 : 80,
          boxSizing: "border-box",
          background: "linear-gradient(45deg, #E3F2FD, #BBDEFB, #90CAF9, #64B5F6, #42A5F5)",
          backgroundSize: "400% 400%",
          animation: "gradientMove 8s infinite alternate",
          color: "#004080",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Playwrite+VN:wght@100..400&family=Roboto+Slab:wght@100..900&display=swap');

          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* Sidebar Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px" }}>
        {open && (
          <Typography
            variant="h6"
            sx={{
              color: "#004080",
              fontFamily: "Arvo, serif",
              fontSize: "20px",
              margin: 0,
            }}
          >
            EcoCraft
          </Typography>
        )}
        <IconButton onClick={() => setOpen(!open)} sx={{ color: "#004080" }}>
          <Menu />
        </IconButton>
      </div>

      <Divider sx={{ backgroundColor: "rgba(0, 64, 128, 0.2)" }} />

      {/* Sidebar Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              "&:hover": { backgroundColor: "rgba(0, 64, 128, 0.1)" },
              backgroundColor: location.pathname === item.path ? "#42A5F5" : "transparent", // Highlight active item
              color: location.pathname === item.path ? "white" : "#004080", // Change text color for active item
              display: "flex",
              flexDirection: open ? "row" : "column",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
              padding: open ? "10px 16px" : "12px",
              textAlign: "center",
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? "white" : "#004080", // Change icon color for active item
                minWidth: open ? "40px" : "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open ? (
              <ListItemText
                primary={item.text}
                sx={{
                  fontSize: "16px",
                  fontFamily: "Roboto Slab, serif",
                  marginLeft: "8px",
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: "12px",
                  fontFamily: "Roboto Slab, serif",
                  marginTop: "4px",
                }}
              >
                {item.text}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>

      {/* User Profile Section */}
      {user && (
        <Box sx={{ padding: "16px", textAlign: "center", fontFamily: "Roboto Slab, serif" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#004080" }}>
            {user.name || "User"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#004080", marginTop: "4px" }}>
            {user.email || "No Email Provided"}
          </Typography>
        </Box>
      )}

      {/* Logout Button */}
      <Box sx={{ padding: "16px" }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            bgcolor: "#ff4d4d",
            color: "white",
            borderRadius: "8px",
            "&:hover": { bgcolor: "#ff2d2d" },
            display: "flex",
            justifyContent: open ? "flex-start" : "center",
          }}
        >
          <ListItemIcon
            sx={{
              color: "white",
              display: "flex",
              justifyContent: open ? "flex-start" : "center",
            }}
          >
            <ExitToApp />
          </ListItemIcon>
          {open && <ListItemText primary="Logout" sx={{ marginLeft: "8px" }} />}
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
