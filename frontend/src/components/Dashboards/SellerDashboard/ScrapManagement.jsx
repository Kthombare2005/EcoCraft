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
// import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import statesJson from "../../../assets/states.json";
// import citiesJson from "../../../assets/cities.json";
// import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { serverTimestamp } from "firebase/firestore";
// // import { findNearestScrapersWithGamini } from "../../../utils/firestoreUtils";
// import { findNearestScrapersWithGamini } from "../../../utils/gaminiUtils"; // Create and store Gamini-related logic here
// import LoadingSpinner from "../../../components/LoadingSpinner";
// import axios from "axios";
// import { Alert } from '@mui/material';

// const GAMINI_API_KEY = "AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw";
// const GAMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

// const ScrapManagement = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [cities, setCities] = useState([]);
//   const [validationError, setValidationError] = useState("");
//   const [scrapListings, setScrapListings] = useState([]);
//   const [selectedScrap, setSelectedScrap] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [nearbyScrapers, setNearbyScrapers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [validationSuccess, setValidationSuccess] = useState("");

//   // const [addressError, setAddressError] = useState("");

//   // const validateAddress = async (address, city, state) => {
//   //   const API_KEY = "AIzaSyCcenVOKOAhHj0DO_JmR_bocN9FEebP74M"; // Replace with your actual API key
//   //   const fullAddress = `${address}, ${city}, ${state}`;

//   //   try {
//   //     console.log("Validating full address:", fullAddress);

//   //     const response = await axios.get(
//   //       `https://maps.googleapis.com/maps/api/geocode/json`,
//   //       {
//   //         params: {
//   //           address: fullAddress,
//   //           key: API_KEY,
//   //         },
//   //       }
//   //     );

//   //     console.log("Maps API Response:", response.data);

//   //     const results = response.data.results;

//   //     if (results.length > 0) {
//   //       // Loop through all results to find an exact match
//   //       for (let result of results) {
//   //         const { formatted_address } = result;

//   //         // Check if the formatted address contains the input address, city, and state
//   //         const isAddressValid =
//   //           formatted_address.toLowerCase().includes(address.toLowerCase()) &&
//   //           formatted_address.toLowerCase().includes(city.toLowerCase()) &&
//   //           formatted_address.toLowerCase().includes(state.toLowerCase());

//   //         if (isAddressValid) {
//   //           console.log("Valid address found:", formatted_address);
//   //           return true;
//   //         }
//   //       }
//   //     }

//   //     console.warn("No valid address found matching the entered details.");
//   //     return false; // Address not valid
//   //   } catch (error) {
//   //     console.error("Error validating address:", error);
//   //     return false;
//   //   }
//   // };

//   const validateAddress = async (address, city, state, setLoading) => {
//     const API_KEY = "AIzaSyCcenVOKOAhHj0DO_JmR_bocN9FEebP74M"; // Replace with your actual API key
//     const fullAddress = `${address}, ${city}, ${state}`;

//     try {
//       console.log("Validating full address:", fullAddress);

//       // Start the loader
//       setLoading(true);

//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json`,
//         {
//           params: {
//             address: fullAddress,
//             key: API_KEY,
//           },
//         }
//       );

//       console.log("Maps API Response:", response.data);

//       const results = response.data.results;

//       if (results.length > 0) {
//         for (let result of results) {
//           const { formatted_address } = result;

//           const isAddressValid =
//             formatted_address.toLowerCase().includes(address.toLowerCase()) &&
//             formatted_address.toLowerCase().includes(city.toLowerCase()) &&
//             formatted_address.toLowerCase().includes(state.toLowerCase());

//           if (isAddressValid) {
//             console.log("Valid address found:", formatted_address);
//             setLoading(false); // Stop the loader
//             return true;
//           }
//         }
//       }

//       console.warn("No valid address found matching the entered details.");
//       setLoading(false); // Stop the loader
//       return false; // Address not valid
//     } catch (error) {
//       console.error("Error validating address:", error);
//       setLoading(false); // Stop the loader
//       return false;
//     }
//   };

//   const handleFormSubmit = async () => {
//     const { address, city, state } = formData;

//     // Perform address validation
//     const isValidAddress = await validateAddress(address, city, state, setLoading);

//     if (!isValidAddress) {
//       alert("Invalid address. Please check the details.");
//       return; // Stop form submission if the address is invalid
//     }

//     try {
//       await addDoc(collection(db, "scrapListings"), {
//         ...formData,
//         createdOn: serverTimestamp(),
//       });
//       handleDialogClose();
//       fetchScrapListings(); // Refresh the list after adding new scrap
//       alert("Scrap listing added successfully!");
//     } catch (error) {
//       console.error("Error adding scrap listing:", error);
//     }
//   };

//   const handleOpenDialog = async (scrap) => {
//     setSelectedScrap(scrap);
//     setOpenDialog(true);
//     setLoading(true); // Show loading spinner

//     if (scrap.city && scrap.state) {
//       try {
//         const rankedScrapers = await findNearestScrapersWithGamini(
//           scrap.city,
//           scrap.state
//         );
//         setNearbyScrapers(rankedScrapers);
//       } catch (error) {
//         console.error("Error finding nearest scrapers:", error);
//         setNearbyScrapers([]);
//       } finally {
//         setLoading(false); // Hide loading spinner
//       }
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedScrap(null);
//   };

//   const fetchScrapListings = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "scrapListings"));
//       const listings = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setScrapListings(listings);
//     } catch (error) {
//       console.error("Error fetching scrap listings:", error);
//     }
//   };

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
//     fetchScrapListings();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       unsubscribeAuth();
//     };
//   }, []);

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

//   const handleDialogOpen = () => {
//     setDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//     setFormData({
//       name: formData.name,
//       contactNumber: formData.contactNumber,
//       address: "",
//       pinCode: "",
//       city: "",
//       state: "",
//       scrapType: "",
//       weight: "",
//       unit: "kg",
//       price: "",
//       image: null,
//     });
//     setValidationError("");
//   };

//   // const handlePinCodeChange = (e) => {
//   //   const value = e.target.value;
//   //   if (/^\d{0,6}$/.test(value)) {
//   //     setFormData((prev) => ({ ...prev, pinCode: value }));
//   //   }
//   // };

//   const handleStateChange = (e) => {
//     const selectedState = e.target.value;
//     setFormData((prev) => ({ ...prev, state: selectedState, city: "" }));
//     setCities(citiesJson[selectedState] || []);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "weight" && !/^[0-9]*$/.test(value)) return;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateImageWithIDX = async (imageData, scrapType) => {
//     const dynamicPrompt = `Evaluate if the uploaded image contains scrap material relevant to the selected scrap type: ${scrapType}. Acceptable examples for each scrap type are as follows:
//     - Metal: Discarded metal rods, sheets, cans, pipes, or any industrial metal waste.
//     - Plastic: Used or discarded plastic bottles, containers, bags, or plastic packaging materials.
//     - Paper: Old newspapers, books, office paper, or shredded paper.
//     - Cardboard: Flattened or damaged cardboard boxes, packaging materials, or other cardboard waste.
//     - Glass: Broken glass, glass bottles, jars, or any glass items.
//     - Electronics: Broken or unusable phones, laptops, wires, circuit boards, or electronic components.
//     - Textiles: Old clothes, fabric pieces, curtains, or textile scraps.
//     - Wood: Broken wooden furniture, planks, raw wood cuttings, or scrap wood.
//     - Rubber: Used or worn-out tires, rubber sheets, or other rubber materials.
//     - Organic Waste: Food waste, plant materials, garden clippings, or other compostable items.
//     - Batteries: Used or damaged batteries, including car batteries or household batteries.

//     Reject all images that do not visually align with the selected scrap type.

//     Respond only with:
//     - "Relevant Scrap" if the image matches the scrap type.
//     - "Not Relevant Scrap" if the image does not match the scrap type.`;

//     const contents = [
//       {
//         role: "user",
//         parts: [
//           { inline_data: { mime_type: "image/jpeg", data: imageData } },
//           { text: dynamicPrompt },
//         ],
//       },
//     ];

//     try {
//       const response = await fetch(`${GAMINI_API_URL}${GAMINI_API_KEY}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ contents }),
//       });

//       const result = await response.json();

//       console.log("IDX API Response:", result);

//       // Ensure the response structure is correct
//       if (!result.candidates || result.candidates.length === 0) {
//         console.error("Unexpected API response structure:", result);
//         return false;
//       }

//       // Extract the response text
//       const candidateText =
//         result.candidates[0]?.content?.parts?.[0]?.text?.trim();
//       console.log("Candidate Text:", candidateText);

//       // Match the candidate text to expected values
//       const isRelevantScrap = candidateText === "Relevant Scrap";
//       console.log(
//         "Validation Result:",
//         isRelevantScrap ? "Relevant Scrap" : "Not Relevant Scrap"
//       );

//       return isRelevantScrap;
//     } catch (error) {
//       console.error("Error validating image with IDX:", error);
//       return false;
//     }
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setLoading(true); // Show loader
//       const reader = new FileReader();
//       reader.onload = async () => {
//         try {
//           if (!formData.scrapType) {
//             alert("Please select a scrap type before uploading an image.");
//             setLoading(false); // Hide loader
//             return;
//           }
//           const imageData = reader.result.split(",")[1];
//           const isValid = await validateImageWithIDX(imageData, formData.scrapType);
//           setLoading(false); // Hide loader
//           if (isValid) {
//             setFormData((prev) => ({ ...prev, image: reader.result }));
//           } else {
//             alert("Invalid image type!");
//           }
//         } catch (error) {
//           console.error(error);
//           setLoading(false); // Hide loader
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
//       {loading && (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       backgroundColor: "rgba(255, 255, 255, 0.7)",
//       zIndex: 1000,
//     }}
//   >
//     <LoadingSpinner />
//   </Box>
// )}

//       <Sidebar
//         isOpen={isSidebarOpen}
//         onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
//         activeMenuItem="Sell Scrap"
//       />
//       <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
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

//         <Accordion defaultExpanded>
//           <AccordionSummary
//             expandIcon={<ExpandMoreIcon />}
//             sx={{ backgroundColor: "#e3f2fd" }}
//           >
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: "bold",
//                 color: "#004080",
//                 fontFamily: "'Arvo', serif",
//               }}
//             >
//               View Enlisted Scraps
//             </Typography>
//           </AccordionSummary>
//           <AccordionDetails>
//             <div className="container mt-3">
//               <div className="row">
//                 {scrapListings.length > 0 ? (
//                   scrapListings.map((scrap) => (
//                     <div
//                       className="col-12 col-sm-6 col-md-4 mb-4"
//                       key={scrap.id}
//                     >
//                       <div
//                         className="card"
//                         style={{
//                           borderRadius: "12px",
//                           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                           overflow: "hidden",
//                           border: "none",
//                         }}
//                       >
//                         {/* Top Section for Image or Scrap Type */}
//                         <div
//                           style={{
//                             height: "200px", // Increased height for the image area
//                             backgroundColor: "#f0f0f0",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           {scrap.image ? (
//                             <img
//                               src={scrap.image}
//                               alt={scrap.scrapName}
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                                 borderRadius: "8px 8px 0 0",
//                               }}
//                             />
//                           ) : (
//                             <h3 style={{ fontWeight: "bold", color: "#999" }}>
//                               {scrap.scrapType || "Scrap"}
//                             </h3>
//                           )}
//                         </div>

//                         {/* Card Body */}
//                         <div className="card-body" style={{ padding: "20px" }}>
//                           <h5
//                             style={{
//                               fontWeight: "bold",
//                               marginBottom: "10px",
//                               color: "#333",
//                             }}
//                           >
//                             {scrap.scrapName || "Scrap Item"}
//                           </h5>
//                           <p style={{ fontSize: "0.9rem", color: "#666" }}>
//                             Listed on:{" "}
//                             {scrap.createdOn && scrap.createdOn.toDate
//                               ? scrap.createdOn.toDate().toLocaleDateString()
//                               : "Unknown Date"}
//                             <br />
//                             <strong>Weight:</strong>{" "}
//                             {scrap.weight
//                               ? `${scrap.weight} ${scrap.unit}`
//                               : "N/A"}{" "}
//                             <br />
//                             <strong>Category:</strong>{" "}
//                             {scrap.scrapType || "N/A"} <br />
//                             <strong>Location:</strong> {scrap.city || "N/A"},{" "}
//                             {scrap.state || "N/A"}
//                           </p>
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                             }}
//                           >
//                             <h6
//                               style={{
//                                 fontWeight: "bold",
//                                 color: "#28a745",
//                                 marginBottom: "0",
//                               }}
//                             >
//                               ₹{scrap.price || "N/A"}
//                             </h6>
//                             <a
//                               href="#"
//                               className="btn"
//                               style={{
//                                 color: "#007bff",
//                                 textDecoration: "none",
//                                 fontWeight: "bold",
//                               }}
//                               onClick={() => handleOpenDialog(scrap)}
//                             >
//                               View Details →
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       textAlign: "center",
//                       color: "gray",
//                       fontStyle: "italic",
//                       margin: "20px auto",
//                     }}
//                   >
//                     No scraps listed yet.
//                   </Typography>
//                 )}
//               </div>
//             </div>
//           </AccordionDetails>
//         </Accordion>

//         {/* Scrap Details Dialog */}
//         <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
//           {selectedScrap && (
//             <>
//               <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
//                 Scrap Details
//               </DialogTitle>
//               <DialogContent>
//                 {loading ? (
//                   <LoadingSpinner />
//                 ) : (
//                   <>
//                     <Typography variant="h6">
//                       Scrap Name: {selectedScrap.scrapName}
//                     </Typography>
//                     <Typography>Type: {selectedScrap.scrapType}</Typography>
//                     <Typography>
//                       Weight: {selectedScrap.weight} {selectedScrap.unit}
//                     </Typography>
//                     <Typography>Price: ₹{selectedScrap.price}</Typography>
//                     <Typography>
//                       Location: {selectedScrap.city}, {selectedScrap.state}
//                     </Typography>
//                     <Typography>
//                       Contact: {selectedScrap.contactNumber}
//                     </Typography>
//                     <Typography>Address: {selectedScrap.address}</Typography>

//                     {/* Nearby Scrapers */}
//                     <Typography
//                       variant="h6"
//                       sx={{ marginTop: "20px", fontWeight: "bold" }}
//                     >
//                       Nearby Scrap Dealers (Within 4-5 km):
//                     </Typography>
//                     {nearbyScrapers.length > 0 ? (
//                       nearbyScrapers.map((scraper, index) => (
//                         <Box
//                           key={index}
//                           sx={{
//                             padding: "10px",
//                             border: "1px solid #ccc",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <Typography
//                             variant="subtitle1"
//                             sx={{ fontWeight: "bold" }}
//                           >
//                             {scraper.name}
//                           </Typography>
//                           <Typography>📍 {scraper.shop_address}</Typography>
//                           <Typography>
//                             📞{" "}
//                             {scraper.contact_number || "Contact Not Available"}
//                           </Typography>
//                           {scraper.contact_number && (
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               href={`tel:${scraper.contact_number}`}
//                               sx={{ marginTop: "5px" }}
//                             >
//                               Call Now
//                             </Button>
//                           )}
//                         </Box>
//                       ))
//                     ) : (
//                       <Typography sx={{ color: "gray", fontStyle: "italic" }}>
//                         No nearby scrapers found.
//                       </Typography>
//                     )}
//                   </>
//                 )}
//               </DialogContent>
//               <DialogActions>
//                 <Button
//                   onClick={handleCloseDialog}
//                   color="primary"
//                   variant="contained"
//                 >
//                   Close
//                 </Button>
//               </DialogActions>
//             </>
//           )}
//         </Dialog>

//         <Fab
//           color="success"
//           variant={isSmallScreen ? "circular" : "extended"}
//           sx={{
//             position: "fixed",
//             bottom: "20px",
//             right: "20px",
//             animation: "zoom 1s infinite",
//             "@keyframes zoom": {
//               "0%": {
//                 transform: "scale(1)",
//               },
//               "50%": {
//                 transform: "scale(1.1)",
//               },
//               "100%": {
//                 transform: "scale(1)",
//               },
//             },
//             transition: "transform 0.2s ease-in-out",
//           }}
//           onClick={handleDialogOpen}
//         >
//           <AddIcon />
//           {!isSmallScreen && " List New Scrap"}
//         </Fab>

//         <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
//   <DialogTitle
//     sx={{
//       marginBottom: "5px",
//       fontSize: "1.5rem",
//       fontWeight: "bold",
//       color: "#004080",
//       textAlign: "center",
//       fontFamily: "'Arvo', serif",
//     }}
//   >
//     Add Scrap Listing
//   </DialogTitle>
//   <DialogContent>
//     {loading && (
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundColor: "rgba(255, 255, 255, 0.8)",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           zIndex: 1300,
//         }}
//       >
//         <LoadingSpinner />
//       </Box>
//     )}
//     {!loading && (
//       <>
//         {/* Display success or error messages */}
//         {validationError && (
//           <Alert
//             severity="error"
//             sx={{ marginBottom: "16px", fontWeight: "bold" }}
//           >
//             {validationError}
//           </Alert>
//         )}
//         {validationSuccess && (
//           <Alert
//             severity="success"
//             sx={{ marginBottom: "16px", fontWeight: "bold" }}
//           >
//             {validationSuccess}
//           </Alert>
//         )}
//         <Grid container spacing={2} sx={{ marginTop: "5px" }}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Name"
//               name="name"
//               value={formData.name}
//               variant="outlined"
//               disabled
//               sx={{
//                 "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
//                   {
//                     borderColor: "#004080",
//                   },
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Contact Number"
//               name="contactNumber"
//               value={formData.contactNumber}
//               variant="outlined"
//               disabled
//               sx={{
//                 "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
//                   {
//                     borderColor: "#004080",
//                   },
//               }}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Scrap Name"
//               name="scrapName"
//               value={formData.scrapName}
//               onChange={handleInputChange}
//               variant="outlined"
//               sx={{
//                 "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
//                   {
//                     borderColor: "#004080",
//                   },
//               }}
//             />
//           </Grid>

//           <Grid
//             container
//             spacing={2}
//             sx={{ marginTop: "5px", marginLeft: "1px" }}
//           >
//             <Grid item xs={12} sm={8}>
//               <TextField
//                 fullWidth
//                 label="Address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 variant="outlined"
//                 error={!!validationError} // Show error if validationError is set
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 fullWidth
//                 label="Pin Code"
//                 name="pinCode"
//                 value={formData.pinCode}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (/^\d{0,5}$/.test(value)) {
//                     setFormData((prev) => ({ ...prev, pinCode: value }));
//                   }
//                 }}
//                 inputProps={{ maxLength: 6 }}
//                 variant="outlined"
//               />
//             </Grid>
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="State"
//               name="state"
//               value={formData.state}
//               onChange={handleStateChange}
//               select
//               variant="outlined"
//             >
//               {statesJson.states.map((state) => (
//                 <MenuItem key={state} value={state}>
//                   {state}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="City"
//               name="city"
//               value={formData.city}
//               onChange={handleInputChange}
//               select
//               variant="outlined"
//               disabled={!formData.state}
//             >
//               {cities.map((city) => (
//                 <MenuItem key={city} value={city}>
//                   {city}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Scrap Type"
//               name="scrapType"
//               value={formData.scrapType}
//               onChange={handleInputChange}
//               select
//               variant="outlined"
//             >
//               {scrapTypes.map((type) => (
//                 <MenuItem key={type} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Approx Weight"
//               name="weight"
//               value={formData.weight}
//               onChange={handleInputChange}
//               variant="outlined"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               fullWidth
//               label="Unit"
//               name="unit"
//               value={formData.unit}
//               onChange={handleInputChange}
//               select
//               variant="outlined"
//             >
//               {weightUnits.map((unit) => (
//                 <MenuItem key={unit} value={unit}>
//                   {unit}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12}>
//             <Button
//               variant="contained"
//               component="label"
//               fullWidth
//               sx={{
//                 backgroundColor: "#1976d2",
//                 color: "white",
//                 fontWeight: "bold",
//                 textTransform: "uppercase",
//                 marginTop: "16px",
//                 "&:hover": {
//                   backgroundColor: "#1565c0",
//                   transform: "scale(1.05)",
//                   transition: "transform 0.2s",
//                 },
//               }}
//             >
//               Upload Image
//               <input type="file" hidden onChange={handleFileChange} />
//             </Button>
//             {formData.image && (
//               <Box sx={{ marginTop: "16px", textAlign: "center" }}>
//                 <Typography>Image Preview:</Typography>
//                 <img
//                   src={formData.image}
//                   alt="Preview"
//                   style={{ maxWidth: "100%", maxHeight: "200px" }}
//                 />
//               </Box>
//             )}
//           </Grid>
//         </Grid>
//       </>
//     )}
//   </DialogContent>
//   <DialogActions
//     sx={{
//       justifyContent: "space-between",
//       padding: "16px",
//     }}
//   >
//     <Button
//       onClick={handleDialogClose}
//       sx={{
//         backgroundColor: "#d32f2f",
//         color: "white",
//         fontWeight: "bold",
//         "&:hover": {
//           backgroundColor: "#c62828",
//           transform: "scale(1.05)",
//           transition: "transform 0.2s",
//         },
//       }}
//     >
//       Cancel
//     </Button>
//     <Button
//       onClick={handleFormSubmit}
//       sx={{
//         backgroundColor: "#388e3c",
//         color: "white",
//         fontWeight: "bold",
//         "&:hover": {
//           backgroundColor: "#2e7d32",
//           transform: "scale(1.05)",
//           transition: "transform 0.2s",
//         },
//       }}
//     >
//       Add Scrap
//     </Button>
//   </DialogActions>
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
import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import statesJson from "../../../assets/states.json";
import citiesJson from "../../../assets/cities.json";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { serverTimestamp } from "firebase/firestore";
// import { findNearestScrapersWithGamini } from "../../../utils/firestoreUtils";
// import { findNearestScrapersWithGamini } from "../../../utils/gaminiUtils"; // Create and store Gamini-related logic here
import LoadingSpinner from "../../../components/LoadingSpinner";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { query, where } from "firebase/firestore";
import { Autocomplete } from "@mui/material";
import { findScrapersFromGoogleMaps } from "../../../utils/googleMapsUtils";
// import {findScrapersFromGoogleMaps} from "../../../utils/gaminiUtils"

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
  // const [addressError, setAddressError] = useState("");
  const [imageValidationLoading, setImageValidationLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [addressValidationLoading, setAddressValidationLoading] =
    useState(false);
  const [addressValidationMessage, setAddressValidationMessage] = useState("");
  // const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State to store success messages
  // const [loadingMessage, setLoadingMessage] = useState(""); // Add this line to your state declarations
  const [formErrors, setFormErrors] = useState({});
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const validateAddress = async (address, city, state) => {
    const API_KEY = "AIzaSyCcenVOKOAhHj0DO_JmR_bocN9FEebP74M";
    const fullAddress = `${address}, ${city}, ${state}`;

    setAddressValidationLoading(true); // Show loader

    try {
      // Send the request to the Google Maps Geocoding API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: fullAddress,
            key: API_KEY,
          },
        }
      );

      // Extract results from the API response
      const results = response.data.results;

      if (results.length > 0) {
        const formattedAddress = results[0].formatted_address.toLowerCase();

        // Check if the formatted address includes the provided address, city, and state
        const isAddressValid =
          formattedAddress.includes(address.toLowerCase()) &&
          formattedAddress.includes(city.toLowerCase()) &&
          formattedAddress.includes(state.toLowerCase());

        if (isAddressValid) {
          setAddressValidationMessage("✅ Address validated successfully!");
          setTimeout(() => {
            setAddressValidationMessage("");
          }, 5000); // Clear the message after 5 seconds
          return true; // Address is valid
        }
      }

      // If no valid address is found
      setAddressValidationMessage(
        "❌ The entered address does not match the selected city and state."
      );
      setTimeout(() => {
        setAddressValidationMessage("");
      }, 5000);

      return false;
    } catch (error) {
      // Handle errors during the API call
      console.error("Error during address validation:", error.message || error);
      setAddressValidationMessage(
        "❌ Failed to validate the address. Please try again."
      );
      return false;
    } finally {
      setAddressValidationLoading(false); // Hide loader after the process completes
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.scrapName) errors.scrapName = "Scrap name is required.";
    if (!formData.address) errors.address = "Address is required.";
    if (!formData.pinCode) errors.pinCode = "Pin code is required.";
    if (!formData.state) errors.state = "State is required.";
    if (!formData.city) errors.city = "City is required.";
    if (!formData.scrapType) errors.scrapType = "Scrap type is required.";
    if (!formData.weight) errors.weight = "Weight is required.";
    if (!formData.unit) errors.unit = "Weight unit is required.";
    if (!formData.image) errors.image = "Please upload an image.";

    setFormErrors(errors); // Update the error state
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      setValidationError(
        "❌ All fields are necessary. Please fill out all fields."
      );
      return;
    }

    setLoading(true); // Show loader for the entire submission process
    setValidationError(""); // Clear previous errors

    try {
      // Address validation
      const isAddressValid = await validateAddress(
        formData.address,
        formData.city,
        formData.state
      );

      if (!isAddressValid) {
        setFormErrors((prev) => ({
          ...prev,
          address:
            "The entered address does not match the selected city and state.",
        }));
        setLoading(false);
        return;
      }

      // Add a loader for the transition from address validation to scrap submission
      setSubmissionLoading(true);

      // Simulate a delay for better UX (optional)
      setTimeout(async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            setLoading(false);
            setSubmissionLoading(false);
            setValidationError("❌ You must be logged in to list scrap.");
            return;
          }

          await addDoc(collection(db, "scrapListings"), {
            ...formData,
            userId: user.uid,
            createdOn: serverTimestamp(),
          });

          setSuccessMessage("✅ Scrap added successfully!");
          setSubmissionLoading(false); // Stop transition loader

          // Close the dialog and reset after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
            handleDialogClose();
          }, 3000);

          fetchScrapListings(user.uid); // Fetch updated listings
        } catch (error) {
          console.error("Error adding scrap listing:", error);
          setValidationError("❌ Failed to add scrap. Please try again.");
          setSubmissionLoading(false);
        } finally {
          setLoading(false);
        }
      }, 2000); // Simulate a small delay (2 seconds) for transition
    } catch (error) {
      console.error("Error during form submission:", error);
      setValidationError("❌ An error occurred during the process.");
      setSubmissionLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (scrap) => {
    setSelectedScrap(scrap);
    setOpenDialog(true);
    setLoading(true); // Show full-screen loader
  
    try {
      // 🔹 Extract User's Pin Code & Address
      const { pinCode, address, city, state } = scrap;
  
      if (!pinCode && (!address || !city || !state)) {
        console.error("❌ Insufficient details for finding nearby scrapers.");
        alert("⚠️ Please provide either a pin code or a complete address.");
        setLoading(false);
        return;
      }
  
      // 🔹 Fetch Nearby Scrapers Using Google Maps
      const scrapers = await findScrapersFromGoogleMaps(pinCode, address, city, state);
  
      // 🔹 Update State with Scrapers
      setNearbyScrapers(scrapers);
    } catch (error) {
      console.error("❌ Error finding scrapers:", error);
      setNearbyScrapers([]);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedScrap(null);
  };

  const fetchScrapListings = async (userId) => {
    try {
      // Query Firestore for scraps added by the logged-in user
      const q = query(
        collection(db, "scrapListings"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      // Map the query results to an array
      const listings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setScrapListings(listings); // Update state with the fetched listings
    } catch (error) {
      console.error("Error fetching scrap listings:", error);
    }
  };

  const [formData, setFormData] = useState({
    scrapName: "", // Field for scrap name
    address: "", // Field for address
    pinCode: "", // Field for pin code
    city: "", // Field for city
    state: "", // Field for state
    scrapType: "", // Field for scrap type
    weight: "", // Field for weight
    unit: "kg", // Default value for unit
    image: null, // Field for image
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
        fetchScrapListings(currentUser.uid); // Fetch only the logged-in user's scraps
      } else {
        setScrapListings([]); // Clear listings if no user is logged in
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
      scrapName: "",
      address: "",
      pinCode: "",
      city: "",
      state: "",
      scrapType: "",
      weight: "",
      unit: "kg",
      image: null,
    });
    setValidationError(""); // Clear validation errors
    setSuccessMessage(""); // Clear success message
  };

  // const handlePinCodeChange = (e) => {
  //   const value = e.target.value;
  //   if (/^\d{0,6}$/.test(value)) {
  //     setFormData((prev) => ({ ...prev, pinCode: value }));
  //   }
  // };

  // const handleStateChange = (e) => {
  //   const selectedState = e.target.value;
  //   setFormData((prev) => ({ ...prev, state: selectedState, city: "" }));
  //   setCities(citiesJson[selectedState] || []);
  // };

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
      const candidateText =
        result.candidates[0]?.content?.parts?.[0]?.text?.trim();
      console.log("Candidate Text:", candidateText);

      // Match the candidate text to expected values
      const isRelevantScrap = candidateText === "Relevant Scrap";
      console.log(
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
      const reader = new FileReader();
      reader.onload = async () => {
        if (!formData.scrapType) {
          setValidationMessage(
            "❌ Please select a scrap type before uploading an image."
          );
          return;
        }

        const imageData = reader.result.split(",")[1];

        setImageValidationLoading(true); // Show loader
        setValidationMessage(""); // Clear previous messages

        const isValid = await validateImageWithIDX(
          imageData,
          formData.scrapType
        );

        setImageValidationLoading(false); // Hide loader

        if (isValid) {
          setFormData((prev) => ({ ...prev, image: reader.result }));
          setValidationMessage("✅ Image validated successfully!");
          setTimeout(() => {
            setValidationMessage("");
          }, 5000);
        } else {
          setFormData((prev) => ({ ...prev, image: null }));
          setValidationMessage(
            "❌ The uploaded image is not relevant to the selected scrap type."
          );
          setTimeout(() => {
            setValidationMessage("");
          }, 5000);
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

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccessMessage("")}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!addressValidationMessage}
          autoHideDuration={3000}
          onClose={() => setAddressValidationMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setAddressValidationMessage("")}
            severity={
              addressValidationMessage.includes("✅") ? "success" : "error"
            }
            sx={{ width: "100%" }}
          >
            {addressValidationMessage}
          </Alert>
        </Snackbar>

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
                        {/* Top Section for Image or Scrap Type */}
                        <div
                          style={{
                            height: "200px", // Increased height for the image area
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

                        {/* Card Body */}
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h6
                              style={{
                                fontWeight: "bold",
                                color: "#28a745",
                                marginBottom: "0",
                              }}
                            >
                              ₹{scrap.price || "N/A"}
                            </h6>
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

        {/* Scrap Details Dialog */}
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
                    {/* Scrap Details */}
                    <Box
                      sx={{
                        padding: "12px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#004080" }}
                      >
                        {selectedScrap.scrapName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                        📌 <strong>Type:</strong> {selectedScrap.scrapType}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                        ⚖️ <strong>Weight:</strong> {selectedScrap.weight}{" "}
                        {selectedScrap.unit}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                        💰 <strong>Price:</strong> ₹{selectedScrap.price}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                        📍 <strong>Location:</strong> {selectedScrap.city},{" "}
                        {selectedScrap.state}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                        📞 <strong>Contact:</strong>{" "}
                        {selectedScrap.contactNumber}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                        🏠 <strong>Address:</strong> {selectedScrap.address}
                      </Typography>
                    </Box>

                    {/* 🔹 Nearby Scrapers Section */}
                    {/* Nearby Scrapers */}
                    {/* Nearby Scrapers */}
<Typography
  variant="h6"
  sx={{ marginTop: "20px", fontWeight: "bold", color: "#004080" }}
>
  Nearby Scrap Dealers (Top 5):
</Typography>

{nearbyScrapers.length > 0 ? (
  nearbyScrapers.slice(0, 5).map((scraper, index) => (
    <Box
      key={index}
      sx={{
        padding: "12px",
        marginTop: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f4f4f4",
        transition: "0.3s",
        "&:hover": { boxShadow: "0px 4px 8px rgba(0,0,0,0.2)" },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        {scraper.name}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.9rem",
          color: "#007bff",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
        onClick={() =>
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              scraper.shop_address
            )}`,
            "_blank"
          )
        }
      >
        📍 {scraper.shop_address}
      </Typography>
      {scraper.rating && (
        <Typography sx={{ fontSize: "0.9rem", color: "#ff9800" }}>
          ⭐ {scraper.rating} / 5
        </Typography>
      )}
    </Box>
  ))
) : (
  <Typography
    sx={{
      color: "gray",
      fontStyle: "italic",
      textAlign: "center",
      marginTop: "10px",
    }}
  >
    ❌ No nearby scrapers found.
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
                  sx={{ fontWeight: "bold" }}
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
              {/* Name Field */}
              {submissionLoading && (
                <Box
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    zIndex: 2000,
                  }}
                >
                  <LoadingSpinner />
                  <Typography
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      marginTop: "16px",
                    }}
                  >
                    Completing Scrap Listing...
                  </Typography>
                </Box>
              )}

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

              {/* Contact Number Field */}
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

              {/* Scrap Name Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Scrap Name"
                  name="scrapName"
                  value={formData.scrapName}
                  onChange={handleInputChange}
                  variant="outlined"
                  error={!!formErrors.scrapName}
                  helperText={formErrors.scrapName}
                  sx={{
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#004080",
                      },
                  }}
                />
              </Grid>

              {/* Address and Pin Code Fields */}
              <Grid
                container
                spacing={2}
                sx={{ marginTop: "5px", marginLeft: "1px" }}
              >
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    variant="outlined"
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Pin Code"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,6}$/.test(value)) {
                        setFormData((prev) => ({ ...prev, pinCode: value }));
                      }
                    }}
                    inputProps={{ maxLength: 6 }}
                    variant="outlined"
                    error={!!formErrors.pinCode}
                    helperText={formErrors.pinCode}
                  />
                </Grid>
              </Grid>

              {/* State and City Fields */}
              {/* State Selection with Search Feature */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={statesJson.states} // State list from JSON
                  getOptionLabel={(option) => option} // Display option as label
                  value={formData.state || null}
                  onChange={(event, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      state: newValue,
                      city: "",
                    })); // Reset city when state changes
                    setCities(citiesJson[newValue] || []); // Update city options based on selected state
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      variant="outlined"
                      fullWidth
                      error={!!formErrors.state}
                      helperText={formErrors.state}
                    />
                  )}
                />
              </Grid>

              {/* City Selection with Search Feature */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={cities} // City list based on selected state
                  getOptionLabel={(option) => option} // Display option as label
                  value={formData.city || null}
                  onChange={(event, newValue) => {
                    setFormData((prev) => ({ ...prev, city: newValue }));
                  }}
                  disabled={!formData.state} // Disable city selection until a state is selected
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      variant="outlined"
                      fullWidth
                      error={!!formErrors.city}
                      helperText={formErrors.city}
                    />
                  )}
                />
              </Grid>

              {/* Scrap Type Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Scrap Type"
                  name="scrapType"
                  value={formData.scrapType}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
                  error={!!formErrors.scrapType}
                  helperText={formErrors.scrapType}
                >
                  {scrapTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Weight and Unit Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Approx Weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  variant="outlined"
                  error={!!formErrors.weight}
                  helperText={formErrors.weight}
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
                  error={!!formErrors.unit}
                  helperText={formErrors.unit}
                >
                  {weightUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Image Upload and Validation */}
              <Grid item xs={12}>
                {/* Image Upload Button */}
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

                {/* Image Field Validation Error */}
                {formErrors.image && (
                  <Typography
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                      marginTop: "8px",
                      textAlign: "center",
                    }}
                  >
                    {formErrors.image}
                  </Typography>
                )}

                {/* Show Image Validation Loader (Full-Screen) */}
                {imageValidationLoading && (
                  <Box
                    sx={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      zIndex: 2000,
                    }}
                  >
                    <LoadingSpinner />
                    <Typography
                      sx={{
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginTop: "16px",
                      }}
                    >
                      Validating Image...
                    </Typography>
                  </Box>
                )}

                {/* Show Image Validation Success/Failure Message */}
                {!imageValidationLoading && validationMessage && (
                  <Box sx={{ marginTop: "16px", textAlign: "center" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: validationMessage.includes("✅")
                          ? "green"
                          : "red",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {validationMessage}
                    </Typography>
                  </Box>
                )}

                {/* Show Image Preview After Validation */}
                {!imageValidationLoading && formData.image && (
                  <Box sx={{ marginTop: "16px", textAlign: "center" }}>
                    <Typography>Image Preview:</Typography>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </Grid>

              {/* Show Address Validation Loader (Full-Screen) */}
              {addressValidationLoading && (
                <Box
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    zIndex: 2000,
                  }}
                >
                  <LoadingSpinner />
                  <Typography
                    sx={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      marginTop: "16px",
                    }}
                  >
                    Validating Address...
                  </Typography>
                </Box>
              )}

              {/* General Validation Error */}
              {validationError && (
                <Box sx={{ textAlign: "center", marginBottom: "16px" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    {validationError}
                  </Typography>
                </Box>
              )}
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
