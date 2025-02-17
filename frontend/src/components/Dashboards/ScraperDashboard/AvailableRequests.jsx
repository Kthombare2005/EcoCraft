// import { useEffect, useState } from "react";
// import { db, auth } from "../../../firebaseConfig";
// import { collection, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";
// import {
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
// } from "@mui/material";
// import Sidebar from "./ScraperSidebar";
// import { motion } from "framer-motion";
// import "animate.css";

// const AvailableRequests = () => {
//   const [requests, setRequests] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [loading, setLoading] = useState(true); // Loading state

//   useEffect(() => {
//     const fetchPickupRequests = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       setLoading(true); // Start loading
//       setTimeout(() => setLoading(false), 800); // Simulate load delay

//       const q = query(collection(db, "pickupRequests"), where("scraperId", "==", user.uid));
//       onSnapshot(q, async (snapshot) => {
//         const pickupData = [];

//         for (let docSnap of snapshot.docs) {
//           const requestData = docSnap.data();

//           // Fetch seller details using userId from pickupRequests
//           const sellerDocRef = doc(db, "users", requestData.userId);
//           const sellerDoc = await getDoc(sellerDocRef);
//           const sellerData = sellerDoc.exists() ? sellerDoc.data() : { name: "Unknown Seller" };

//           pickupData.push({
//             id: docSnap.id,
//             ...requestData,
//             sellerName: sellerData.name,
//             sellerContact: sellerData.ContactNumber || "N/A",
//           });
//         }

//         setRequests(pickupData);
//         setLoading(false); // Stop loading after fetching
//       });
//     };

//     fetchPickupRequests();
//   }, []);

//   const handleOpenDetails = (request) => {
//     setSelectedRequest(request);
//   };

//   const handleCloseDetails = () => {
//     setSelectedRequest(null);
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
//       <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
//       <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
//         <Typography variant="h4" sx={{ fontWeight: "bold", color: "#004080", fontFamily: "Arvo, serif", marginBottom: "20px" }}>
//           Available Pickup Requests
//         </Typography>

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
//             <CircularProgress size={60} sx={{ color: "#004080" }} />
//           </Box>
//         ) : (
//           <Grid container spacing={3}>
//             {requests.length > 0 ? (
//               requests.map((request) => (
//                 <Grid item xs={12} sm={6} md={4} key={request.id}>
//                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }}>
//                     <Card sx={{ borderRadius: "12px", backgroundColor: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
//                       {request.image ? (
//                         <CardMedia component="img" height="200" image={request.image} alt={request.scrapName} sx={{ borderRadius: "12px 12px 0 0" }} />
//                       ) : (
//                         <Box sx={{ height: "200px", backgroundColor: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                           <Typography variant="h6" sx={{ color: "#888" }}>No Image Available</Typography>
//                         </Box>
//                       )}
//                       <CardContent>
//                         <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004080" }}>
//                           {request.scrapName}
//                         </Typography>
//                         <Typography variant="body2">Seller: {request.sellerName}</Typography>
//                         <Typography variant="body2">Location: {request.city}, {request.state}</Typography>
//                         <Typography variant="body2">Weight: {request.weight} {request.unit}</Typography>
//                         <Typography variant="body2" sx={{ fontWeight: "bold", color: "#28a745" }}>
//                           ₹{request.price || "N/A"}
//                         </Typography>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           sx={{ marginTop: "10px", width: "100%" }}
//                           onClick={() => handleOpenDetails(request)}
//                         >
//                           View Details
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 </Grid>
//               ))
//             ) : (
//               <Typography variant="body1" sx={{ textAlign: "center", color: "gray", fontStyle: "italic", marginTop: "20px" }}>
//                 No pickup requests available.
//               </Typography>
//             )}
//           </Grid>
//         )}

//         {/* Dialog for Viewing Full Details */}
//         <Dialog open={!!selectedRequest} onClose={handleCloseDetails} fullWidth>
//           {selectedRequest && (
//             <>
//               <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", color: "#004080" }}>
//                 Pickup Request Details
//               </DialogTitle>
//               <DialogContent>
//                 {selectedRequest.image && (
//                   <Box sx={{ textAlign: "center", marginBottom: "16px" }}>
//                     <img src={selectedRequest.image} alt="Scrap" style={{ maxWidth: "100%", borderRadius: "8px" }} />
//                   </Box>
//                 )}
//                 <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004080" }}>
//                   Scrap Name: {selectedRequest.scrapName}
//                 </Typography>
//                 <Typography>Scrap Type: {selectedRequest.scrapType}</Typography>
//                 <Typography>Weight: {selectedRequest.weight} {selectedRequest.unit}</Typography>
//                 <Typography>Price: ₹{selectedRequest.price}</Typography>
//                 <Typography>Location: {selectedRequest.city}, {selectedRequest.state}</Typography>
//                 <Typography>Address: {selectedRequest.address}</Typography>
//                 <Typography>Seller: {selectedRequest.sellerName}</Typography>
//                 <Typography>Contact: {selectedRequest.sellerContact}</Typography>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleCloseDetails} color="primary" variant="contained">
//                   Close
//                 </Button>
//               </DialogActions>
//             </>
//           )}
//         </Dialog>
//       </Box>
//     </Box>
//   );
// };

// export default AvailableRequests;

import { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Sidebar from "./ScraperSidebar";
import { motion } from "framer-motion";
import "animate.css";
import { updateDoc } from "firebase/firestore";
import { Snackbar, Alert } from "@mui/material";

const AvailableRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    const q = query(
      collection(db, "pickupRequests"),
      where("scraperId", "==", user.uid),
      where("status", "==", "Pending Approval") // ✅ Fix: Match Firestore status field
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const pickupData = [];

      for (let docSnap of snapshot.docs) {
        const requestData = docSnap.data();
        if (requestData.status !== "Pending Approval") continue; // ✅ Ensure only Pending Approval requests are added

        const sellerDocRef = doc(db, "users", requestData.userId);
        const sellerDoc = await getDoc(sellerDocRef);
        const sellerData = sellerDoc.exists()
          ? sellerDoc.data()
          : { name: "Unknown Seller" };

        let scrapImage = null;
        let scrapType = "Unknown Scrap";

        if (requestData.scrapId) {
          const scrapDocRef = doc(db, "scrapListings", requestData.scrapId);
          const scrapDoc = await getDoc(scrapDocRef);
          if (scrapDoc.exists()) {
            const scrapData = scrapDoc.data();
            scrapImage = scrapData.image || null;
            scrapType = scrapData.scrapType || "Unknown Scrap";
          }
        }

        pickupData.push({
          id: docSnap.id,
          ...requestData,
          sellerName: sellerData.name,
          sellerContact: sellerData.ContactNumber || "N/A",
          image: scrapImage,
          scrapType: scrapType,
        });
      }

      setRequests(pickupData);
      setLoading(false);
    });

    return () => unsubscribe(); // ✅ Cleanup Firestore listener when component unmounts
  }, []);

  const handleOpenDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleApprove = async (requestId) => {
    try {
      await updateDoc(doc(db, "pickupRequests", requestId), {
        status: "Accepted", // ✅ Ensure correct status is used
      });

      // ✅ Immediately remove from UI
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      setSnackbar({
        open: true,
        message: "Request accepted successfully! Moved to Accepted Requests ✅",
        severity: "success",
      });
    } catch (error) {
      console.error("Error approving request:", error);
      setSnackbar({
        open: true,
        message: "Failed to approve pickup request.",
        severity: "error",
      });
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await db.collection("pickupRequests").doc(requestId).update({
        status: "Declined",
      });
      alert("Pickup request declined successfully! ❌");
    } catch (error) {
      console.error("Error declining request:", error);
      alert("Failed to decline pickup request.");
    }
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#004080",
            fontFamily: "Arvo, serif",
            marginBottom: "20px",
          }}
        >
          Available Pickup Requests
        </Typography>

        {/* Unified Global Loader */}
        <Backdrop
          sx={{
            color: "#004080",
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={loading}
        >
          <CircularProgress size={80} />
          <Typography
            sx={{ marginTop: "10px", fontWeight: "bold", color: "#004080" }}
          >
            Fetching Pickup Requests...
          </Typography>
        </Backdrop>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
        >
          <Grid container spacing={3}>
            {requests.length > 0 ? (
              requests.map((request) => (
                <Grid item xs={12} sm={6} md={4} key={request.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {request.image ? (
                        <CardMedia
                          component="img"
                          image={request.image}
                          alt={request.scrapName}
                          sx={{
                            width: "100%",
                            height: { xs: "180px", sm: "220px", md: "250px" }, // ✅ Responsive height
                            objectFit: "cover", // ✅ Ensures image fills the area correctly
                            borderRadius: "12px 12px 0 0",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: "200px",
                            backgroundColor: "#e0e0e0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6" sx={{ color: "#888" }}>
                            No Image Available
                          </Typography>
                        </Box>
                      )}
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#004080",
                            textAlign: "center", // 🔥 Center Align Scrap Name
                          }}
                        >
                          {request.scrapName}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Seller:</strong> {request.sellerName}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Location:</strong> {request.city},{" "}
                          {request.state}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Address:</strong> {request.address}{" "}
                          {/* 🔥 Address Added */}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Weight:</strong> {request.weight}{" "}
                          {request.unit}
                        </Typography>

                        {/* 🔥 Buttons for Approve, Decline & View Details */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            sx={{ width: "32%" }}
                            onClick={() => handleApprove(request.id)}
                          >
                            ✅ Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ width: "32%" }}
                            onClick={() => handleDecline(request.id)}
                          >
                            ❌ Decline
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ width: "32%" }}
                            onClick={() => handleOpenDetails(request)}
                          >
                            🔍 View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  color: "gray",
                  fontStyle: "italic",
                  marginTop: "20px",
                }}
              >
                No pickup requests available.
              </Typography>
            )}
          </Grid>
        </motion.div>

        {/* Dialog for Viewing Full Details */}
        <Dialog
          open={!!selectedRequest}
          onClose={handleCloseDetails}
          fullWidth
          maxWidth="sm" // ✅ Ensures Dialog fits on all screen sizes
        >
          {selectedRequest && (
            <>
              <DialogTitle
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#004080",
                  fontSize: { xs: "18px", sm: "22px" }, // ✅ Responsive text size
                }}
              >
                Pickup Request Details
              </DialogTitle>
              <DialogContent
                sx={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* 🔥 Responsive Dialog Image */}
                {selectedRequest.image && (
                  <Box
                    sx={{
                      textAlign: "center",
                      marginBottom: "16px",
                      width: "100%",
                    }}
                  >
                    <img
                      src={selectedRequest.image}
                      alt="Scrap"
                      style={{
                        width: "100%",
                        maxWidth: "350px",
                        height: "auto",
                        borderRadius: "8px",
                      }} // ✅ Responsive image
                    />
                  </Box>
                )}

                {/* 🔥 Improved Spacing & Text Responsiveness */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#004080",
                      textAlign: "center",
                      fontSize: { xs: "16px", sm: "18px" },
                    }} // ✅ Adaptive font size
                  >
                    Scrap Name:{" "}
                    <span style={{ fontWeight: "normal", color: "#000" }}>
                      {selectedRequest.scrapName}
                    </span>
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    <strong>Scrap Type:</strong> {selectedRequest.scrapType}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    <strong>Weight:</strong> {selectedRequest.weight}{" "}
                    {selectedRequest.unit}
                  </Typography>
                  {selectedRequest.price && (
                    <Typography
                      variant="body1"
                      sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                    >
                      <strong>Price:</strong> ₹{selectedRequest.price}
                    </Typography>
                  )}
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    <strong>Location:</strong> {selectedRequest.city},{" "}
                    {selectedRequest.state}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    <strong>Address:</strong> {selectedRequest.address}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    <strong>Seller:</strong> {selectedRequest.sellerName}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    <strong>Contact:</strong> {selectedRequest.sellerContact}
                  </Typography>
                </Box>
              </DialogContent>

              {/* 🔥 Responsive Buttons */}
              <DialogActions
                sx={{
                  padding: "12px",
                  justifyContent: "center",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "10px",
                }}
              >
                <Button
                  onClick={handleCloseDetails}
                  color="primary"
                  variant="contained"
                  sx={{
                    width: { xs: "100%", sm: "auto" }, // ✅ Full width on mobile, auto on larger screens
                    padding: { xs: "10px", sm: "12px 24px" }, // ✅ Adjust padding for better touch experience
                    fontSize: { xs: "14px", sm: "16px" }, // ✅ Ensures readable button text
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AvailableRequests;
