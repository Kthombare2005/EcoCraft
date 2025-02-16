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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

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
      setAcceptedRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));

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
          <Typography sx={{ marginTop: "10px", fontWeight: "bold", color: "#004080" }}>
            Fetching Accepted Requests...
          </Typography>
        </Backdrop>

        <Grid container spacing={3}>
          {acceptedRequests.length > 0 ? (
            acceptedRequests.map((request) => (
              <Grid item xs={12} sm={6} md={4} key={request.id}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }}>
                  <Card sx={{ borderRadius: "12px", backgroundColor: "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                    {request.image ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={request.image}
                        alt={request.scrapName}
                        sx={{ borderRadius: "12px 12px 0 0" }}
                      />
                    ) : (
                      <Box sx={{ height: "200px", backgroundColor: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="h6" sx={{ color: "#888" }}>No Image Available</Typography>
                      </Box>
                    )}
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004080", textAlign: "center" }}>
                        {request.scrapName}
                      </Typography>
                      <Typography variant="body1"><strong>Seller:</strong> {request.sellerName}</Typography>
                      <Typography variant="body1"><strong>Location:</strong> {request.city}, {request.state}</Typography>
                      <Typography variant="body1"><strong>Weight:</strong> {request.weight} {request.unit}</Typography>

                      {/* Complete Request Button */}
                      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                        <Button variant="contained" color="success" sx={{ width: "80%" }} onClick={() => handleCompleteRequest(request.id)}>
                          ✅ Mark as Completed
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", color: "gray", fontStyle: "italic", marginTop: "20px" }}>
              No accepted requests available.
            </Typography>
          )}
        </Grid>

        {/* Snackbar Notification */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AcceptedRequests;
