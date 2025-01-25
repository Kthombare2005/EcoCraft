
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



import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../Sidebar'; // Adjust the path if necessary

const SellerDashboard = () => {
  const [greeting, setGreeting] = useState("");

  // Update greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#DCEBF5', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          overflow: 'auto',
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          {greeting}, Seller!
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Welcome to your dashboard, where you can manage all your activities.
        </Typography>

        {/* Add additional sections, widgets, or content here */}
      </Box>
    </Box>
  );
};

export default SellerDashboard;
