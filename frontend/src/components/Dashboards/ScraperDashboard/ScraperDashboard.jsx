// import { useEffect, useState } from "react";
// import { Grid, Card, CardContent, Typography, Box, useMediaQuery } from "@mui/material";
// import Sidebar from "./ScraperSidebar";
// import { auth, db, onAuthStateChanged } from "../../../firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import { motion } from "framer-motion";
// import "animate.css";

// const cardVariants = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
// };

// const activityCardVariants = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   hover: { scale: 1.02, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" },
// };

// const ScraperDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [metrics, setMetrics] = useState({
//     totalScrapCollected: 0,
//     scheduledPickups: 0,
//     activeRequests: 0,
//   });

//   const [recentActivity, setRecentActivity] = useState([]);

//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const isSmallScreen = useMediaQuery("(max-width: 600px)");

//   useEffect(() => {
//     setIsSidebarOpen(!isSmallScreen);
//   }, [isSmallScreen]);

//   const fetchUserData = async (uid) => {
//     try {
//       const userDoc = await getDoc(doc(db, "users", uid));
//       if (userDoc.exists()) {
//         setUser(userDoc.data());
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const fetchScraperMetrics = () => {
//     setMetrics({
//       totalScrapCollected: Math.floor(Math.random() * 1000), // Replace with Firestore data
//       scheduledPickups: Math.floor(Math.random() * 10),
//       activeRequests: Math.floor(Math.random() * 5),
//     });
//   };

//   const fetchRecentActivity = () => {
//     setRecentActivity([
//       { message: "Pickup scheduled for tomorrow at 10:30 AM", color: "green", time: "1h ago" },
//       { message: "Scrap weighing 120kg collected from Zone 3", color: "blue", time: "3h ago" },
//       { message: "Pickup completed at Rajwada Street", color: "orange", time: "6h ago" },
//       { message: "Assigned to new pickup request", color: "purple", time: "12h ago" },
//       { message: "Reached the pickup location at Bhanwar Kuan", color: "red", time: "1d ago" },
//     ]);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         fetchUserData(currentUser.uid);
//         fetchScraperMetrics();
//         fetchRecentActivity();
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <Box className="animate__animated animate__fadeIn" sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
//       <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

//       <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
//         <Typography
//           variant="h4"
//           className="animate__animated animate__fadeInDown"
//           sx={{ marginBottom: "24px", fontFamily: "Arvo, serif", color: "#004080", display: "flex", justifyContent: "space-between", alignItems: "center" }}
//         >
//           Welcome, {user?.name || "Scraper"} to Scraper Dashboard
//         </Typography>

//         {/* Top Row: Metrics Cards */}
//         <Grid container spacing={3}>
//           {[
//             { label: "Total Scrap Collected", value: `${metrics.totalScrapCollected} kg`, icon: "♻️", color: "#66BB6A" },
//             { label: "Scheduled Pickups", value: metrics.scheduledPickups, icon: "📅", color: "#29B6F6" },
//             { label: "Active Requests", value: metrics.activeRequests, icon: "📋", color: "#8E24AA" },
//           ].map((card, index) => (
//             <Grid item xs={12} sm={4} key={index}>
//               <motion.div variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
//                 <Card className="animate__animated animate__zoomIn" sx={{ borderRadius: "12px", backgroundColor: "white" }}>
//                   <CardContent>
//                     <Box sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
//                       <Typography variant="subtitle1" sx={{ color: card.color, marginRight: "12px" }}>
//                         {card.icon}
//                       </Typography>
//                       <Typography variant="subtitle1" sx={{ color: "#004080" }}>
//                         {card.label}
//                       </Typography>
//                     </Box>
//                     <Typography variant="h4" sx={{ color: "#004080", marginTop: "8px" }}>
//                       {card.value}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Recent Activity Section */}
//         <Box sx={{ marginTop: "32px" }}>
//           <motion.div
//             variants={activityCardVariants}
//             initial="initial"
//             animate="animate"
//             whileHover="hover"
//             className="animate__animated animate__fadeInUp"
//             sx={{
//               backgroundColor: "white",
//               borderRadius: "12px",
//               padding: "16px",
//               boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px", color: "#004080" }}>
//               Recent Activity
//             </Typography>
//             {recentActivity.map((activity, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   padding: "8px 0",
//                   borderBottom: index !== recentActivity.length - 1 ? "1px solid #ddd" : "none",
//                   transition: "background-color 0.3s ease",
//                   "&:hover": { backgroundColor: "#f0f0f0" },
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center" }}>
//                   <span style={{ color: activity.color, fontSize: "20px", marginRight: "10px" }}>•</span>
//                   <Typography variant="body1">{activity.message}</Typography>
//                 </Box>
//                 <Typography variant="body2" sx={{ color: "gray" }}>
//                   {activity.time}
//                 </Typography>
//               </Box>
//             ))}
//           </motion.div>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ScraperDashboard;





import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, Snackbar, Alert, useMediaQuery } from "@mui/material";
import Sidebar from "./ScraperSidebar";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import "animate.css";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
};

const ScraperDashboard = () => {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({ totalScrapCollected: 0, scheduledPickups: 0, activeRequests: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [newPickup, setNewPickup] = useState(null); // New Pickup Notification
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    setIsSidebarOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchScraperMetrics = async (uid) => {
    try {
      const q = query(collection(db, "pickupRequests"), where("scraperId", "==", uid));
      onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMetrics({
          totalScrapCollected: Math.floor(Math.random() * 1000), // Replace with Firestore data
          scheduledPickups: requests.length,
          activeRequests: requests.filter((req) => req.status === "Pending").length,
        });
      });
    } catch (error) {
      console.error("Error fetching scraper metrics:", error);
    }
  };

  const fetchRecentActivity = async (uid) => {
    try {
      const q = query(collection(db, "pickupRequests"), where("scraperId", "==", uid));
      onSnapshot(q, (snapshot) => {
        const activities = snapshot.docs.map((doc) => ({
          id: doc.id,
          message: `New pickup request for Scrap ID: ${doc.data().scrapId}`,
          color: "blue",
          time: "Just now",
        }));

        if (activities.length > 0) {
          setNewPickup(activities[activities.length - 1]); // Show notification
        }

        setRecentActivity(activities);
      });
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
        fetchScraperMetrics(currentUser.uid);
        fetchRecentActivity(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box className="animate__animated animate__fadeIn" sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
        <Typography
          variant="h4"
          className="animate__animated animate__fadeInDown"
          sx={{ marginBottom: "24px", fontFamily: "Arvo, serif", color: "#004080" }}
        >
          Welcome, {user?.name || "Scraper"} to Scraper Dashboard
        </Typography>

        {/* Metrics Cards */}
        <Grid container spacing={3}>
          {[
            { label: "Total Scrap Collected", value: `${metrics.totalScrapCollected} kg`, icon: "♻️", color: "#66BB6A" },
            { label: "Scheduled Pickups", value: metrics.scheduledPickups, icon: "📅", color: "#29B6F6" },
            { label: "Active Requests", value: metrics.activeRequests, icon: "📋", color: "#8E24AA" },
          ].map((card, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <motion.div variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
                <Card className="animate__animated animate__zoomIn" sx={{ borderRadius: "12px", backgroundColor: "white" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                      <Typography variant="subtitle1" sx={{ color: card.color, marginRight: "12px" }}>
                        {card.icon}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: "#004080" }}>
                        {card.label}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ color: "#004080", marginTop: "8px" }}>
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Box sx={{ marginTop: "32px", backgroundColor: "white", borderRadius: "12px", padding: "16px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "8px", color: "#004080" }}>
            Recent Activity
          </Typography>
          {recentActivity.map((activity, index) => (
            <Box key={index} sx={{ padding: "8px 0", borderBottom: index !== recentActivity.length - 1 ? "1px solid #ddd" : "none" }}>
              <Typography variant="body1">{activity.message}</Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                {activity.time}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Snackbar Notification */}
        <Snackbar open={!!newPickup} autoHideDuration={5000} onClose={() => setNewPickup(null)}>
          <Alert severity="info">{newPickup?.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ScraperDashboard;
