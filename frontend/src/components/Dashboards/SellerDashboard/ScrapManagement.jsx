import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Fab,
  MenuItem,
  Button,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../Sidebar";
import { db, auth } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import statesJson from "../../../assets/states.json";
import citiesJson from "../../../assets/cities.json";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { serverTimestamp } from "firebase/firestore";
import { fetchNearbyScrapersWithGamini } from "../../../utils/gaminiUtils";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { log } from "../../../utils/log";
import axios from "axios";
import { updateDoc, getDocs, where, query } from "firebase/firestore";


const GAMINI_API_KEY = "AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw";
const GAMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

const ScrapManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [validationError, setValidationError] = useState("");
  const [scrapListings, setScrapListings] = useState([]);
  const [selectedScrap, setSelectedScrap] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [nearbyScrapers, setNearbyScrapers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    scrapType: "",
    weight: "",
    unit: "kg",
    price: "",
    image: null,
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    contactNumber: '',
    address: '',
    city: '',
    state: '',
    scrapType: '',
    weight: '',
    unit: '',
    price: '',
    image: '',
    pinCode: '',
  });

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const schedulePickup = async (scraper) => {
    if (!selectedScrap) {
      showNotification("No scrap selected for pickup.", "warning");
      return;
    }

    if (!scraper?.id) {
      showNotification("Scraper data is invalid. Please try again.", "error");
      return;
    }

    try {
      const pickupRequestsRef = collection(db, "pickupRequests");
      const querySnapshot = await getDocs(
        query(pickupRequestsRef, where("scrapId", "==", selectedScrap.id))
      );

      if (!querySnapshot.empty) {
        const existingPickup = querySnapshot.docs[0].data();

        if (existingPickup.status === "Accepted") {
          showNotification(
            "🚫 Pickup request already accepted. No new request allowed!",
            "error"
          );
          return;
        } else {
          showNotification(
            "🚚 Pickup request already exists for this scrap!",
            "warning"
          );
          return;
        }
      }

      const userId = auth.currentUser?.uid;
      let sellerName = "Unknown Seller";
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          sellerName = userDoc.data().name || "Unknown Seller";
        }
      }

      const pickupData = {
        scrapId: selectedScrap.id,
        scraperId: scraper.id,
        userId: userId || "Unknown User",
        sellerName,
        scrapName: selectedScrap.scrapName || "Unknown Scrap",
        address: selectedScrap.address || "No Address",
        city: selectedScrap.city || "No City",
        state: selectedScrap.state || "No State",
        weight: selectedScrap.weight || "N/A",
        unit: selectedScrap.unit || "N/A",
        price: selectedScrap.price || "N/A",
        status: "Pending Approval",
        createdOn: serverTimestamp(),
      };

      await addDoc(collection(db, "pickupRequests"), pickupData);

      await updateDoc(doc(db, "scrapListings", selectedScrap.id), {
        pickupStatus: "Pending Approval",
      });

      showNotification(
        `🚚 Pickup request successfully sent to ${scraper.name}!`,
        "success"
      );
      fetchScrapListingsRealtime();
    } catch (error) {
      console.error("Error scheduling pickup:", error);
      showNotification("Failed to schedule pickup. Please try again.", "error");
    }
  };

  const validateAddress = async (address, city, state) => {
    const API_KEY = "AIzaSyCcenVOKOAhHj0DO_JmR_bocN9FEebP74M";
    const fullAddress = `${address}, ${city}, ${state}`;

    try {
      log("Validating full address:", fullAddress);

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: fullAddress,
            key: API_KEY,
          },
        }
      );

      log("Maps API Response:", response.data);

      const results = response.data.results;

      if (results.length > 0) {
        for (let result of results) {
          const { formatted_address } = result;

          const isAddressValid =
            formatted_address.toLowerCase().includes(address.toLowerCase()) &&
            formatted_address.toLowerCase().includes(city.toLowerCase()) &&
            formatted_address.toLowerCase().includes(state.toLowerCase());

          if (isAddressValid) {
            log("Valid address found:", formatted_address);
            return true;
          }
        }
      }

      console.warn("No valid address found matching the entered details.");
      return false;
    } catch (error) {
      console.error("Error validating address:", error);
      return false;
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      scrapName: "Scrap Name",
      address: "Address",
      pinCode: "Pin Code",
      state: "State",
      city: "City",
      scrapType: "Scrap Type",
      weight: "Weight",
      unit: "Unit",
      image: "Image"
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        errors[field] = `${label} is required`;
      }
    });

    // Additional validation for pinCode
    if (formData.pinCode && formData.pinCode.length !== 6) {
      errors.pinCode = "Pin Code must be 6 digits";
    }

    // Additional validation for weight
    if (formData.weight && isNaN(formData.weight)) {
      errors.weight = "Weight must be a number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);

    try {
      const isAddressValid = await validateAddress(
        formData.address,
        formData.city,
        formData.state
      );

      if (!isAddressValid) {
        showNotification("The entered address does not match the selected city and state.", "error");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "scrapListings"), {
        ...formData,
        createdOn: serverTimestamp(),
      });

      handleDialogClose();
      fetchScrapListingsRealtime();
      showNotification("Scrap listing added successfully!", "success");
    } catch (error) {
      console.error("Error adding scrap listing:", error);
      showNotification("Failed to add scrap listing. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (scrap) => {
    setSelectedScrap(scrap);
    setOpenDialog(true);
    setLoading(true);

    if (scrap.city && scrap.state) {
      try {
        const scrapers = await fetchNearbyScrapersWithGamini(
          scrap.city,
          scrap.state
        );
        setNearbyScrapers(scrapers);
      } catch (error) {
        console.error("Error fetching nearby scrapers:", error);
        setNearbyScrapers([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedScrap(null);
  };

  const fetchScrapListingsRealtime = () => {
    const scrapListingsRef = collection(db, "scrapListings");
    const pickupRequestsRef = collection(db, "pickupRequests");

    let statusMap = {};

    const unsubscribePickupRequests = onSnapshot(pickupRequestsRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const pickupData = doc.data();
        if (pickupData.scrapId) {
          if (!statusMap[pickupData.scrapId] || 
              statusMap[pickupData.scrapId] !== "Accepted" ||
              pickupData.status === "Accepted") {
            statusMap[pickupData.scrapId] = pickupData.status;
          }
        }
      });
    });

    const unsubscribeScrapListings = onSnapshot(scrapListingsRef, (snapshot) => {
      const listings = snapshot.docs.map((doc) => {
        const scrapData = doc.data();
        return {
          id: doc.id,
          ...scrapData,
          pickupStatus: statusMap[doc.id] || "No Pickup Requested"
        };
      });
      setScrapListings(listings);
    });

    return () => {
      unsubscribePickupRequests();
      unsubscribeScrapListings();
    };
  };

  const scrapTypes = [
    "Metal",
    "Plastic",
    "Paper",
    "Cardboard",
    "Glass",
    "Electronics",
    "Textiles",
    "Wood",
    "Rubber",
    "Organic Waste",
    "Batteries",
  ];

  const weightUnits = ["kg", "g", "ton", "lb"];

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });

    const unsubscribe = fetchScrapListingsRealtime();

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribeAuth();
      unsubscribe();
    };
  }, []);

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

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({
      name: formData.name,
      contactNumber: formData.contactNumber,
      address: "",
      pinCode: "",
      city: "",
      state: "",
      scrapType: "",
      weight: "",
      unit: "kg",
      price: "",
      image: null,
    });
    setValidationError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for the field being typed in
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Special validation for weight field
    if (name === "weight" && !/^[0-9]*$/.test(value)) return;

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateImageWithIDX = async (imageData, scrapType) => {
    const dynamicPrompt = `Evaluate if the uploaded image contains scrap material relevant to the selected scrap type: ${scrapType}. Acceptable examples for each scrap type are as follows:
    - Metal: Discarded metal rods, sheets, cans, pipes, or any industrial metal waste.
    - Plastic: Used or discarded plastic bottles, containers, bags, or plastic packaging materials.
    - Paper: Old newspapers, books, office paper, or shredded paper.
    - Cardboard: Flattened or damaged cardboard boxes, packaging materials, or other cardboard waste.
    - Glass: Broken glass, glass bottles, jars, or any glass items.
    - Electronics: Broken or unusable phones, laptops, wires, circuit boards, or electronic components.
    - Textiles: Old clothes, fabric pieces, curtains, or textile scraps.
    - Wood: Broken wooden furniture, planks, raw wood cuttings, or scrap wood.
    - Rubber: Used or worn-out tires, rubber sheets, or other rubber materials.
    - Organic Waste: Food waste, plant materials, garden clippings, or other compostable items.
    - Batteries: Used or damaged batteries, including car batteries or household batteries.
    
    Reject all images that do not visually align with the selected scrap type.
    
    Respond only with:
    - "Relevant Scrap" if the image matches the scrap type.
    - "Not Relevant Scrap" if the image does not match the scrap type.`;

    const contents = [
      {
        role: "user",
        parts: [
          { inline_data: { mime_type: "image/jpeg", data: imageData } },
          { text: dynamicPrompt },
        ],
      },
    ];

    try {
      const response = await fetch(`${GAMINI_API_URL}${GAMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      });

      const result = await response.json();

      log("IDX API Response:", result);

      if (!result.candidates || result.candidates.length === 0) {
        console.error("Unexpected API response structure:", result);
        return false;
      }

      const candidateText =
        result.candidates[0]?.content?.parts?.[0]?.text?.trim();
      log("Candidate Text:", candidateText);

      const isRelevantScrap = candidateText === "Relevant Scrap";
      log(
        "Validation Result:",
        isRelevantScrap ? "Relevant Scrap" : "Not Relevant Scrap"
      );

      return isRelevantScrap;
    } catch (error) {
      console.error("Error validating image with IDX:", error);
      return false;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear image error
      setFormErrors(prev => ({
        ...prev,
        image: ''
      }));

      const reader = new FileReader();
      reader.onload = async () => {
        if (!formData.scrapType) {
          showNotification("Please select a scrap type before uploading an image.", "warning");
          return;
        }

        const imageData = reader.result.split(",")[1];

        const isValid = await validateImageWithIDX(
          imageData,
          formData.scrapType
        );

        if (isValid) {
          setFormData((prev) => ({ ...prev, image: reader.result }));
          setValidationError("");
          showNotification("✅ Image validated successfully!", "success");
        } else {
          setFormData((prev) => ({ ...prev, image: null }));
          setValidationError(
            "❌ The uploaded image is not relevant to the selected scrap type."
          );
          showNotification("The uploaded image is not relevant to the selected scrap type.", "error");
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeMenuItem="Sell Scrap"
      />
      <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
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

        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: "#e3f2fd" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#004080",
                fontFamily: "'Arvo', serif",
              }}
            >
              View Enlisted Scraps
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="container mt-3">
              <div className="row">
                {scrapListings.length > 0 ? (
                  scrapListings.map((scrap) => (
                    <div
                      className="col-12 col-sm-6 col-md-4 mb-4"
                      key={scrap.id}
                    >
                      <div
                        className="card"
                        style={{
                          borderRadius: "12px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          overflow: "hidden",
                          border: "none",
                        }}
                      >
                        <div
                          style={{
                            height: "200px",
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {scrap.image ? (
                            <img
                              src={scrap.image}
                              alt={scrap.scrapName}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px 8px 0 0",
                              }}
                            />
                          ) : (
                            <h3 style={{ fontWeight: "bold", color: "#999" }}>
                              {scrap.scrapType || "Scrap"}
                            </h3>
                          )}
                        </div>

                        <div className="card-body" style={{ padding: "20px" }}>
                          <h5
                            style={{
                              fontWeight: "bold",
                              marginBottom: "10px",
                              color: "#333",
                            }}
                          >
                            {scrap.scrapName || "Scrap Item"}
                          </h5>
                          <p style={{ fontSize: "0.9rem", color: "#666" }}>
                            Listed on:{" "}
                            {scrap.createdOn && scrap.createdOn.toDate
                              ? scrap.createdOn.toDate().toLocaleDateString()
                              : "Unknown Date"}
                            <br />
                            <strong>Weight:</strong>{" "}
                            {scrap.weight
                              ? `${scrap.weight} ${scrap.unit}`
                              : "N/A"}{" "}
                            <br />
                            <strong>Category:</strong>{" "}
                            {scrap.scrapType || "N/A"} <br />
                            <strong>Location:</strong> {scrap.city || "N/A"},{" "}
                            {scrap.state || "N/A"}
                          </p>

                          {scrap.pickupStatus ? (
                            <p
                              style={{
                                fontWeight: "bold",
                                color:
                                  scrap.pickupStatus === "Accepted"
                                    ? "#28a745"
                                    : scrap.pickupStatus === "Pending Approval"
                                    ? "#FFA500"
                                    : scrap.pickupStatus === "Rejected"
                                    ? "#FF0000"
                                    : "#999",
                                marginBottom: "10px",
                              }}
                            >
                              🚚 Pickup Status:{" "}
                              {scrap.pickupStatus || "No Pickup Requested"}
                            </p>
                          ) : (
                            <p
                              style={{
                                fontWeight: "bold",
                                color: "#999",
                                marginBottom: "10px",
                              }}
                            >
                              No Pickup Requested
                            </p>
                          )}

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <a
                              href="#"
                              className="btn"
                              style={{
                                color: "#007bff",
                                textDecoration: "none",
                                fontWeight: "bold",
                              }}
                              onClick={() => handleOpenDialog(scrap)}
                            >
                              View Details →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: "gray",
                      fontStyle: "italic",
                      margin: "20px auto",
                    }}
                  >
                    No scraps listed yet.
                  </Typography>
                )}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
          {selectedScrap && (
            <>
              <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                Scrap Details
              </DialogTitle>
              <DialogContent>
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#004080",
                        marginBottom: "10px",
                        fontFamily: "'Ubuntu', sans-serif",
                        fontSize: "1.2rem",
                      }}
                    >
                      Scrap Name: {selectedScrap.scrapName}
                    </Typography>

                    <Typography>Type: {selectedScrap.scrapType}</Typography>
                    <Typography>
                      Weight: {selectedScrap.weight} {selectedScrap.unit}
                    </Typography>
                    <Typography>
                      Location: {selectedScrap.city}, {selectedScrap.state}
                    </Typography>
                    <Typography>
                      Contact: {selectedScrap.contactNumber}
                    </Typography>
                    <Typography>Address: {selectedScrap.address}</Typography>

                    <Typography
                      variant="h6"
                      sx={{ marginTop: "20px", fontWeight: "bold" }}
                    >
                      Nearby Scrap Dealers (Within 4-5 km):
                    </Typography>

                    {nearbyScrapers.length > 0 ? (
                      nearbyScrapers.map((scraper, index) => (
                        <Box
                          key={index}
                          sx={{
                            padding: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "12px",
                            backgroundColor: "#f9f9f9",
                            marginBottom: "15px",
                            fontFamily: "'Ubuntu', sans-serif",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "700",
                              color: "#004080",
                              fontFamily: "'Ubuntu', sans-serif",
                              marginBottom: "10px",
                            }}
                          >
                            {scraper.name}
                          </Typography>
                          <Typography
                            sx={{
                              marginTop: "5px",
                              fontFamily: "'Ubuntu', sans-serif",
                              fontSize: "0.9rem",
                              color: "#555",
                            }}
                          >
                            📍 {scraper.shop_address}
                          </Typography>
                          <Typography
                            sx={{
                              marginTop: "5px",
                              fontFamily: "'Ubuntu', sans-serif",
                              fontSize: "0.9rem",
                              color: "#555",
                            }}
                          >
                            📞 {scraper.contact_number || "N/A"}
                          </Typography>
                          {scraper.contact_number && (
                            <Button
                              variant="contained"
                              color="primary"
                              href={`tel:${scraper.contact_number}`}
                              sx={{
                                marginTop: "10px",
                                fontFamily: "'Ubuntu', sans-serif",
                                fontWeight: "600",
                                marginRight: "10px",
                              }}
                            >
                              Call Now
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              marginTop: "10px",
                              fontFamily: "'Ubuntu', sans-serif",
                              fontWeight: "600",
                            }}
                            onClick={() => schedulePickup(scraper)}
                          >
                            Schedule a Pickup
                          </Button>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontFamily: "'Ubuntu', sans-serif",
                          fontStyle: "italic",
                          color: "gray",
                        }}
                      >
                        No nearby scrapers found.
                      </Typography>
                    )}
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDialog}
                  color="primary"
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Fab
          color="success"
          variant={isSmallScreen ? "circular" : "extended"}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            animation: "zoom 1s infinite",
            "@keyframes zoom": {
              "0%": {
                transform: "scale(1)",
              },
              "50%": {
                transform: "scale(1.1)",
              },
              "100%": {
                transform: "scale(1)",
              },
            },
            transition: "transform 0.2s ease-in-out",
          }}
          onClick={handleDialogOpen}
        >
          <AddIcon />
          {!isSmallScreen && " List New Scrap"}
        </Fab>

        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
          <DialogTitle
            sx={{
              marginBottom: "5px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#004080",
              textAlign: "center",
              fontFamily: "'Arvo', serif",
            }}
          >
            Add Scrap Listing
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ marginTop: "5px" }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  variant="outlined"
                  disabled
                  sx={{
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#004080",
                      },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  variant="outlined"
                  disabled
                  sx={{
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#004080",
                      },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Scrap Name"
                  name="scrapName"
                  value={formData.scrapName}
                  onChange={handleInputChange}
                  error={!!formErrors.scrapName}
                  helperText={formErrors.scrapName}
                  variant="outlined"
                />
              </Grid>

              <Grid
                container
                spacing={2}
                sx={{ marginTop: "5px", marginLeft: "1px" }}
              >
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    required
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    required
                    label="Pin Code"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,6}$/.test(value)) {
                        setFormData((prev) => ({ ...prev, pinCode: value }));
                      }
                    }}
                    error={!!formErrors.pinCode}
                    helperText={formErrors.pinCode}
                    inputProps={{ maxLength: 6 }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  required
                  options={statesJson.states}
                  value={formData.state}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      state: newValue || '',
                      city: '' 
                    }));
                    setCities(newValue ? citiesJson[newValue] || [] : []);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      required
                      variant="outlined"
                      error={!!formErrors.state}
                      helperText={formErrors.state}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  required
                  options={cities}
                  value={formData.city}
                  onChange={(event, newValue) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      city: newValue || '' 
                    }));
                  }}
                  disabled={!formData.state}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      required
                      variant="outlined"
                      error={!!formErrors.city}
                      helperText={formErrors.city}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Scrap Type"
                  name="scrapType"
                  value={formData.scrapType}
                  onChange={handleInputChange}
                  select
                  error={!!formErrors.scrapType}
                  helperText={formErrors.scrapType}
                  variant="outlined"
                >
                  {scrapTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Approx Weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  error={!!formErrors.weight}
                  helperText={formErrors.weight}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  select
                  error={!!formErrors.unit}
                  helperText={formErrors.unit}
                  variant="outlined"
                >
                  {weightUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    marginTop: "16px",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                      transform: "scale(1.05)",
                      transition: "transform 0.2s",
                    },
                  }}
                >
                  Upload Image
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {formData.image && (
                  <Box sx={{ marginTop: "16px", textAlign: "center" }}>
                    <Typography>Image Preview:</Typography>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </Box>
                )}
                {validationError && (
                  <Typography color="error" sx={{ marginTop: "8px" }}>
                    {validationError}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: "16px",
            }}
          >
            <Button
              onClick={handleDialogClose}
              sx={{
                backgroundColor: "#d32f2f",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#c62828",
                  transform: "scale(1.05)",
                  transition: "transform 0.2s",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              sx={{
                backgroundColor: "#388e3c",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#2e7d32",
                  transform: "scale(1.05)",
                  transition: "transform 0.2s",
                },
              }}
            >
              Add Scrap
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar 
          open={notification.open} 
          autoHideDuration={4000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            '& .MuiSnackbarContent-root': {
              fontSize: '1.1rem',
              fontWeight: 'bold',
              backgroundColor: notification.severity === 'success' ? '#28a745' : 
                             notification.severity === 'warning' ? '#FFA500' : '#d32f2f',
              color: '#fff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '8px'
            }
          }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ScrapManagement;