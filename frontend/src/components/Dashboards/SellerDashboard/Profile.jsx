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






import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Avatar,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Autocomplete,
} from "@mui/material";
import { motion } from "framer-motion";
import Sidebar from "../Sidebar";
import statesData from "../../../assets/states.json";
import citiesData from "../../../assets/cities.json";

const ProfilePage = ({ isSidebarCollapsed }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    contact: "",
    state: "",
    city: "",
    address: "",
  });

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const fetchedData = {
            name: docSnap.data().name || "",
            email: docSnap.data().email || currentUser.email,
            contact: docSnap.data().contact || "",
            state: docSnap.data().state || "",
            city: docSnap.data().city || "",
            address: docSnap.data().address || "",
          };
          setUserData(fetchedData);
        }
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleInputChange = (e, value, field) => {
    setUserData((prevState) => ({ ...prevState, [field]: value || "" }));
  };

  const handleSave = async () => {
    if (user) {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { ...userData });
    }
  };

  const handleCancel = () => {
    const userDoc = doc(db, "users", user.uid);
    getDoc(userDoc).then((docSnap) => {
      if (docSnap.exists()) {
        const fetchedData = {
          name: docSnap.data().name || "",
          email: docSnap.data().email || user.email,
          contact: docSnap.data().contact || "",
          state: docSnap.data().state || "",
          city: docSnap.data().city || "",
          address: docSnap.data().address || "",
        };
        setUserData(fetchedData);
      }
    });
  };

  const sortedStates = statesData.states.sort();
  const sortedCities = citiesData.cities.sort();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #ffffff, #e3f7fc)",
        overflow: "hidden",
        flexDirection: "column",
      }}
    >
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          marginLeft: isSidebarCollapsed ? "80px" : "300px",
          width: isSidebarCollapsed
            ? "calc(100vw - 80px)"
            : "calc(100vw - 300px)",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component={motion.div}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          sx={{
            textAlign: "center",
            mb: 3,
            width: "100%",
            maxWidth: "800px",
            px: { xs: 2, sm: 4 },
          }}
        >
          <Avatar
            sx={{
              width: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 },
              fontSize: { xs: "2.5rem", sm: "3rem" },
              background: "#5bc392",
              mx: "auto",
              boxShadow:
                "0px 10px 20px rgba(91, 195, 146, 0.6), 0px 20px 30px rgba(91, 195, 146, 0.4)",
            }}
          >
            {userData.name.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              mt: 2,
              color: "#2c3e50",
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "1.8rem", sm: "2rem" },
            }}
          >
            {userData.name || "Your Profile"}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#34495e",
              fontFamily: "'Roboto', sans-serif",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Manage your details efficiently 🌿
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            background: "#ffffff",
            padding: "16px",
            borderRadius: "16px",
            boxShadow:
              "0px 10px 20px rgba(0, 0, 0, 0.15), 0px 20px 30px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Grid container spacing={2}>
            {[
              { label: "Name", name: "name", disabled: true },
              { label: "Email", name: "email", disabled: true },
              { label: "Contact Number", name: "contact" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  label={field.label}
                  name={field.name}
                  value={userData[field.name]}
                  fullWidth
                  InputProps={{
                    readOnly: field.disabled,
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      background: "#e8f9eb",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={sortedStates}
                value={userData.state}
                onChange={(event, value) =>
                  handleInputChange(event, value, "state")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        background: "#e8f9eb",
                        borderRadius: "8px",
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={sortedCities}
                value={userData.city}
                onChange={(event, value) =>
                  handleInputChange(event, value, "city")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        background: "#e8f9eb",
                        borderRadius: "8px",
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={userData.address}
                onChange={(e) => handleInputChange(e, e.target.value, "address")}
                fullWidth
                multiline
                rows={2}
                sx={{
                  "& .MuiInputBase-root": {
                    background: "#e8f9eb",
                    borderRadius: "8px",
                  },
                }}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "space-between" },
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{
                px: 4,
                borderRadius: "20px",
                color: "#5bc392",
                borderColor: "#5bc392",
                "&:hover": {
                  background: "#e8f9eb",
                },
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
                mr: { xs: 0, sm: 2 },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                px: 4,
                borderRadius: "20px",
                background: "#5bc392",
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
                "&:hover": {
                  background: "#48a978",
                },
                ml: { xs: 0, sm: 2 },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

ProfilePage.propTypes = {
  isSidebarCollapsed: PropTypes.bool.isRequired,
};

export default ProfilePage;





