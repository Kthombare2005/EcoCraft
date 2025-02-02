// import { useState, useEffect } from "react";
// import { Box, Typography } from "@mui/material";
// import Sidebar from "../Sidebar"; // Ensure this is the correct path
// import { auth, onAuthStateChanged } from "../../../firebaseConfig"; // Import Firebase auth service
// import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

// const SellerDashboard = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [greeting, setGreeting] = useState("");
//   const [emoji, setEmoji] = useState("");
//   const [userName, setUserName] = useState(""); // To hold the logged-in user's name
//   const [loading, setLoading] = useState(true); // To handle loading state

//   useEffect(() => {
//     // Set the greeting based on the time of the day
//     const hours = new Date().getHours();
//     if (hours < 12) {
//       setGreeting("Good Morning");
//       setEmoji("☀️");
//     } else if (hours < 18) {
//       setGreeting("Good Afternoon");
//       setEmoji("🌤️");
//     } else {
//       setGreeting("Good Evening");
//       setEmoji("🌙");
//     }

//     // Check the authentication state and get the user's name from Firestore
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         // Get the user's document from Firestore
//         const db = getFirestore();
//         const userRef = doc(db, "users", user.uid); // Assuming the Firestore collection is 'users'
//         const userDoc = await getDoc(userRef);

//         if (userDoc.exists()) {
//           // Set the user's name from Firestore
//           const name = userDoc.data().name;
//           setUserName(name);
//         } else {
//           // If the document doesn't exist, fallback to email
//           setUserName(user.displayName || user.email);
//         }
//         setLoading(false); // Set loading to false once the user is fetched
//       } else {
//         setUserName("Guest");
//         setLoading(false); // Set loading to false even if no user is logged in
//       }
//     });

//     return () => {
//       unsubscribe(); // Clean up the listener on component unmount
//     };
//   }, []);

//   const handleSidebarToggle = (collapsed) => {
//     setIsCollapsed(collapsed);
//   };

//   // If user data is still loading, show a loading message
//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
//         <Typography variant="h4">Loading...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: "flex", height: "100vh" }}>
//       <Sidebar onToggle={handleSidebarToggle} />
//       <Box
//         sx={{
//           flexGrow: 1,
//           marginLeft: isCollapsed ? "80px" : "300px",
//           transition: "margin-left 0.5s ease-in-out",
//           padding: "20px",
//           backgroundColor: "white",
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             color: "#1976D2",
//             marginBottom: "10px",
//             fontFamily: "'Arvo', serif, 'Playfair Display', serif, 'Playwrite VN', sans-serif", // Apply the custom fonts here
//           }}
//         >
//           {greeting}, {userName}! {emoji}
//         </Typography>
//         <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", marginTop: "20px", color: "#333" }}>
//   &quot;Sell your scrap, transform it into valuable products, and contribute to a more sustainable world!&quot;
  
// </Typography>



//       </Box>
//     </Box>
//   );
// };

// export default SellerDashboard;





import  { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, useMediaQuery } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../Sidebar"; // ✅ Import Sidebar component
import { auth, db, onAuthStateChanged } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SellerDashboard = () => {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    users: 0,
    sales: 0,
    revenue: 0,
  });

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Responsive breakpoint for auto-collapse
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  // Collapse sidebar on small screens
  useEffect(() => {
    setIsSidebarOpen(!isSmallScreen);
  }, [isSmallScreen]);

  // Fetch user data and metrics
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid)); // Replace 'users' with your Firestore collection name
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }

      // Fetch metrics (dummy data for now)
      setMetrics({
        users: 199,
        sales: 475,
        revenue: 5427,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Chart data
  const salesData = {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Sales",
        data: [10, 20, 30],
        backgroundColor: "#42A5F5",
      },
    ],
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Revenue",
        data: [500, 700, 900],
        borderColor: "#66BB6A",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Dashboard Content */}
      <Box sx={{ flexGrow: 1, padding: "16px", overflowY: "auto" }}>
        {/* Welcome Message */}
        <Typography
          variant="h4"
          sx={{ marginBottom: "16px", fontFamily: "Arvo, serif", color: "#004080" }}
        >
          Welcome, {user?.name || "Seller"} to Seller Dashboard
        </Typography>

        {/* Metrics Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#E3F2FD", borderRadius: "12px" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#004080", fontFamily: "Roboto Slab, serif" }}>
                  USERS
                </Typography>
                <Typography variant="h4" sx={{ color: "#004080" }}>
                  {metrics.users}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#E3F2FD", borderRadius: "12px" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#004080", fontFamily: "Roboto Slab, serif" }}>
                  SALES
                </Typography>
                <Typography variant="h4" sx={{ color: "#004080" }}>
                  {metrics.sales}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#E3F2FD", borderRadius: "12px" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#004080", fontFamily: "Roboto Slab, serif" }}>
                  REVENUE
                </Typography>
                <Typography variant="h4" sx={{ color: "#004080" }}>
                  ${metrics.revenue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ marginTop: "24px" }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "12px" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#004080", fontFamily: "Roboto Slab, serif" }}>
                  Sales Performance
                </Typography>
                <Bar data={salesData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: "12px" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#004080", fontFamily: "Roboto Slab, serif" }}>
                  Revenue Growth
                </Typography>
                <Line data={revenueData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SellerDashboard;
