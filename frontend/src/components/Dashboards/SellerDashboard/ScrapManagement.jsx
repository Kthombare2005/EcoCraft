// import { useState } from "react";
// import { Box, Typography, Tooltip, useMediaQuery } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import Sidebar from "../Sidebar";
// import { motion } from "framer-motion";

// const ScrapManagement = () => {
//   const isSmallScreen = useMediaQuery("(max-width: 600px)");
//   const [expanded, setExpanded] = useState(false);

//   const handleAddScrap = () => {
//     if (isSmallScreen && !expanded) {
//       setExpanded(true); // First click expands the button
//     } else {
//       alert("List New Scrap button clicked!"); // Second click performs the action
//       setExpanded(false); // Reset expansion after action
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
//       {/* Sidebar */}
//       <Sidebar isOpen />

//       {/* Main Content */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           padding: "24px",
//           backgroundColor: "#f8f9fa",
//           position: "relative",
//           overflowY: "auto",
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: "#004080",
//             fontFamily: "'Arvo', serif",
//             marginBottom: "20px",
//           }}
//         >
//           Scrap Management
//         </Typography>

//         {/* Floating Button with Continuous Zoom Animation */}
//         <Tooltip title="List New Scrap" arrow>
//           <motion.div
//             animate={{
//               scale: [1, 1.15, 1], // Creates continuous zoom in & out effect
//               boxShadow: ["0px 5px 15px rgba(0,0,0,0.2)", "0px 10px 25px rgba(0,128,0,0.5)", "0px 5px 15px rgba(0,0,0,0.2)"],
//             }}
//             transition={{
//               duration: 1.5, // Duration of each cycle
//               repeat: Infinity, // Infinite loop for continuous animation
//               ease: "easeInOut",
//             }}
//             style={{
//               position: "fixed",
//               bottom: "20px",
//               right: "20px",
//               zIndex: 1000,
//             }}
//           >
//             <motion.button
//               onClick={handleAddScrap}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: expanded || !isSmallScreen ? "8px" : "4px",
//                 backgroundColor: "#28a745",
//                 color: "white",
//                 fontWeight: "bold",
//                 borderRadius: "25px",
//                 padding: expanded || !isSmallScreen ? "12px 24px" : "12px",
//                 width: expanded || !isSmallScreen ? "auto" : "50px",
//                 transition: "all 0.3s ease-in-out",
//                 boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
//                 fontSize: expanded || !isSmallScreen ? "16px" : "12px",
//                 border: "none",
//                 cursor: "pointer",
//                 outline: "none",
//               }}
//               whileTap={{
//                 scale: 0.9,
//                 boxShadow: "0px 5px 10px rgba(0, 128, 0, 0.3)",
//               }}
//             >
//               <AddCircleIcon fontSize={expanded || !isSmallScreen ? "medium" : "small"} />
//               {(expanded || !isSmallScreen) && "List New Scrap"}
//             </motion.button>
//           </motion.div>
//         </Tooltip>
//       </Box>
//     </Box>
//   );
// };

// export default ScrapManagement;

// import { useState, useEffect } from "react";
// import {
//   Typography,
//   Grid,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Fab,
//   MenuItem,
//   Button,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import Sidebar from "../Sidebar";
// import { db, auth } from "../../../firebaseConfig";
// import { collection, addDoc, doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import statesJson from "../../../assets/states.json";
// import citiesJson from "../../../assets/cities.json";

// const ScrapManagement = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [cities, setCities] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     contactNumber: "",
//     address: "",
//     city: "",
//     state: "",
//     scrapType: "",
//     weight: "",
//     unit: "kg",
//     price: "",
//     image: null,
//   });

//   const scrapTypes = [
//     "Metal",
//     "Plastic",
//     "Paper",
//     "Cardboard",
//     "Glass",
//     "Electronics",
//     "Textiles",
//     "Wood",
//     "Rubber",
//     "Organic Waste",
//     "Batteries",
//   ];

//   const weightUnits = ["kg", "g", "ton", "lb"];

//   const fetchUserData = async (uid) => {
//     try {
//       const userDoc = await getDoc(doc(db, "users", uid));
//       if (userDoc.exists()) {
//         const { name, ContactNumber } = userDoc.data();
//         setFormData((prev) => ({
//           ...prev,
//           name: name || "",
//           contactNumber: ContactNumber || "",
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 600);
//     };
//     window.addEventListener("resize", handleResize);

//     const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         fetchUserData(currentUser.uid);
//       }
//     });

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       unsubscribeAuth();
//     };
//   }, []);

//   const handleDialogOpen = () => {
//     setDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//     setFormData((prev) => ({
//       ...prev,
//       address: "",
//       city: "",
//       state: "",
//       scrapType: "",
//       weight: "",
//       unit: "kg",
//       price: "",
//       image: null,
//     }));
//   };

//   const handleStateChange = (e) => {
//     const selectedState = e.target.value;
//     setFormData((prev) => ({ ...prev, state: selectedState, city: "" }));
//     setCities(citiesJson[selectedState] || []);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "weight" && !/^[0-9]*$/.test(value)) {
//       return; // Restrict weight input to only numbers
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFormData((prev) => ({ ...prev, image: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleFormSubmit = async () => {
//     if (!formData.image) {
//       alert("Please upload an image.");
//       return;
//     }

//     try {
//       await addDoc(collection(db, "scrapListings"), formData);
//       handleDialogClose();
//     } catch (error) {
//       console.error("Error adding scrap listing:", error);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
//       <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} activeMenuItem="Sell Scrap" />

//       <Box
//         sx={{
//           flexGrow: 1,
//           padding: "24px",
//           transition: "margin-left 0.3s ease",
//           overflowY: "auto",
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             color: "#004080",
//             fontFamily: "'Arvo', serif",
//             marginBottom: "20px",
//           }}
//         >
//           Scrap Management
//         </Typography>

//         <Fab
//   color="success"
//   variant={isSmallScreen ? "circular" : "extended"}
//   sx={{
//     position: "fixed",
//     bottom: "20px",
//     right: "20px",
//     zIndex: 1000,
//     fontWeight: "bold",
//     boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
//     transition: "transform 0.3s ease",
//     "&:hover": {
//       transform: "scale(1.2)", // Zoom in on hover
//       boxShadow: "0px 10px 20px rgba(0,0,0,0.4)",
//     },
//     animation: "zoomInOut 2s infinite", // Zoom-in and zoom-out animation
//   }}
//   onClick={handleDialogOpen}
// >
//   <AddIcon />
//   {!isSmallScreen && " List New Scrap"}
// </Fab>

// <style>
//   {`
//     @keyframes zoomInOut {
//       0%, 100% {
//         transform: scale(1);
//       }
//       50% {
//         transform: scale(1.1); // Slight zoom
//       }
//     }
//   `}
// </style>


//         <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
//   <DialogTitle sx={{ marginBottom: "2px", textAlign:"center", fontFamily:"'Arvo', serif", fontWeight: "800"}}>Add Scrap Listing</DialogTitle>
//   <DialogContent>
//     <Grid container spacing={2} sx={{ marginTop: "2px" }}>
//       {/* Name and Contact Number */}
//       <Grid item xs={12} sm={6}>
//         <TextField
//           fullWidth
//           label="Name"
//           name="name"
//           value={formData.name}
//           variant="outlined"
//           disabled
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//       </Grid>
//       <Grid item xs={12} sm={6}>
//         <TextField
//           fullWidth
//           label="Contact Number"
//           name="contactNumber"
//           value={formData.contactNumber}
//           variant="outlined"
//           disabled
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//       </Grid>

//       {/* Address */}
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Address"
//           name="address"
//           value={formData.address}
//           onChange={handleInputChange}
//           variant="outlined"
//         />
//       </Grid>

//       {/* State and City */}
//       {[
//         { label: "State", name: "state", type: "select" },
//         { label: "City", name: "city", type: "select", disabled: !formData.state },
//       ].map((field, index) => (
//         <Grid item xs={12} sm={6} key={index}>
//           <TextField
//             fullWidth
//             select
//             label={field.label}
//             name={field.name}
//             value={formData[field.name]}
//             onChange={field.name === "state" ? handleStateChange : handleInputChange}
//             variant="outlined"
//             disabled={field.disabled}
//           >
//             {(field.name === "state" ? statesJson.states : cities).map((option, idx) => (
//               <MenuItem key={idx} value={option}>
//                 {option}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//       ))}

//       {/* Scrap Type and Approx Weight */}
//       <Grid item xs={12} sm={6}>
//         <TextField
//           fullWidth
//           select
//           label="Scrap Type"
//           name="scrapType"
//           value={formData.scrapType}
//           onChange={handleInputChange}
//           variant="outlined"
//         >
//           {scrapTypes.map((type) => (
//             <MenuItem key={type} value={type}>
//               {type}
//             </MenuItem>
//           ))}
//         </TextField>
//       </Grid>
//       <Grid item xs={12} sm={6}>
//   <Box sx={{ display: "flex", alignItems: "center" }}>
//     <TextField
//       fullWidth
//       label="Approx Weight"
//       name="weight"
//       value={formData.weight}
//       onChange={handleInputChange}
//       type="text"
//       variant="outlined"
//       sx={{ flexGrow: 1, marginRight: "8px" }}
//     />
//     <TextField
//       select
//       value={formData.unit}
//       name="unit"
//       onChange={handleInputChange}
//       variant="outlined"
//       SelectProps={{
//         displayEmpty: true, // Keeps the dropdown arrow visible
//       }}
//       sx={{
//         width: "100px", // Adjust width as needed
//         "& .MuiSelect-icon": {
//           right: "8px", // Ensures the dropdown arrow is properly aligned
//         },
//       }}
//     >
//       {weightUnits.map((unit) => (
//         <MenuItem key={unit} value={unit}>
//           {unit}
//         </MenuItem>
//       ))}
//     </TextField>
//   </Box>
// </Grid>



//       {/* Image Upload */}
//       <Grid item xs={12}>
//   <Button
//     variant="contained"
//     component="label"
//     fullWidth
//     sx={{
//       marginTop: "16px",
//       backgroundColor: "#1976d2",
//       color: "white",
//       fontWeight: "bold",
//       textTransform: "uppercase",
//       "&:hover": {
//         backgroundColor: "#1565c0",
//       },
//     }}
//   >
//     Upload Image
//     <input
//       type="file"
//       accept="image/*"
//       hidden
//       onChange={handleFileChange}
//     />
//   </Button>
//   {formData.image && (
//     <Box
//       sx={{
//         marginTop: "16px",
//         textAlign: "center",
//         border: "1px solid #ccc",
//         borderRadius: "8px",
//         padding: "8px",
//         backgroundColor: "#f9f9f9",
//       }}
//     >
//       <Typography variant="body1" sx={{ marginBottom: "8px" }}>
//         Image Preview:
//       </Typography>
//       <img
//         src={formData.image}
//         alt="Uploaded Preview"
//         style={{
//           maxWidth: "100%",
//           maxHeight: "200px",
//           objectFit: "contain",
//           borderRadius: "4px",
//         }}
//       />
//     </Box>
//   )}
// </Grid>

//     </Grid>
//   </DialogContent>
//   <DialogActions>
//   <Button
//     onClick={handleDialogClose}
//     sx={{
//       backgroundColor: "#f44336", // Red for Cancel
//       color: "white",
//       fontWeight: "bold",
//       textTransform: "uppercase",
//       padding: "8px 16px",
//       borderRadius: "8px",
//       transition: "transform 0.3s, background-color 0.3s",
//       "&:hover": {
//         backgroundColor: "#d32f2f",
//         transform: "scale(1.1)",
//       },
//       "&:active": {
//         transform: "scale(0.9)",
//       },
//     }}
//   >
//     Cancel
//   </Button>
//   <Button
//     onClick={handleFormSubmit}
//     sx={{
//       backgroundColor: "#4caf50", // Green for Add Scrap
//       color: "white",
//       fontWeight: "bold",
//       textTransform: "uppercase",
//       padding: "8px 16px",
//       borderRadius: "8px",
//       transition: "transform 0.3s, background-color 0.3s",
//       "&:hover": {
//         backgroundColor: "#388e3c",
//         transform: "scale(1.1)",
//       },
//       "&:active": {
//         transform: "scale(0.9)",
//       },
//     }}
//   >
//     Add Scrap
//   </Button>
// </DialogActions>

// </Dialog>

//       </Box>
//     </Box>
//   );
// };

// export default ScrapManagement;



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

  // const validateImageWithIDX = async (imageData, scrapType) => {
  //   const dynamicPrompt = `Does the uploaded image contain scrap material related to ${scrapType}? Examples include:
  //   - Metal: cans, rods, industrial scrap.
  //   - Plastic: bottles, containers, bags.
  //   - Wood: wooden planks, broken furniture.
  //   Provide a response as either "Relevant Scrap" or "Not Relevant Scrap".`;
  
  //   const contents = [
  //     {
  //       role: "user",
  //       parts: [
  //         { inline_data: { mime_type: "image/jpeg", data: imageData } },
  //         { text: dynamicPrompt },
  //       ],
  //     },
  //   ];
  
  //   try {
  //     const response = await fetch(`${GAMINI_API_URL}${GAMINI_API_KEY}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ contents }),
  //     });
  
  //     const result = await response.json();
  
  //     // Debugging output to inspect the API response
  //     console.log("IDX API Response:", result);
  
  //     // Ensure the response structure is correct
  //     if (!result.candidates || result.candidates.length === 0) {
  //       console.error("Unexpected API response structure:", result);
  //       return false;
  //     }
  
  //     // Extract the response text
  //     const candidateText = result.candidates[0]?.content?.parts?.[0]?.text;
  //     console.log("Candidate Text:", candidateText);
  
  //     // Check if the response is "Relevant Scrap"
  //     return candidateText && candidateText.includes("Relevant Scrap");
  //   } catch (error) {
  //     console.error("Error validating image with IDX:", error);
  //     return false;
  //   }
  // };
  
  
  

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async () => {
  //       if (!formData.scrapType) {
  //         alert("Please select a scrap type before uploading an image.");
  //         return;
  //       }
  
  //       // Extract base64 image data
  //       const imageData = reader.result.split(",")[1];
  
  //       // Validate image using IDX API
  //       const isValid = await validateImageWithIDX(imageData, formData.scrapType);
  
  //       console.log("Validation Result:", isValid ? "Relevant Scrap" : "Not Relevant Scrap");
  
  //       // Update state and display appropriate messages
  //       if (isValid) {
  //         setFormData((prev) => ({ ...prev, image: reader.result }));
  //         setValidationError(""); // Clear any error message
  //         alert("✅ Image validated successfully!");
  //       } else {
  //         setFormData((prev) => ({ ...prev, image: null })); // Clear image if invalid
  //         setValidationError("❌ The uploaded image is not relevant to the selected scrap type.");
  //       }
  //     };
  
  //     reader.readAsDataURL(file);
  //   }
  // };






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
        <Fab color="success" variant={isSmallScreen ? "circular" : "extended"} sx={{ position: "fixed", bottom: "20px", right: "20px" }} onClick={handleDialogOpen}>
          <AddIcon /> {!isSmallScreen && " List New Scrap"}
        </Fab>
        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
          <DialogTitle>Add Scrap Listing</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  variant="outlined"
                  disabled
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
                <Button variant="contained" component="label" fullWidth>
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
                  <Typography color="error">{validationError}</Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleFormSubmit}>Add Scrap</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ScrapManagement;
