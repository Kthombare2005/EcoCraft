// import { useState, useEffect } from "react";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   IconButton,
//   Typography,
//   Box,
//   useMediaQuery,
// } from "@mui/material";
// import { Home, Assignment, LocalShipping, CheckCircle, Map, AccountCircle, ExitToApp, Menu } from "@mui/icons-material";
// import { useNavigate, useLocation } from "react-router-dom";
// import { auth, db, onAuthStateChanged } from "../../../firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";

// const ScraperSidebar = () => {
//   const isSmallScreen = useMediaQuery("(max-width: 600px)");
//   const [open, setOpen] = useState(!isSmallScreen);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const fetchUserData = async (uid) => {
//     try {
//       const userDoc = await getDoc(doc(db, "users", uid));
//       if (userDoc.exists()) {
//         setUser(userDoc.data());
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         fetchUserData(currentUser.uid);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     setOpen(!isSmallScreen);
//   }, [isSmallScreen]);

//   const handleLogout = async () => {
//     await auth.signOut();
//     navigate("/login");
//   };

//   const menuItems = [
//     { text: "Dashboard", icon: <Home />, path: "/dashboard/scraper" },
//     { text: "Available Requests", icon: <Assignment />, path: "/dashboard/scraper/requests" },  // New Section
//     { text: "Accepted Requests", icon: <LocalShipping />, path: "/dashboard/scraper/accepted" },
//     { text: "Completed Requests", icon: <CheckCircle />, path: "/dashboard/scraper/completed" },
//     { text: "Live Map", icon: <Map />, path: "/dashboard/scraper/map" },
//     { text: "Profile", icon: <AccountCircle />, path: "/profile" },
//   ];

//   return (
//     <Drawer
//       variant="permanent"
//       anchor="left"
//       sx={{
//         width: open ? 250 : 80,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: open ? 250 : 80,
//           boxSizing: "border-box",
//           background: "linear-gradient(45deg, #E3F2FD, #BBDEFB, #90CAF9, #64B5F6, #42A5F5)",
//           backgroundSize: "400% 400%",
//           animation: "gradientMove 8s infinite alternate",
//           color: "#004080",
//           height: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//         },
//       }}
//     >
//       <style>
//         {`
//           @keyframes gradientMove {
//             0% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//             100% { background-position: 0% 50%; }
//           }
//         `}
//       </style>

//       {/* Sidebar Header */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px" }}>
//         {open && (
//           <Typography
//             variant="h6"
//             sx={{
//               color: "#004080",
//               fontFamily: "Arvo, serif",
//               fontSize: "24px",
//               fontWeight: "bold",
//               margin: 0,
//             }}
//           >
//             EcoCraft-Scraper
//           </Typography>
//         )}
//         <IconButton onClick={() => setOpen(!open)} sx={{ color: "#004080" }}>
//           <Menu />
//         </IconButton>
//       </div>

//       <Divider sx={{ backgroundColor: "rgba(0, 64, 128, 0.2)" }} />

//       {/* Navigation Menu */}
//       <List sx={{ flexGrow: 1 }}>
//         {menuItems.map((item, index) => (
//           <ListItem
//             button
//             key={index}
//             onClick={() => navigate(item.path)}
//             sx={{
//               "&:hover": { backgroundColor: "rgba(0, 64, 128, 0.1)" },
//               backgroundColor: location.pathname === item.path ? "#42A5F5" : "transparent",
//               color: location.pathname === item.path ? "white" : "#004080",
//               display: "flex",
//               flexDirection: open ? "row" : "column",
//               alignItems: "center",
//               justifyContent: open ? "flex-start" : "center",
//               padding: open ? "10px 16px" : "12px",
//               textAlign: "center",
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 color: location.pathname === item.path ? "white" : "#004080",
//                 minWidth: open ? "40px" : "100%",
//                 display: "flex",
//                 justifyContent: "center",
//               }}
//             >
//               {item.icon}
//             </ListItemIcon>
//             {open ? (
//               <ListItemText
//                 primary={item.text}
//                 sx={{
//                   fontSize: "16px",
//                   fontFamily: "Roboto Slab, serif",
//                   marginLeft: "8px",
//                 }}
//               />
//             ) : (
//               <Typography
//                 sx={{
//                   fontSize: "12px",
//                   fontFamily: "Roboto Slab, serif",
//                   marginTop: "4px",
//                 }}
//               >
//                 {item.text}
//               </Typography>
//             )}
//           </ListItem>
//         ))}
//       </List>

//       {/* User Profile */}
//       {user && open && (
//         <Box sx={{ padding: "16px", textAlign: "center", fontFamily: "Roboto Slab, serif" }}>
//           <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#004080" }}>
//             {user.name || "User"}
//           </Typography>
//           <Typography variant="body2" sx={{ color: "#004080", marginTop: "4px" }}>
//             {user.email || "No Email Provided"}
//           </Typography>
//         </Box>
//       )}

//       {/* Logout Button */}
//       <Box sx={{ padding: "16px" }}>
//         <ListItem
//           button
//           onClick={handleLogout}
//           sx={{
//             bgcolor: "#ff4d4d",
//             color: "white",
//             borderRadius: "8px",
//             "&:hover": { bgcolor: "#ff2d2d" },
//             display: "flex",
//             justifyContent: open ? "flex-start" : "center",
//           }}
//         >
//           <ListItemIcon
//             sx={{
//               color: "white",
//               display: "flex",
//               justifyContent: open ? "flex-start" : "center",
//             }}
//           >
//             <ExitToApp />
//           </ListItemIcon>
//           {open && <ListItemText primary="Logout" sx={{ marginLeft: "8px" }} />}
//         </ListItem>
//       </Box>
//     </Drawer>
//   );
// };

// export default ScraperSidebar;

import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  Home,
  Assignment,
  LocalShipping,
  CheckCircle,
  Map,
  AccountCircle,
  ExitToApp,
  Menu,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { Badge } from "@mui/material";
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Ensure db is imported
import {   doc, getDocs, setDoc, } from "firebase/firestore";


const ScraperSidebar = () => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [open, setOpen] = useState(!isSmallScreen);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrapRequestsCount, setScrapRequestsCount] = useState(0);
  // const [acceptedRequestsCount, setAcceptedRequestsCount] = useState(0); // 🔥 Add this line

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      setLoading(true);
      setNextPage(path); // Store the next page to load

      setTimeout(() => {
        navigate(path);
        setLoading(false); // Hide loader AFTER transition
      }, 700);
    }
  };

  const fetchUnseenScrapCount = async (uid) => {
    try {
      const unseenRef = collection(db, "users", uid, "unseenRequests");
      const unseenSnapshot = await getDocs(unseenRef);
      return unseenSnapshot.size; // Count of unseen requests
    } catch (error) {
      console.error("Error fetching unseen scrap count:", error);
      return 0;
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
  
    // Fetch unseen scrap requests count
    const fetchCount = async () => {
      const unseenCount = await fetchUnseenScrapCount(user.uid);
      setScrapRequestsCount(unseenCount);
    };
  
    fetchCount(); // ✅ Call function here
  
    const q = query(
      collection(db, "pickupRequests"),
      where("scraperId", "==", user.uid),
      where("status", "==", "Pending")
    );
  
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const unseenRef = collection(db, "users", user.uid, "unseenRequests");
      const unseenSnapshot = await getDocs(unseenRef);
      const seenRequests = unseenSnapshot.docs.map((doc) => doc.id); // IDs of seen requests
  
      let unseenCount = 0;
  
      snapshot.docs.forEach(async (docSnap) => {
        const requestId = docSnap.id;
  
        // If request is NOT in unseenRequests, mark it as unseen
        if (!seenRequests.includes(requestId)) {
          await setDoc(doc(db, "users", user.uid, "unseenRequests", requestId), {
            timestamp: new Date(),
          });
          unseenCount++;
        }
      });
  
      setScrapRequestsCount(unseenCount); // ✅ Update badge count
    });
  
    return () => unsubscribe();
  }, []); 
  

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <Home />, path: "/dashboard/scraper" },
    {
      text: "Available Requests",
      icon: (
        <Badge
          badgeContent={scrapRequestsCount > 0 ? scrapRequestsCount : null}
          color="error"
        >
          <Assignment />
        </Badge>
      ),
      path: "/dashboard/scraper/requests",
    },
    {
      text: "Accepted Requests",
      icon: <LocalShipping />,
      path: "/dashboard/scraper/accepted",
    },
    {
      text: "Completed Requests",
      icon: <CheckCircle />,
      path: "/dashboard/scraper/completed",
    },
    { text: "Live Map", icon: <Map />, path: "/dashboard/scraper/map" },
    { text: "Profile", icon: <AccountCircle />, path: "/profile" },
  ];

  return (
    <>
      {/* Keep Previous Page Visible While Loading */}
      {loading && (
        <Backdrop
          sx={{
            color: "#004080",
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={true}
        >
          <CircularProgress size={80} />
          <Typography
            sx={{ marginTop: "10px", fontWeight: "bold", color: "#004080" }}
          >
            {nextPage
              ? `Loading ${nextPage.split("/").pop()}...`
              : "Loading..."}
          </Typography>
        </Backdrop>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: open ? 250 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 250 : 80,
            boxSizing: "border-box",
            background:
              "linear-gradient(45deg, #E3F2FD, #BBDEFB, #90CAF9, #64B5F6, #42A5F5)",
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
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}
        </style>

        {/* Sidebar Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          {open && (
            <Typography
              variant="h6"
              sx={{
                color: "#004080",
                fontFamily: "Arvo, serif",
                fontSize: "24px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              EcoCraft-Scraper
            </Typography>
          )}
          <IconButton onClick={() => setOpen(!open)} sx={{ color: "#004080" }}>
            <Menu />
          </IconButton>
        </div>

        <Divider sx={{ backgroundColor: "rgba(0, 64, 128, 0.2)" }} />

        {/* Navigation Menu */}
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleNavigation(item.path)}
              sx={{
                "&:hover": { backgroundColor: "rgba(0, 64, 128, 0.1)" },
                backgroundColor:
                  location.pathname === item.path ? "#42A5F5" : "transparent",
                color: location.pathname === item.path ? "white" : "#004080",
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
                  color: location.pathname === item.path ? "white" : "#004080",
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
            {open && (
              <ListItemText primary="Logout" sx={{ marginLeft: "8px" }} />
            )}
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default ScraperSidebar;
