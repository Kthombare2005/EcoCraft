// import { useState } from "react";
// import { Box, Typography, Tooltip, useMediaQuery } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import Sidebar from "../Sidebar";
// import { motion } from "framer-motion";

// const ScrapManagement = () => {
//   const isSmallScreen = useMediaQuery("(max-width: 600px)");
//   const [expanded, setExpanded] = useState(false);

//   const handleAddScrap = () => {
//     if (isSmallScreen && !expanded) {
//       setExpanded(true); // First click expands the button
//     } else {
//       alert("List New Scrap button clicked!"); // Second click performs the action
//       setExpanded(false); // Reset expansion after action
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
//       {/* Sidebar */}
//       <Sidebar isOpen />

//       {/* Main Content */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           padding: "24px",
//           backgroundColor: "#f8f9fa",
//           position: "relative",
//           overflowY: "auto",
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: "#004080",
//             fontFamily: "'Arvo', serif",
//             marginBottom: "20px",
//           }}
//         >
//           Scrap Management
//         </Typography>

//         {/* Floating Button with Continuous Zoom Animation */}
//         <Tooltip title="List New Scrap" arrow>
//           <motion.div
//             animate={{
//               scale: [1, 1.15, 1], // Creates continuous zoom in & out effect
//               boxShadow: ["0px 5px 15px rgba(0,0,0,0.2)", "0px 10px 25px rgba(0,128,0,0.5)", "0px 5px 15px rgba(0,0,0,0.2)"],
//             }}
//             transition={{
//               duration: 1.5, // Duration of each cycle
//               repeat: Infinity, // Infinite loop for continuous animation
//               ease: "easeInOut",
//             }}
//             style={{
//               position: "fixed",
//               bottom: "20px",
//               right: "20px",
//               zIndex: 1000,
//             }}
//           >
//             <motion.button
//               onClick={handleAddScrap}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: expanded || !isSmallScreen ? "8px" : "4px",
//                 backgroundColor: "#28a745",
//                 color: "white",
//                 fontWeight: "bold",
//                 borderRadius: "25px",
//                 padding: expanded || !isSmallScreen ? "12px 24px" : "12px",
//                 width: expanded || !isSmallScreen ? "auto" : "50px",
//                 transition: "all 0.3s ease-in-out",
//                 boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
//                 fontSize: expanded || !isSmallScreen ? "16px" : "12px",
//                 border: "none",
//                 cursor: "pointer",
//                 outline: "none",
//               }}
//               whileTap={{
//                 scale: 0.9,
//                 boxShadow: "0px 5px 10px rgba(0, 128, 0, 0.3)",
//               }}
//             >
//               <AddCircleIcon fontSize={expanded || !isSmallScreen ? "medium" : "small"} />
//               {(expanded || !isSmallScreen) && "List New Scrap"}
//             </motion.button>
//           </motion.div>
//         </Tooltip>
//       </Box>
//     </Box>
//   );
// };

// export default ScrapManagement;




import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../Sidebar";
import { motion } from "framer-motion";
import { db, auth } from "../../../firebaseConfig";
import { collection, addDoc, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ScrapManagement = () => {
  const [scrapListings, setScrapListings] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    city: "",
    state: "",
    scrapType: "",
    weight: "",
    price: "",
  });

  const fetchScrapListings = () => {
    const scrapQuery = query(collection(db, "scrapListings"));
    onSnapshot(scrapQuery, (snapshot) => {
      const listings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setScrapListings(listings);
    });
  };

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const { name, ContactNumber } = userDoc.data();
        setFormData((prev) => ({
          ...prev,
          name: name || "",
          contactNumber: ContactNumber || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchScrapListings();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribeAuth();
    };
  }, []);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData((prev) => ({
      ...prev,
      city: "",
      state: "",
      scrapType: "",
      weight: "",
      price: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      await addDoc(collection(db, "scrapListings"), formData);
      handleDialogClose();
    } catch (error) {
      console.error("Error adding scrap listing:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} activeMenuItem="Sell Scrap" />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          padding: "24px",
          transition: "margin-left 0.3s ease",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#004080",
            fontFamily: "'Arvo', serif",
            marginBottom: "20px",
          }}
        >
          Scrap Management
        </Typography>

        {/* Scrap Listings */}
        <Grid container spacing={3}>
          {scrapListings.map((listing) => (
            <Grid item xs={12} sm={6} key={listing.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                      {listing.scrapType}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Location: {listing.city}, {listing.state}
                    </Typography>
                    <Typography variant="body2">Weight: {listing.weight}</Typography>
                    <Typography variant="body2">Expected Price: {listing.price}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Floating Button */}
        <Fab
          color="success"
          variant={isSmallScreen ? "circular" : "extended"}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            fontWeight: "bold",
            boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0px 10px 20px rgba(0,0,0,0.4)",
            },
            animation: "zoomInOut 2s infinite",
          }}
          onClick={handleDialogOpen}
        >
          <AddIcon />
          {!isSmallScreen && " List New Scrap"}
        </Fab>
        <style>
          {`
            @keyframes zoomInOut {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }
          `}
        </style>

        {/* Add Scrap Dialog */}
        <Dialog open={dialogOpen} onClose={handleDialogClose}style={{height: '90%'}}>
          <DialogTitle>Add Scrap Listing</DialogTitle>
          <DialogContent>
  <Grid container spacing={2}>
    {[
      { label: "Name", name: "name", type: "text", disabled: true,},
      { label: "Contact Number", name: "contactNumber", type: "text", disabled: true },
      { label: "City", name: "city", type: "text" },
      { label: "State", name: "state", type: "text" },
      { label: "Scrap Type", name: "scrapType", type: "text" },
      { label: "Approx Weight", name: "weight", type: "text" },
      { label: "Expected Price", name: "price", type: "text" },
    ].map((field, index) => (
      <Grid item xs={12} key={index}>
        <TextField
          fullWidth
          label={field.label}
          name={field.name}
          value={formData[field.name]}
          onChange={handleInputChange}
          type={field.type}
          variant="outlined"
          disabled={field.disabled}
          InputLabelProps={{
            style: { top: '2px' }, // Adjusts the label position
          }}
          sx={{ mt: 1 }} // Adds margin-top to separate fields
        />
      </Grid>
    ))}
  </Grid>
</DialogContent>

          <DialogActions>
            <Button onClick={handleDialogClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} color="success" variant="contained">
              Add Scrap
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ScrapManagement;

