import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocalShipping,
  Scale,
  LocationOn,
  Phone,
  Email,
  Person,
  Chat,
} from "@mui/icons-material";
import Sidebar from "../Sidebar";
import { db, auth } from "../../../firebaseConfig";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";

// Styled Components
const StyledCard = styled(Card)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
}));

const StyledChip = styled(Chip)(() => ({
  backgroundColor: "#4caf50",
  color: "white",
  "& .MuiSvgIcon-root": {
    fontSize: "1rem",
  },
  fontWeight: "600",
}));

const ImageContainer = styled(CardMedia)(() => ({
  height: "100%",
  width: "100%",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}));

const ScraperDetailsBox = styled(Paper)(() => ({
  padding: "16px",
  backgroundColor: "#f8f9fa",
  borderRadius: "12px",
  border: "1px solid #e0e0e0",
}));

const ChatButton = styled(Button)(() => ({
  backgroundColor: "#1a237e",
  color: "white",
  marginTop: "16px",
  '&:hover': {
    backgroundColor: "#0d47a1",
  },
  textTransform: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
}));

const AcceptedPickups = () => {
  const [acceptedPickups, setAcceptedPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcceptedPickups = async () => {
      try {
        const userId = auth.currentUser?.uid;

        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const pickupRequestsRef = collection(db, "pickupRequests");
        const q = query(
          pickupRequestsRef,
          where("status", "==", "Accepted")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const pickups = [];
          
          for (const document of snapshot.docs) {
            const pickupData = document.data();
            
            try {
              const scraperDocRef = doc(db, "users", pickupData.scraperId);
              const scrapDocRef = doc(db, "scrapListings", pickupData.scrapId);
              
              const [scraperDoc, scrapDoc] = await Promise.all([
                getDoc(scraperDocRef),
                getDoc(scrapDocRef)
              ]);
              
              const scraperData = scraperDoc.exists() ? scraperDoc.data() : {};
              const scrapData = scrapDoc.exists() ? scrapDoc.data() : {};

              pickups.push({
                id: document.id,
                ...pickupData,
                scrapDetails: {
                  ...scrapData,
                  image: scrapData.image || null,
                },
                scraperDetails: {
                  id: pickupData.scraperId,
                  name: scraperData.name || "Unknown Scraper",
                  contact: scraperData.ContactNumber || "No contact provided",
                  email: scraperData.email || "No email provided",
                  address: scraperData.shop_address || "No address provided",
                  city: scraperData.City || "",
                  state: scraperData.State || "",
                  pinCode: scraperData.PinCode || "",
                }
              });
            } catch {
              setError("Error fetching pickup details");
            }
          }
          
          setAcceptedPickups(pickups);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch {
        setError("Failed to fetch accepted pickups");
        setLoading(false);
      }
    };

    fetchAcceptedPickups();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: "1.5rem", sm: "2rem" },
            fontWeight: "bold",
            color: "#1a237e",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Accepted Pickup Requests
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
          {acceptedPickups.map((pickup) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={pickup.id}>
              <StyledCard>
                {pickup.scrapDetails?.image ? (
                  <Box 
                    sx={{ 
                      position: 'relative',
                      height: 200,
                      width: '100%',
                      backgroundColor: "#f8f9fa",
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      padding: '16px',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '90%',
                        height: '90%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <ImageContainer
                        image={pickup.scrapDetails.image}
                        title={pickup.scrapName}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: "#f8f9fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="textSecondary">No Image Available</Typography>
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography 
                      variant="h6"
                      sx={{ 
                        fontWeight: "600", 
                        color: "#1a237e",
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }}
                    >
                      {pickup.scrapName}
                    </Typography>
                    <StyledChip
                      icon={<LocalShipping />}
                      label="Accepted"
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        color: "#424242",
                      }}
                    >
                      <Scale sx={{ mr: 1, color: "#666" }} />
                      <strong>Weight:</strong> {pickup.weight} {pickup.unit}
                    </Typography>

                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#424242",
                      }}
                    >
                      <LocationOn sx={{ mr: 1, color: "#666" }} />
                      <strong>Location:</strong> {pickup.address}, {pickup.city},{" "}
                      {pickup.state}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <ScraperDetailsBox elevation={0} sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#1a237e",
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "600",
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      <Person sx={{ mr: 1, fontSize: '1.2rem' }} />
                      Scraper Details
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#1a237e",
                          mr: 1.5,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {pickup.scraperDetails?.name?.[0] || "D"}
                      </Avatar>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: "600",
                          fontSize: { xs: '0.875rem', sm: '0.9rem' }
                        }}
                      >
                        {pickup.scraperDetails?.name || "Demoscraper"}
                      </Typography>
                    </Box>

                    <Box sx={{ color: "#424242", fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Phone sx={{ mr: 1, color: "#666" }} />
                        {pickup.scraperDetails.contact}
                      </Typography>

                      <Typography sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Email sx={{ mr: 1, color: "#666" }} />
                        {pickup.scraperDetails.email}
                      </Typography>

                      <Typography sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOn sx={{ mr: 1, color: "#666" }} />
                        {pickup.scraperDetails.address}
                      </Typography>

                      <ChatButton
                        fullWidth
                        size="small"
                        startIcon={<Chat sx={{ fontSize: '1rem' }} />}
                        sx={{ mt: 1.5 }}
                      >
                        Chat with Scraper
                      </ChatButton>
                    </Box>
                  </ScraperDetailsBox>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AcceptedPickups;
