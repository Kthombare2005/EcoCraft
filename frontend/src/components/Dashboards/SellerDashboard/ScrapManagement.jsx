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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../Sidebar";
import { db, auth } from "../../../firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import statesJson from "../../../assets/states.json";
import citiesJson from "../../../assets/cities.json";

const GAMINI_API_KEY = "AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw";
const GAMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

const ScrapManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [validationError, setValidationError] = useState("");

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

    return () => {
      window.removeEventListener("resize", handleResize);
      unsubscribeAuth();
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

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData((prev) => ({ ...prev, state: selectedState, city: "" }));
    setCities(citiesJson[selectedState] || []);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "weight" && !/^[0-9]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  
      console.log("IDX API Response:", result);
  
      // Ensure the response structure is correct
      if (!result.candidates || result.candidates.length === 0) {
        console.error("Unexpected API response structure:", result);
        return false;
      }
  
      // Extract the response text
      const candidateText = result.candidates[0]?.content?.parts?.[0]?.text?.trim();
      console.log("Candidate Text:", candidateText);
  
      // Match the candidate text to expected values
      const isRelevantScrap = candidateText === "Relevant Scrap";
      console.log("Validation Result:", isRelevantScrap ? "Relevant Scrap" : "Not Relevant Scrap");
  
      return isRelevantScrap;
    } catch (error) {
      console.error("Error validating image with IDX:", error);
      return false;
    }
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (!formData.scrapType) {
          alert("Please select a scrap type before uploading an image.");
          return;
        }
  
        // Extract base64 image data
        const imageData = reader.result.split(",")[1];
  
        // Validate image using IDX API
        const isValid = await validateImageWithIDX(imageData, formData.scrapType);
  
        console.log("Validation Result:", isValid ? "Relevant Scrap" : "Not Relevant Scrap");
  
        // Update state and display appropriate messages
        if (isValid) {
          setFormData((prev) => ({ ...prev, image: reader.result }));
          setValidationError(""); // Clear any error message
          alert("✅ Image validated successfully!");
        } else {
          setFormData((prev) => ({ ...prev, image: null })); // Clear image if invalid
          setValidationError("❌ The uploaded image is not relevant to the selected scrap type.");
        }
      };
  
      reader.readAsDataURL(file);
    }
  };
  
  
  

  const handleFormSubmit = async () => {
    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }
    try {
      await addDoc(collection(db, "scrapListings"), formData);
      handleDialogClose();
      alert("Scrap listing added successfully!");
    } catch (error) {
      console.error("Error adding scrap listing:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} activeMenuItem="Sell Scrap" />
      <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#004080", fontFamily: "'Arvo', serif", marginBottom: "20px" }}>
          Scrap Management
        </Typography>
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
      fontFamily: "'Arvo', serif"
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
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
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
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#004080",
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="State"
          name="state"
          value={formData.state}
          onChange={handleStateChange}
          select
          variant="outlined"
        >
          {statesJson.states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          select
          variant="outlined"
          disabled={!formData.state}
        >
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Scrap Type"
          name="scrapType"
          value={formData.scrapType}
          onChange={handleInputChange}
          select
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
          label="Approx Weight"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleInputChange}
          select
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

      </Box>
    </Box>
  );
};

export default ScrapManagement;



