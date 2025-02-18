import { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "./ScraperSidebar";
import { motion } from "framer-motion";
import "animate.css";

const AcceptedRequests = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedScrap, setSelectedScrap] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const handleViewDetails = async (request) => {
    try {
      if (!request.scrapId) {
        setSelectedScrap({
          ...request,
          scrapDetails: "No additional details available.",
        });
        setOpenDetailsModal(true);
        return;
      }

      const scrapDocRef = doc(db, "scrapListings", request.scrapId);
      const scrapDoc = await getDoc(scrapDocRef);

      if (scrapDoc.exists()) {
        const scrapData = scrapDoc.data();

        setSelectedScrap({
          ...request,
          scrapName: scrapData.scrapName || "Unknown",
          scrapType: scrapData.scrapType || "Not specified",
          weight: scrapData.weight || "N/A",
          unit: scrapData.unit || "N/A",
          price: scrapData.price || "Not provided",
          pickupStatus: scrapData.pickupStatus || "N/A",
          address: scrapData.address || "No address available",
          pinCode: scrapData.pinCode || "N/A",
          city: scrapData.city || "Unknown",
          state: scrapData.state || "Unknown",
          contactNumber: scrapData.contactNumber || "Not provided",
          createdOn: scrapData.createdOn?.toDate().toLocaleString() || "N/A",
          image: scrapData.image || request.image,
          sellerName: scrapData.name || "Unknown Seller",
        });
      } else {
        setSelectedScrap({
          ...request,
          scrapDetails: "No additional details available.",
        });
      }

      setOpenDetailsModal(true);
    } catch (error) {
      console.error("Error fetching scrap details:", error);
      setSelectedScrap({ ...request, scrapDetails: "Error loading details." });
      setOpenDetailsModal(true);
    }
  };

  const handleChat = (requestId) => {
    console.log("Start chat for request:", requestId);
    // Implement chat functionality or navigation
  };

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setLoading(true);
      const q = query(
        collection(db, "pickupRequests"),
        where("scraperId", "==", user.uid),
        where("status", "==", "Accepted") // Fetch only accepted requests
      );

      onSnapshot(q, async (snapshot) => {
        const requestData = [];

        for (let docSnap of snapshot.docs) {
          const request = docSnap.data();

          // Fetch Seller Details
          const sellerDocRef = doc(db, "users", request.userId);
          const sellerDoc = await getDoc(sellerDocRef);
          const sellerData = sellerDoc.exists()
            ? sellerDoc.data()
            : { name: "Unknown Seller" };

          // Fetch Scrap Image & Type
          let scrapImage = null;
          let scrapType = "Unknown Scrap";

          if (request.scrapId) {
            const scrapDocRef = doc(db, "scrapListings", request.scrapId);
            const scrapDoc = await getDoc(scrapDocRef);
            if (scrapDoc.exists()) {
              const scrapData = scrapDoc.data();
              scrapImage = scrapData.image || null;
              scrapType = scrapData.scrapType || "Unknown Scrap";
            }
          }

          requestData.push({
            id: docSnap.id,
            ...request,
            sellerName: sellerData.name,
            sellerContact: sellerData.ContactNumber || "N/A",
            image: scrapImage,
            scrapType: scrapType,
          });
        }

        setAcceptedRequests(requestData);
        setTimeout(() => setLoading(false), 500);
      });
    };

    fetchAcceptedRequests();
  }, []);

  const handleCompleteRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, "pickupRequests", requestId), {
        status: "Completed",
      });

      // Remove from UI
      setAcceptedRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      // Show success notification
      setSnackbar({
        open: true,
        message: "Pickup request marked as completed! ✅",
        severity: "success",
      });
    } catch (error) {
      console.error("Error completing request:", error);
      setSnackbar({
        open: true,
        message: "Failed to mark request as completed.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <Sidebar />

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
          Accepted Pickup Requests
        </Typography>

        {/* Global Loader */}
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
            Fetching Accepted Requests...
          </Typography>
        </Backdrop>

        <Grid container spacing={3}>
          {acceptedRequests.length > 0 ? (
            acceptedRequests.map((request) => (
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
                        height="200"
                        image={request.image}
                        alt={request.scrapName}
                        sx={{ borderRadius: "12px 12px 0 0" }}
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
                          textAlign: "center",
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
                        <strong>Weight:</strong> {request.weight} {request.unit}
                      </Typography>

                      {/* Action Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="info"
                          sx={{ width: "32%" }}
                          onClick={() => handleViewDetails(request)}
                        >
                          📄 View Details
                        </Button>

                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ width: "32%" }}
                          onClick={() => handleChat(request.id)}
                        >
                          💬 Chat
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ width: "32%" }}
                          onClick={() => handleCompleteRequest(request.id)}
                        >
                          ✅ Complete
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
              No accepted requests available.
            </Typography>
          )}
        </Grid>

        {selectedScrap && (
          <Backdrop
            open={openDetailsModal}
            sx={{ zIndex: 9999, color: "#fff" }}
          >
            <Box
              sx={{
                width: { xs: "90%", sm: "75%", md: "50%" }, // Responsive width
                maxWidth: "500px", // Ensures it doesn't get too wide
                backgroundColor: "white",
                borderRadius: "12px",
                padding: { xs: "16px", md: "20px" }, // Smaller padding for small screens
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#004080",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                Scrap Details
              </Typography>

              {/* Scrap Image */}
              {selectedScrap.image && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={selectedScrap.image}
                    alt={selectedScrap.scrapType}
                    sx={{
                      width: "auto",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}

              {/* Scrap Information */}
              <Box sx={{ padding: "10px" }}>
                {[
                  { label: "Scrap Name", value: selectedScrap.scrapName },
                  { label: "Scrap Type", value: selectedScrap.scrapType },
                  {
                    label: "Weight",
                    value: `${selectedScrap.weight} ${selectedScrap.unit}`,
                  },
                  { label: "Price", value: selectedScrap.price },
                  { label: "Pickup Status", value: selectedScrap.pickupStatus },
                  {
                    label: "Address",
                    value: `${selectedScrap.address}, ${selectedScrap.city}, ${selectedScrap.state} - ${selectedScrap.pinCode}`,
                  },
                  {
                    label: "Contact Number",
                    value: selectedScrap.contactNumber,
                  },
                  { label: "Posted On", value: selectedScrap.createdOn },
                  { label: "Seller Name", value: selectedScrap.sellerName },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000",
                        minWidth: "150px",
                      }}
                    >
                      {item.label}:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#000", marginLeft: "8px" }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Close Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "15px",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenDetailsModal(false)}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Backdrop>
        )}

        {/* Snackbar Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
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

export default AcceptedRequests;
