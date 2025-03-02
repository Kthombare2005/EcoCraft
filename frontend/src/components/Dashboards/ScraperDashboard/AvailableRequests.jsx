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
  serverTimestamp,
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
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "./ScraperSidebar";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "animate.css";
import "./AvailableRequests.css";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.02, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)" },
};

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
  const [approvalDialog, setApprovalDialog] = useState({
    open: false,
    requestId: null,
    type: "", // 'approve' or 'decline'
    dateTime: new Date(),
    error: "",
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    const q = query(
      collection(db, "pickupRequests"),
      where("status", "==", "Pending Approval")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const pickupData = [];

      for (let docSnap of snapshot.docs) {
        const requestData = docSnap.data();
        
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

    return () => unsubscribe();
  }, []);

  const handleApprove = async (requestId) => {
    setApprovalDialog({
      open: true,
      requestId,
      type: "approve",
      dateTime: new Date(),
      error: "",
    });
  };

  const handleDecline = async (requestId) => {
    setApprovalDialog({
      open: true,
      requestId,
      type: "decline",
      dateTime: new Date(),
      error: "",
    });
  };

  const handleSubmitAction = async () => {
    try {
      const { requestId, type, dateTime } = approvalDialog;

      // Validate date/time for approval
      if (type === "approve") {
        const now = new Date();
        if (dateTime < now) {
          setApprovalDialog((prev) => ({
            ...prev,
            error: "Please select a future date and time",
          }));
          return;
        }
      }

      await updateDoc(doc(db, "pickupRequests", requestId), {
        status: type === "approve" ? "Accepted" : "Declined",
        scheduledDateTime: dateTime,
        updatedAt: serverTimestamp(),
        scraperId: auth.currentUser.uid,
      });

      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      setSnackbar({
        open: true,
        message:
          type === "approve"
            ? "Request accepted and scheduled successfully! ✅"
            : "Request declined successfully! ❌",
        severity: type === "approve" ? "success" : "warning",
      });

      setApprovalDialog({
        open: false,
        requestId: null,
        type: "",
        dateTime: null,
        error: "",
      });
    } catch (error) {
      console.error("Error processing request:", error);
      setSnackbar({
        open: true,
        message: "Failed to process request. Please try again.",
        severity: "error",
      });
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

        <Backdrop
          sx={{
            color: "#004080",
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {requests.length === 0 && !loading ? (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "#666",
              marginTop: "40px",
            }}
          >
            No available pickup requests at the moment.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {requests.map((request) => (
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
                        flexWrap: "wrap", 
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
                            gap: 0.5
                          }}
                        >
                          ⚖️ {request.weight} {request.unit}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5
                          }}
                        >
                          📍 {request.city}
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
                          onClick={() => handleApprove(request.id)}
                          sx={{
                            backgroundColor: "#004080",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#003366",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleDecline(request.id)}
                          sx={{
                            color: "#ff4444",
                            borderColor: "#ff4444",
                            "&:hover": {
                              borderColor: "#cc3333",
                              backgroundColor: "rgba(255,68,68,0.1)",
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setSelectedRequest(request)}
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
            ))}
          </Grid>
        )}

        {/* Details Dialog */}
        <Dialog 
          open={!!selectedRequest} 
          onClose={handleCloseDetails}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px"
            }
          }}
        >
          {selectedRequest && (
            <>
              <DialogTitle
                sx={{
                  color: "#004080",
                  fontFamily: "Arvo, serif",
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "center",
                  pb: 2,
                  borderBottom: "1px solid #E3F2FD"
                }}
              >
                Scrap Details
              </DialogTitle>
              <DialogContent sx={{ mt: 3 }}>
                {selectedRequest.image && (
                  <Box
                    sx={{
                      width: "100%",
                      height: "250px",
                      overflow: "hidden",
                      borderRadius: "8px",
                      mb: 3,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                    }}
                  >
                    <img
                      src={selectedRequest.image}
                      alt={selectedRequest.scrapType}
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
                  gap: 2,
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ 
                      width: "150px", 
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Scrap Name:
                    </Typography>
                    <Typography sx={{ flex: 1, color: "#000" }}>
                      {selectedRequest.scrapName || "Not provided"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ 
                      width: "150px", 
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Scrap Type:
                    </Typography>
                    <Typography sx={{ flex: 1, color: "#000" }}>
                      {selectedRequest.scrapType}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ 
                      width: "150px", 
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Weight:
                    </Typography>
                    <Typography sx={{ flex: 1, color: "#000" }}>
                      {selectedRequest.weight} {selectedRequest.unit}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ 
                      width: "150px", 
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Address:
                    </Typography>
                    <Typography sx={{ flex: 1, color: "#000" }}>
                      {selectedRequest.address}, {selectedRequest.city}, {selectedRequest.state}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ 
                      width: "150px", 
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Contact Number:
                    </Typography>
                    <Typography sx={{ flex: 1, color: "#000" }}>
                      {selectedRequest.sellerContact}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ 
                      width: "150px", 
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Posted On:
                    </Typography>
                    <Typography sx={{ flex: 1, color: "#000" }}>
                      {selectedRequest.createdOn?.toDate().toLocaleString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ 
                      width: "150px", 
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Seller Name:
                    </Typography>
                    <Typography sx={{ flex: 1, color: "#000" }}>
                      {selectedRequest.sellerName}
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ 
                padding: "16px", 
                borderTop: "1px solid #E3F2FD",
                justifyContent: "center"
              }}>
                <Button
                  onClick={handleCloseDetails}
                  variant="contained"
                  sx={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    minWidth: "120px",
                    "&:hover": { 
                      backgroundColor: "#c82333"
                    }
                  }}
                >
                  CLOSE
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Approval/Decline Dialog */}
        <Dialog
          open={approvalDialog.open}
          onClose={() =>
            setApprovalDialog({
              open: false,
              requestId: null,
              type: "",
              dateTime: null,
              error: "",
            })
          }
          PaperProps={{
            style: {
              borderRadius: "12px",
              padding: "16px",
              minWidth: "350px",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: "#004080",
              fontFamily: "Arvo, serif",
              borderBottom: "2px solid #E3F2FD",
              pb: 2,
            }}
          >
            {approvalDialog.type === "approve"
              ? "Schedule Pickup"
              : "Decline Request"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {approvalDialog.type === "approve" && (
              <>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "#004080" }}
                >
                  Please select pickup date and time:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <DatePicker
                    selected={approvalDialog.dateTime}
                    onChange={(date) =>
                      setApprovalDialog((prev) => ({
                        ...prev,
                        dateTime: date,
                        error: "",
                      }))
                    }
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    customInput={
                      <TextField
                        fullWidth
                        error={!!approvalDialog.error}
                        helperText={approvalDialog.error}
                        InputProps={{
                          sx: {
                            "&:hover": {
                              borderColor: "#004080",
                            },
                          },
                        }}
                      />
                    }
                  />
                </Box>
              </>
            )}
            {approvalDialog.type === "decline" && (
              <Typography>
                Are you sure you want to decline this pickup request?
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ padding: "16px", borderTop: "1px solid #E3F2FD" }}>
            <Button
              onClick={() =>
                setApprovalDialog({
                  open: false,
                  requestId: null,
                  type: "",
                  dateTime: null,
                  error: "",
                })
              }
              sx={{
                color: "#666",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              variant="contained"
              sx={{
                backgroundColor:
                  approvalDialog.type === "approve" ? "#004080" : "#ff4444",
                "&:hover": {
                  backgroundColor:
                    approvalDialog.type === "approve" ? "#003366" : "#cc3333",
                },
              }}
            >
              {approvalDialog.type === "approve" ? "Schedule Pickup" : "Decline"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
