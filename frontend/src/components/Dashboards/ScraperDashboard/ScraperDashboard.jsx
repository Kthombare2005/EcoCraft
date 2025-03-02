import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import Sidebar from "./ScraperSidebar";
import { auth, db } from "../../../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { motion } from "framer-motion";
import "animate.css";
import PageLoader from "../../../components/PageLoader";
import { getDocs, setDoc, serverTimestamp } from "firebase/firestore";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" },
};

const ScraperDashboard = () => {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    totalScrapCollected: 0,
    scheduledPickups: 0,
    activeRequests: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [newPickup, setNewPickup] = useState(null); // New Pickup Notification
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true); // Page loading state

  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    setIsSidebarOpen(!isSmallScreen);
    setLoading(true); // Start loading animation
    setTimeout(() => setLoading(false), 800); // Simulate load delay
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
      const q = query(
        collection(db, "pickupRequests"),
        where("scraperId", "==", uid)
      );
      onSnapshot(q, async (snapshot) => {
        const requests = await Promise.all(
          snapshot.docs.map(async (document) => {
            const pickupData = { id: document.id, ...document.data() };
            let sellerName = "Unknown Seller";

            // Fetch seller details using `userId`
            if (pickupData.userId) {
              try {
                const sellerDocRef = doc(db, "users", pickupData.userId); // Corrected Firestore reference
                const sellerDoc = await getDoc(sellerDocRef);
                if (sellerDoc.exists()) {
                  sellerName = sellerDoc.data().name || "Unknown Seller";
                }
              } catch (error) {
                console.error("Error fetching seller details:", error);
              }
            }

            return {
              ...pickupData,
              sellerName,
            };
          })
        );

        setMetrics({
          totalScrapCollected: Math.floor(Math.random() * 1000), // Replace with Firestore data
          scheduledPickups: requests.length,
          activeRequests: requests.filter((req) => req.status === "Pending")
            .length,
        });

        setRecentActivity(
          requests.map((req) => ({
            message: `New pickup request from ${req.sellerName} for scrap: ${
              req.scrapName || "Unknown"
            }`,
            color: "blue",
            time: "Just now",
          }))
        );
      });
    } catch (error) {
      console.error("Error fetching scraper metrics:", error);
    }
  };

  const fetchRecentActivity = async (uid) => {
    try {
      const q = query(
        collection(db, "pickupRequests"),
        where("scraperId", "==", uid),
        where("status", "==", "Pending") // Only fetch pending requests
      );

      onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          console.log("No new pickup requests.");
          return;
        }

        const activities = await Promise.all(
          snapshot.docs.map(async (document) => {
            const pickupData = { id: document.id, ...document.data() };
            console.log("Pickup Data:", pickupData); // Debug log
            let sellerName = "Unknown Seller";

            // Fetch seller details using `userId`
            if (pickupData.userId) {
              try {
                const sellerDocRef = doc(db, "users", pickupData.userId);
                const sellerDoc = await getDoc(sellerDocRef);
                if (sellerDoc.exists()) {
                  sellerName = sellerDoc.data().name || "Unknown Seller";
                }
              } catch (error) {
                console.error("Error fetching seller details:", error);
              }
            }

            // Format the timestamp
            let formattedDate = 'Just now';
            if (pickupData.createdOn) {
              try {
                const timestamp = pickupData.createdOn.toDate();
                const now = new Date();
                const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
                const diffInHours = Math.floor(diffInMinutes / 60);
                const diffInDays = Math.floor(diffInHours / 24);

                if (diffInMinutes < 1) {
                  formattedDate = 'Just now';
                } else if (diffInMinutes < 60) {
                  formattedDate = `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
                } else if (diffInHours < 24) {
                  formattedDate = `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
                } else if (diffInDays < 7) {
                  formattedDate = `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
                } else {
                  formattedDate = new Intl.DateTimeFormat('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }).format(timestamp);
                }
              } catch (error) {
                console.error("Error formatting date:", error);
                formattedDate = 'Date not available';
              }
            }

            return {
              id: document.id,
              message: `New pickup request from ${sellerName} for scrap: ${
                pickupData.scrapName || "Unknown"
              }`,
              color: "blue",
              time: formattedDate
            };
          })
        );

        // 🔥 Fetch Seen Notifications from Firestore
        const seenRef = collection(db, "users", uid, "notifications");
        const seenSnapshot = await getDocs(seenRef);
        const seenRequests = seenSnapshot.docs.map((doc) => doc.id); // Extract IDs

        // 🔥 Filter Out Already Seen Requests
        const newNotifications = activities.filter(
          (req) => !seenRequests.includes(req.id)
        );

        if (newNotifications.length > 0) {
          console.log(
            "New Notification:",
            newNotifications[newNotifications.length - 1]
          );

          setNewPickup(newNotifications[newNotifications.length - 1]); // Show latest notification

          // 🔥 Mark Notifications as Seen in Firestore
          newNotifications.forEach(async (notif) => {
            await setDoc(doc(db, "users", uid, "notifications", notif.id), {
              seen: true,
              timestamp: serverTimestamp(),
            });
          });
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
    <>
      {loading && <PageLoader />}
      <Box
        className="animate__animated animate__fadeIn"
        sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
          <Typography
            variant="h4"
            className="animate__animated animate__fadeInDown"
            sx={{
              marginBottom: "24px",
              fontFamily: "Arvo, serif",
              color: "#004080",
            }}
          >
            Welcome, {user?.name || "Scraper"} to Scraper Dashboard
          </Typography>

          {/* Metrics Cards */}
          <Grid container spacing={3}>
            {[
              {
                label: "Total Scrap Collected",
                value: `${metrics.totalScrapCollected} kg`,
                icon: "♻️",
                color: "#66BB6A",
              },
              {
                label: "Scheduled Pickups",
                value: metrics.scheduledPickups,
                icon: "📅",
                color: "#29B6F6",
              },
              {
                label: "Active Requests",
                value: metrics.activeRequests,
                icon: "📋",
                color: "#8E24AA",
              },
            ].map((card, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <Card
                    className="animate__animated animate__zoomIn"
                    sx={{ borderRadius: "12px", backgroundColor: "white" }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ color: card.color, marginRight: "12px" }}
                        >
                          {card.icon}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "#004080" }}
                        >
                          {card.label}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{ color: "#004080", marginTop: "8px" }}
                      >
                        {card.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity */}
          <Box
            sx={{
              marginTop: "32px",
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", marginBottom: "8px", color: "#004080" }}
            >
              Recent Activity
            </Typography>
            {recentActivity.map((activity, index) => (
              <Box
                key={index}
                sx={{
                  padding: "12px 0",
                  borderBottom:
                    index !== recentActivity.length - 1
                      ? "1px solid #ddd"
                      : "none",
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transition: 'background-color 0.3s'
                  }
                }}
              >
                <Typography variant="body1" sx={{ marginBottom: '4px' }}>{activity.message}</Typography>
                <Typography variant="body2" sx={{ color: "gray", fontSize: '0.85rem' }}>
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Snackbar Notification */}
          <Snackbar
            open={!!newPickup}
            autoHideDuration={5000}
            onClose={() => setNewPickup(null)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }} // ✅ Set to Top-Right
          >
            <Alert severity="info" onClose={() => setNewPickup(null)}>
              {newPickup?.message || "New pickup request received!"}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};

export default ScraperDashboard;