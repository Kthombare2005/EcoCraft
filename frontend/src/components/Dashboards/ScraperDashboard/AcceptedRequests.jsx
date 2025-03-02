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
        
        // Format the date safely
        let formattedDate = "Not available";
        if (request.createdOn) {
          if (request.createdOn.toDate) {
            // If it's a Firestore timestamp
            formattedDate = request.createdOn.toDate().toLocaleString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            });
          } else if (request.createdOn instanceof Date) {
            // If it's already a Date object
            formattedDate = request.createdOn.toLocaleString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            });
          } else if (typeof request.createdOn === 'string') {
            // If it's a string, try to parse it
            formattedDate = new Date(request.createdOn).toLocaleString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            });
          }
        }

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
          createdOn: formattedDate,
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

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)" },
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
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      background: "linear-gradient(to bottom right, #ffffff, #f8f9fa)",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
                      }
                    }}
                  >
                    {request.image ? (
                      <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                        <CardMedia
                          component="img"
                          image={request.image}
                          alt={request.scrapType}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                            color: "white",
                            padding: "20px 16px 12px",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                            }}
                          >
                            {request.scrapType}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: "140px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#e3f2fd",
                          color: "#004080",
                        }}
                      >
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                          {request.scrapType}
                        </Typography>
                      </Box>
                    )}
                    <CardContent 
                      sx={{ 
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        padding: "20px",
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "500",
                            color: "#004080",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1
                          }}
                        >
                          👤 {request.sellerName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                          }}
                        >
                          📞 {request.sellerContact}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: 2, 
                        mb: 2 
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: "#e3f2fd",
                            color: "#004080",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            width: "fit-content"
                          }}
                        >
                          ⚖️ {request.weight} {request.unit}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            padding: "8px 12px",
                            borderRadius: "16px",
                            display: "inline-flex",
                            alignItems: "flex-start",
                            gap: 0.5,
                            width: "100%",
                            lineHeight: "1.4",
                            "& svg": {
                              marginTop: "2px"
                            }
                          }}
                        >
                          <span style={{ flexShrink: 0 }}>📍</span>
                          <span style={{ wordBreak: "break-word" }}>
                            {`${request.address}, ${request.city}, ${request.state}${request.pinCode ? ` - ${request.pinCode}` : ''}`}
                          </span>
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                          gap: 1,
                          mt: "auto",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleCompleteRequest(request.id)}
                          sx={{
                            backgroundColor: "#2e7d32",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#1b5e20",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleChat(request.id)}
                          sx={{
                            color: "#004080",
                            borderColor: "#004080",
                            "&:hover": {
                              borderColor: "#003366",
                              backgroundColor: "rgba(0,64,128,0.1)",
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Chat
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleViewDetails(request)}
                          sx={{
                            color: "#004080",
                            borderColor: "#004080",
                            "&:hover": {
                              borderColor: "#003366",
                              backgroundColor: "rgba(0,64,128,0.1)",
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          View Details
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
                width: { xs: "90%", sm: "75%", md: "50%" },
                maxWidth: "500px",
                backgroundColor: "white",
                borderRadius: "12px",
                padding: { xs: "16px", md: "24px" },
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#004080",
                  fontFamily: "Arvo, serif",
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "24px",
                }}
              >
                Scrap Details
              </Typography>

              {selectedScrap.image && (
                <Box
                  sx={{
                    width: "100%",
                    height: "250px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  <img
                    src={selectedScrap.image}
                    alt={selectedScrap.scrapType}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </Box>
              )}

              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "16px",
              }}>
                {[
                  { label: "Scrap Name", value: selectedScrap.scrapName },
                  { label: "Scrap Type", value: selectedScrap.scrapType },
                  { label: "Weight", value: `${selectedScrap.weight} ${selectedScrap.unit}` },
                  { label: "Address", value: `${selectedScrap.address}, ${selectedScrap.city}, ${selectedScrap.state}${selectedScrap.pinCode ? ` - ${selectedScrap.pinCode}` : ''}` },
                  { label: "Contact Number", value: selectedScrap.contactNumber },
                  { label: "Posted On", value: selectedScrap.createdOn },
                  { label: "Seller Name", value: selectedScrap.sellerName }
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      padding: "8px 16px",
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "140px",
                        color: "#666",
                        fontWeight: "500",
                        flexShrink: 0,
                      }}
                    >
                      {item.label}:
                    </Typography>
                    <Typography
                      sx={{
                        flex: 1,
                        color: "#000",
                        marginLeft: "16px",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.value || "Not provided"}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "24px",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenDetailsModal(false)}
                  sx={{
                    minWidth: "120px",
                    backgroundColor: "#dc3545",
                    "&:hover": {
                      backgroundColor: "#c82333",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
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
