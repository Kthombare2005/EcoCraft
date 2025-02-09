import { useState, useEffect } from "react";
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
} from "@mui/material";
import { Home, DirectionsCar, History, AccountCircle, ExitToApp, Menu } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, onAuthStateChanged } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ScraperSidebar = () => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [open, setOpen] = useState(!isSmallScreen);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  // ✅ Updated menu for SCRAPER DASHBOARD
  const menuItems = [
    { text: "Home", icon: <Home />, path: "/dashboard/scraper" },
    { text: "Pickup Requests", icon: <DirectionsCar />, path: "/dashboard/scraper/pickups" },
    { text: "Pickup History", icon: <History />, path: "/dashboard/scraper/history" },
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
          background: "linear-gradient(45deg, #E0F7FA, #80DEEA, #4DD0E1, #26C6DA, #00ACC1)",
          backgroundSize: "400% 400%",
          animation: "gradientMove 8s infinite alternate",
          color: "#004D40",
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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px" }}>
        {open && (
          <Typography
            variant="h6"
            sx={{
              color: "#004D40",
              fontFamily: "Arvo, serif",
              fontSize: "24px",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            EcoCraft - Scraper
          </Typography>
        )}
        <IconButton onClick={() => setOpen(!open)} sx={{ color: "#004D40" }}>
          <Menu />
        </IconButton>
      </div>

      <Divider sx={{ backgroundColor: "rgba(0, 77, 64, 0.2)" }} />

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              "&:hover": { backgroundColor: "rgba(0, 77, 64, 0.1)" },
              backgroundColor: location.pathname === item.path ? "#26C6DA" : "transparent",
              color: location.pathname === item.path ? "white" : "#004D40",
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
                color: location.pathname === item.path ? "white" : "#004D40",
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

      {user && open && (
        <Box sx={{ padding: "16px", textAlign: "center", fontFamily: "Roboto Slab, serif" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#004D40" }}>
            {user.name || "Scraper"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#004D40", marginTop: "4px" }}>
            {user.email || "No Email Provided"}
          </Typography>
        </Box>
      )}

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

export default ScraperSidebar;
