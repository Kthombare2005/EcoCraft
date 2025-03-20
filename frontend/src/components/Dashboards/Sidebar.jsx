import { useState, useEffect } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Typography, Box, useMediaQuery, Badge } from "@mui/material";
import { 
  Dashboard as DashboardIcon,
  Recycling as RecyclingIcon,
  AutoAwesome as TransformIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ShoppingCart as CartIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, onAuthStateChanged } from "../../firebaseConfig";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";

const Sidebar = () => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [open, setOpen] = useState(!isSmallScreen);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNewPickups, setHasNewPickups] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

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

    let isInitialLoad = true;
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!isInitialLoad && snapshot.docChanges().length > 0) {
        setHasNewPickups(true);
        setNotificationCount(prevCount => prevCount + 1);
      }
      isInitialLoad = false;
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (location.pathname === "/dashboard/seller/accepted-pickups") {
      setHasNewPickups(false);
      setNotificationCount(0);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    { 
      text: "Home", 
      icon: <DashboardIcon sx={{ color: "#004080" }} />, 
      path: "/dashboard/seller" 
    },
    { 
      text: "Sell Scrap", 
      icon: <RecyclingIcon sx={{ color: "#004080" }} />, 
      path: "/dashboard/seller/scrap-management" 
    },
    { 
      text: "Transform Scrap", 
      icon: <TransformIcon sx={{ color: "#004080" }} />, 
      path: "/transform-scrap" 
    },
    { 
      text: "Accepted Pickups", 
      icon: (
        <Badge 
          badgeContent={hasNewPickups ? notificationCount : 0} 
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#ff4444",
              color: "white",
              right: -3,
              top: 3,
              animation: hasNewPickups ? "pulse 2s infinite" : "none",
            },
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.2)" },
              "100%": { transform: "scale(1)" },
            }
          }}
        >
          <CheckCircleIcon sx={{ color: "#004080" }} />
        </Badge>
      ), 
      path: "/dashboard/seller/accepted-pickups" 
    },
    { 
      text: "Declined Requests", 
      icon: <CancelIcon sx={{ color: "#004080" }} />, 
      path: "/dashboard/seller/declined-pickups" 
    },
    { 
      text: "Profile", 
      icon: <ProfileIcon sx={{ color: "#004080" }} />, 
      path: "/profile" 
    },
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
          <MenuIcon />
        </IconButton>
      </div>

      <Divider sx={{ backgroundColor: "rgba(0, 64, 128, 0.2)" }} />

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              "&:hover": { backgroundColor: "rgba(0, 64, 128, 0.1)" },
              backgroundColor: location.pathname === item.path ? "#42A5F5" : "transparent",
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
            <LogoutIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Logout" sx={{ marginLeft: "8px" }} />}
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
