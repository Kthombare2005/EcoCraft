import { useEffect, useState } from "react";
import { Typography, Box, Card, CardContent, Button } from "@mui/material";
import { collection, query, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const AvailableRequests = () => {
  const [requests, setRequests] = useState([]);

  // Listen for real-time updates in "available_requests"
  useEffect(() => {
    const requestsRef = collection(db, "available_requests");
    const unsubscribe = onSnapshot(query(requestsRef), (snapshot) => {
      const newRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(newRequests);
    });

    return () => unsubscribe();
  }, []);

  // Function to accept a request
  const acceptRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, "available_requests", requestId), {
        status: "accepted",
      });
      alert("Pickup request accepted!");
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <Box sx={{ padding: "24px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#004080", marginBottom: "20px" }}>
        Available Pickup Requests
      </Typography>

      {requests.length > 0 ? (
        requests.map((request) => (
          <Card key={request.id} sx={{ marginBottom: "16px", padding: "16px", backgroundColor: "#f9f9f9" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {request.scraperName}
              </Typography>
              <Typography variant="body1">📍 {request.shopAddress}</Typography>
              <Typography variant="body2">📞 {request.contactNumber}</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: request.status === "pending" ? "orange" : "green" }}>
                Status: {request.status}
              </Typography>

              {request.status === "pending" && (
                <Button variant="contained" color="primary" sx={{ marginTop: "10px" }} onClick={() => acceptRequest(request.id)}>
                  Accept Request
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ color: "gray", fontStyle: "italic" }}>
          No pickup requests available.
        </Typography>
      )}
    </Box>
  );
};

export default AvailableRequests;
