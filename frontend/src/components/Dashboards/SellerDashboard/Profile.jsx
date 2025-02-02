// import PropTypes from "prop-types";
// import { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
// import {
//   Avatar,
//   Box,
//   Card,
//   Grid,
//   TextField,
//   Typography,
//   InputAdornment,
//   IconButton,
//   Button,
//   MenuItem,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import Sidebar from "../Sidebar";
// import statesData from "../../../assets/states.json";
// import citiesData from "../../../assets/cities.json";

// const ProfilePage = ({ isSidebarCollapsed }) => {
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     contact: "", // Updated field to match Firebase
//     state: "",
//     city: "",
//     address: "",
//   });
//   const [editableFields, setEditableFields] = useState({
//     name: false,
//     contact: false,
//     state: false,
//     city: false,
//     address: false,
//   });
//   const auth = getAuth();
//   const db = getFirestore();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         const userDoc = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(userDoc);

//         if (docSnap.exists()) {
//           const fetchedData = {
//             name: docSnap.data().name || "",
//             email: docSnap.data().email || currentUser.email,
//             contact: docSnap.data().Contact || "", // Corrected field name
//             state: docSnap.data().state || "",
//             city: docSnap.data().city || "",
//             address: docSnap.data().address || "",
//           };
//           setUserData(fetchedData);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, db]);

//   const handleFieldEditToggle = (field) => {
//     setEditableFields((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleSave = async () => {
//     if (user) {
//       const userDoc = doc(db, "users", user.uid);
//       await updateDoc(userDoc, { ...userData });
//       setEditableFields({
//         name: false,
//         contact: false,
//         state: false,
//         city: false,
//         address: false,
//       });
//     }
//   };

//   const handleCancel = () => {
//     setEditableFields({
//       name: false,
//       contact: false,
//       state: false,
//       city: false,
//       address: false,
//     });
//   };

//   return (
//     <Box sx={{ display: "flex", height: "100vh" }}>
//       <Sidebar />
//       <Box
//         sx={{
//           marginLeft: isSidebarCollapsed ? "80px" : "300px",
//           transition: "margin-left 0.3s ease",
//           width: isSidebarCollapsed ? "calc(100vw - 80px)" : "calc(100vw - 300px)",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: "16px",
//         }}
//       >
//         <Card
//           sx={{
//             p: 4,
//             boxShadow: 6,
//             borderRadius: 2,
//             width: "95%",
//             maxWidth: "800px",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               mb: 4,
//             }}
//           >
//             <Avatar
//               sx={{
//                 width: 100,
//                 height: 100,
//                 bgcolor: "primary.main",
//                 fontSize: "3rem",
//               }}
//             >
//               {userData.name.charAt(0).toUpperCase() || "U"}
//             </Avatar>
//             <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
//               {userData.name || "N/A"}
//             </Typography>
//           </Box>
//           <Grid container spacing={2}>
//             {[
//               { label: "Name", name: "name" },
//               { label: "Email", name: "email", disabled: true },
//               { label: "Contact Number", name: "contact" }, // Updated field name
//               {
//                 label: "State",
//                 name: "state",
//                 type: "dropdown",
//                 options: statesData.states || [],
//               },
//               {
//                 label: "City",
//                 name: "city",
//                 type: "dropdown",
//                 options: citiesData.cities || [],
//               },
//               { label: "Address", name: "address", multiline: true, rows: 3 },
//             ].map((field) => (
//               <Grid item xs={12} key={field.name}>
//                 <TextField
//                   label={field.label}
//                   name={field.name}
//                   value={userData[field.name]}
//                   onChange={handleInputChange}
//                   fullWidth
//                   multiline={field.multiline || false}
//                   rows={field.rows || 1}
//                   select={field.type === "dropdown"}
//                   InputProps={{
//                     readOnly: !editableFields[field.name],
//                     endAdornment: !field.disabled && (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => handleFieldEditToggle(field.name)}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 >
//                   {field.type === "dropdown" &&
//                     field.options.map((option, index) => (
//                       <MenuItem key={index} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                 </TextField>
//               </Grid>
//             ))}
//           </Grid>
//           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleCancel}
//               sx={{ mr: 2 }}
//             >
//               Cancel
//             </Button>
//             <Button variant="contained" color="primary" onClick={handleSave}>
//               Save
//             </Button>
//           </Box>
//         </Card>
//       </Box>
//     </Box>
//   );
// };

// ProfilePage.propTypes = {
//   isSidebarCollapsed: PropTypes.bool.isRequired,
// };

// export default ProfilePage;






// import PropTypes from "prop-types";
// import { useState, useEffect } from "react";
// import {
//   Avatar,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   TextField,
//   Typography,
//   IconButton,
//   MenuItem,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Cancel";
// import Sidebar from "../Sidebar";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";

// import statesData from "../../../assets/states.json"; // Import states.json
// import citiesData from "../../../assets/cities.json"; // Import cities.json

// const ProfilePage = ({ isSidebarCollapsed }) => {
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     contact: "",
//     state: "",
//     city: "",
//     address: "",
//   });

//   const [editableFields, setEditableFields] = useState({
//     name: false,
//     email: false,
//     contact: false,
//     address: false,
//   });

//   const [states] = useState(statesData.states);
//   const [filteredCities, setFilteredCities] = useState([]);

//   const auth = getAuth();
//   const db = getFirestore();

//   // Fetch Cities for the Selected State
//   useEffect(() => {
//     if (userData.state && citiesData[userData.state]) {
//       setFilteredCities(citiesData[userData.state]);
//     } else {
//       setFilteredCities([]);
//     }
//   }, [userData.state]);

//   // Fetch User Data from Firebase
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const userDocRef = doc(db, "users", currentUser.uid);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) {
//           setUserData({
//             name: userDoc.data().name || "",
//             email: userDoc.data().email || "",
//             contact: userDoc.data().contact || "",
//             state: userDoc.data().state || "",
//             city: userDoc.data().city || "",
//             address: userDoc.data().address || "",
//           });
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [auth, db]);

//   const handleInputChange = (e, field) => {
//     const value = e.target.value;

//     setUserData((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));

//     // Update Cities when State is Changed
//     if (field === "state") {
//       setFilteredCities(citiesData[value] || []);
//       setUserData((prevState) => ({
//         ...prevState,
//         city: "",
//       }));
//     }
//   };

//   const toggleEdit = (field) => {
//     setEditableFields((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh",
//         background: "linear-gradient(135deg, #ffffff, #e3f7fc)",
//       }}
//     >
//       {/* Sidebar Integration */}
//       <Sidebar onToggle={() => {}} />
//       <Box
//         sx={{
//           flexGrow: 1,
//           marginLeft: isSidebarCollapsed ? "80px" : "300px",
//           transition: "margin-left 0.3s ease",
//           padding: "32px",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Card
//           sx={{
//             width: "100%",
//             maxWidth: "1200px",
//             textAlign: "center",
//             borderRadius: "16px",
//             boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
//             padding: "32px",
//           }}
//         >
//           <CardContent>
//             <Avatar
//               sx={{
//                 width: 120,
//                 height: 120,
//                 background: "#5bc392",
//                 fontSize: "3rem",
//                 boxShadow: "0px 10px 20px rgba(91, 195, 146, 0.6)",
//                 mx: "auto",
//               }}
//             >
//               {userData.name.charAt(0).toUpperCase()}
//             </Avatar>
//             <Typography
//               variant="h5"
//               fontWeight="bold"
//               sx={{ mt: 2, color: "#2c3e50" }}
//             >
//               {userData.name}
//             </Typography>
//             <Typography
//               variant="subtitle1"
//               sx={{ color: "#34495e", fontSize: "0.9rem", mt: 1 }}
//             >
//               Manage your details efficiently 🌿
//             </Typography>
//           </CardContent>

//           <Grid container spacing={3} sx={{ mt: 2 }}>
//             {[
//               { label: "Name", name: "name", editable: true },
//               { label: "Email", name: "email", editable: true },
//               { label: "Contact Number", name: "contact", editable: true },
//               {
//                 label: "State",
//                 name: "state",
//                 editable: false,
//                 type: "dropdown",
//                 options: states,
//               },
//               {
//                 label: "City",
//                 name: "city",
//                 editable: false,
//                 type: "dropdown",
//                 options: filteredCities,
//               },
//               { label: "Address", name: "address", editable: true, multiline: true, rows: 3 },
//             ].map((field) => (
//               <Grid item xs={12} sm={6} key={field.name}>
//                 <TextField
//                   label={field.label}
//                   name={field.name}
//                   value={userData[field.name]}
//                   onChange={(e) => handleInputChange(e, field.name)}
//                   fullWidth
//                   multiline={field.multiline || false}
//                   rows={field.rows || 1}
//                   select={field.type === "dropdown"}
//                   InputProps={{
//                     readOnly: !editableFields[field.name] && field.editable,
//                     endAdornment:
//                       field.editable && field.type !== "dropdown" ? (
//                         <>
//                           {editableFields[field.name] ? (
//                             <>
//                               <IconButton
//                                 onClick={() => toggleEdit(field.name)}
//                                 color="primary"
//                                 size="small"
//                               >
//                                 <SaveIcon />
//                               </IconButton>
//                               <IconButton
//                                 onClick={() => toggleEdit(field.name)}
//                                 color="secondary"
//                                 size="small"
//                               >
//                                 <CancelIcon />
//                               </IconButton>
//                             </>
//                           ) : (
//                             <IconButton
//                               onClick={() => toggleEdit(field.name)}
//                               color="primary"
//                               size="small"
//                             >
//                               <EditIcon />
//                             </IconButton>
//                           )}
//                         </>
//                       ) : null,
//                   }}
//                   sx={{
//                     "& .MuiInputBase-root": {
//                       background: "#ffffff",
//                       borderRadius: "8px",
//                     },
//                   }}
//                 >
//                   {field.type === "dropdown" &&
//                     field.options.map((option, index) => (
//                       <MenuItem key={index} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                 </TextField>
//               </Grid>
//             ))}
//           </Grid>
//         </Card>
//       </Box>
//     </Box>
//   );
// };

// ProfilePage.propTypes = {
//   isSidebarCollapsed: PropTypes.bool.isRequired,
// };

// export default ProfilePage;




import PropTypes from "prop-types";

const ProfilePage = ({ isSidebarCollapsed }) => {
  return (
    <div>
      <h2>Profile Page</h2>
      <p>Sidebar is {isSidebarCollapsed ? "Collapsed" : "Expanded"}</p>
    </div>
  );
};

// ✅ Fix: Set `isSidebarCollapsed` as optional prop
ProfilePage.propTypes = {
  isSidebarCollapsed: PropTypes.bool,
};

export default ProfilePage;
