import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Stack
} from "@mui/material";
import { Info as InfoIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebaseConfig";
import { format } from "date-fns";
import Sidebar from "../Sidebar";
import RequestDetailsDialog from './RequestDetailsDialog';

const DeclinedPickups = () => {
  const [declinedRequests, setDeclinedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Listen for changes in pickupRequests
    const pickupRequestsRef = collection(db, "pickupRequests");
    const pickupQuery = query(
      pickupRequestsRef,
      where("userId", "==", userId),
      where("status", "==", "Declined")
    );

    const unsubscribePickups = onSnapshot(pickupQuery, async (snapshot) => {
      try {
        const requests = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const pickupData = docSnapshot.data();
            
            // Fetch scrap details
            let scrapData = {};
            if (pickupData.scrapId) {
              const scrapDoc = await getDoc(doc(db, "scrapListings", pickupData.scrapId));
              if (scrapDoc.exists()) {
                scrapData = scrapDoc.data();
              }
            }
            
            // Fetch scraper details
            let scraperDetails = {};
            if (pickupData.scraperId) {
              const scraperDoc = await getDoc(doc(db, "users", pickupData.scraperId));
              if (scraperDoc.exists()) {
                scraperDetails = scraperDoc.data();
              }
            }

            return {
              id: docSnapshot.id,
              scrapDetails: {
                scrapType: scrapData.scrapType || pickupData.scrapType || "N/A",
                price: scrapData.price || pickupData.price || "N/A"
              },
              quantity: scrapData.weight || pickupData.weight || "N/A",
              scraperDetails: {
                name: scraperDetails.name || "N/A",
                contact: scraperDetails.ContactNumber || "N/A",
                email: scraperDetails.email || "N/A",
                address: scraperDetails.shop_address || "N/A"
              },
              createdOn: pickupData.createdOn,
              updatedAt: pickupData.updatedAt,
              scheduledDateTime: pickupData.scheduledDateTime
            };
          })
        );
        
        setDeclinedRequests(requests);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching declined requests:", error);
        setError("Failed to fetch declined requests");
        setLoading(false);
      }
    });

    return () => {
      unsubscribePickups();
    };
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "N/A";
    try {
      return format(timestamp.toDate(), "PPp");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleOpenDetails = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, color: "#004080", fontWeight: "bold" }}>
          Declined Pickup Requests
        </Typography>

        <TableContainer component={Paper} sx={{ 
          mt: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#004080' }}>Scrap Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#004080' }}>Scraper Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#004080' }}>Requested Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#004080' }}>Declined Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#004080' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {declinedRequests.map((request) => (
                <TableRow 
                  key={request.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 64, 128, 0.04)',
                    }
                  }}
                >
                  <TableCell>{request.scrapDetails?.scrapType || "N/A"}</TableCell>
                  <TableCell>{request.scraperDetails?.name || "N/A"}</TableCell>
                  <TableCell>{formatDate(request.createdOn)}</TableCell>
                  <TableCell>{formatDate(request.updatedAt)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip
                        label="Declined"
                        color="error"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleOpenDetails(request)}
                        sx={{
                          borderColor: '#004080',
                          color: '#004080',
                          '&:hover': {
                            borderColor: '#004080',
                            backgroundColor: 'rgba(0, 64, 128, 0.04)',
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {declinedRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No declined requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <RequestDetailsDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          requestDetails={{
            type: selectedRequest?.scrapDetails?.scrapType,
            quantity: selectedRequest?.quantity,
            price: selectedRequest?.scrapDetails?.price,
            name: selectedRequest?.scraperDetails?.name,
            contact: selectedRequest?.scraperDetails?.contact,
            email: selectedRequest?.scraperDetails?.email,
            address: selectedRequest?.scraperDetails?.address,
            scheduledDateTime: selectedRequest?.scheduledDateTime,
            createdOn: selectedRequest?.createdOn,
            updatedAt: selectedRequest?.updatedAt
          }}
        />
      </Box>
    </Box>
  );
};

export default DeclinedPickups; 