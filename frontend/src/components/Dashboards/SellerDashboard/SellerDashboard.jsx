
// import { Box } from '@mui/material'; // Add this import
// import Sidebar from '../Sidebar';  // Adjust the path if necessary

// const SellerDashboard = () => {
//   return (
//     <Box sx={{ display: 'flex', backgroundColor: '#DCEBF5' }}>
//       <Sidebar />
//       {/* Add your dashboard content here */}
//     </Box>
//   );
// };

// export default SellerDashboard;



import { useState} from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../Sidebar"; // Ensure this is the correct path

const SellerDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar onToggle={handleSidebarToggle} />
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: isCollapsed ? "80px" : "300px",
          transition: "margin-left 0.5s ease-in-out",
          padding: "20px",
          backgroundColor: "#DCEBF5",
        }}
      >
        <Typography variant="h4" sx={{ color: "#1976D2", marginBottom: "10px", width: "100vw" }}>
          Good Evening, Seller!
        </Typography>
        <Typography variant="body1" sx={{ color: "#333" }}>
          Welcome to your dashboard, where you can manage all your activities.
        </Typography>
      </Box>
    </Box>
  );
};

export default SellerDashboard;
