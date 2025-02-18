import { useState, useEffect } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Typography, Box, useMediaQuery, Badge } from "@mui/material";
import { Home, Store, Build, AccountCircle, ExitToApp, Menu, LocalShipping } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, onAuthStateChanged } from "../../firebaseConfig";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";

const Sidebar = () => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [open, setOpen] = useState(!isSmallScreen);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [acceptedPickupsCount, setAcceptedPickupsCount] = useState(0);

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

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const pickupRequestsRef = collection(db, "pickupRequests");
    const q = query(
      pickupRequestsRef,
      where("userId", "==", userId),
      where("status", "==", "Accepted")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAcceptedPickupsCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/dashboard/seller" },
    { text: "Sell Scrap", icon: <Store />, path: "/dashboard/seller/sell-scrap" },
    { text: "Transform Scrap", icon: <Build />, path: "/dashboard/seller/transform-scrap" },
    { 
      text: "Accepted Pickups", 
      icon: (
        <Badge 
          badgeContent={acceptedPickupsCount} 
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#ff4444",
              color: "white",
              fontWeight: "bold",
              animation: acceptedPickupsCount > 0 ? "pulse 2s infinite" : "none",
            },
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.2)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <LocalShipping />
        </Badge>
      ), 
      path: "/dashboard/seller/accepted-pickups" 
    },
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
              color: "#004080",
              fontFamily: "Arvo, serif",
              fontSize: "24px",
              fontWeight: "bold",
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

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              backgroundColor: location.pathname === item.path ? "rgba(255, 255, 255, 0.1)" : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              marginBottom: "8px",
              borderRadius: "8px",
              marginX: "8px",
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              {item.icon}
            </ListItemIcon>
            {open && <ListItemText primary={item.text} sx={{ marginLeft: "8px" }} />}
          </ListItem>
        ))}
      </List>

      {user && open && (
        <Box sx={{ padding: "16px", textAlign: "center", fontFamily: "Roboto Slab, serif" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#004080" }}>
            {user.name || "User"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#004080", marginTop: "4px" }}>
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

export default Sidebar;
