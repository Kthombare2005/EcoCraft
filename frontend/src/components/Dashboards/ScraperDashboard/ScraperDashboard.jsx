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
  IconButton,
  Tooltip,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  useTheme,
  Divider,
} from "@mui/material";
import {
  LocalShipping,
  Assignment,
  Speed,
  AttachMoney,
  Star,
  CalendarMonth,
} from "@mui/icons-material";
import Sidebar from "./ScraperSidebar";
import { auth, db } from "../../../firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import "animate.css";
import PageLoader from "../../../components/PageLoader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
  ArcElement
);

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.02, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" },
};

const ScraperDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    totalScrapCollected: 0,
    scheduledPickups: 0,
    activeRequests: 0,
    completionRate: 0,
    totalEarnings: 0,
    averageRating: 0,
    monthlyStats: [],
    scrapTypeDistribution: {},
    upcomingPickups: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const formatFirestoreDate = (timestamp) => {
    if (!timestamp) return new Date();
    
    // Handle Firestore Timestamp
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    
    // Handle string timestamp
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    
    return new Date();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchMetrics(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMetrics = async (userId) => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      // Fetch pickup requests
      const pickupsQuery = query(
        collection(db, "pickupRequests"),
        where("scraperId", "==", userId)
      );
      const pickupsSnapshot = await getDocs(pickupsQuery);
      
      // Calculate metrics
      let totalEarnings = 0;
      let completedPickups = 0;
      let totalRating = 0;
      let ratingCount = 0;
      const scrapTypes = {};
      const monthlyData = Array(6).fill(0);
      const recentActivity = [];
      const upcomingPickups = [];

      pickupsSnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Handle price that might be "N/A"
        const price = data.price === "N/A" ? 0 : parseFloat(data.price) || 0;

        if (data.status === "Completed") {
          completedPickups++;
          totalEarnings += price;
          if (data.rating) {
            totalRating += data.rating;
            ratingCount++;
          }
          if (data.scrapName) {
            scrapTypes[data.scrapName] = (scrapTypes[data.scrapName] || 0) + 1;
          }
        }
        
        // Track monthly stats - using scheduledDateTime
        const scheduledDate = formatFirestoreDate(data.scheduledDateTime);
        const monthIndex = 5 - Math.floor((new Date() - scheduledDate) / (30 * 24 * 60 * 60 * 1000));
        if (monthIndex >= 0 && monthIndex < 6) {
          monthlyData[monthIndex] += price;
        }

        // Track upcoming pickups
        if (data.status === "Accepted" && data.scheduledDateTime) {
          if (scheduledDate > new Date()) {
            upcomingPickups.push({
              ...data,
              scheduledDate,
            });
          }
        }

        // Track recent activity
        const activityDate = formatFirestoreDate(data.updatedAt || data.createdOn);
        recentActivity.push({
          type: data.status,
          date: activityDate,
          details: `${data.scrapName || 'Unknown Scrap'} - ${data.status}`,
          amount: price,
          location: `${data.city}, ${data.state}`,
          sellerName: data.sellerName || 'Unknown Seller'
        });
      });

      setMetrics({
        totalScrapCollected: completedPickups,
        scheduledPickups: upcomingPickups.length,
        activeRequests: pickupsSnapshot.docs.filter(doc => doc.data().status === "Pending").length,
        completionRate: (completedPickups / Math.max(pickupsSnapshot.size, 1)) * 100,
        totalEarnings,
        averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
        monthlyStats: monthlyData,
        scrapTypeDistribution: scrapTypes,
        upcomingPickups: upcomingPickups.sort((a, b) => a.scheduledDate - b.scheduledDate).slice(0, 5),
        recentActivity: recentActivity.sort((a, b) => b.date - a.date).slice(0, 5),
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setNotification({
        open: true,
        message: "Error loading dashboard data",
        severity: "error",
      });
    }
  };

  const getMonthlyStatsChart = () => ({
    labels: Array(6).fill().map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return format(d, "MMM");
    }),
    datasets: [
      {
        label: "Monthly Earnings",
        data: metrics.monthlyStats,
        fill: true,
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        tension: 0.4,
      },
    ],
  });

  const getScrapTypeChart = () => ({
    labels: Object.keys(metrics.scrapTypeDistribution),
    datasets: [{
      data: Object.values(metrics.scrapTypeDistribution),
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
      ],
    }],
  });

  if (loading) return <PageLoader />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.displayName || "Scraper"}
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Grid>

          {/* Quick Stats Cards */}
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <AttachMoney color="primary" sx={{ fontSize: 40 }} />
                      <Box textAlign="right">
                        <Typography variant="h6">₹{metrics.totalEarnings.toLocaleString()}</Typography>
                        <Typography variant="body2" color="textSecondary">Total Earnings</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <LocalShipping color="secondary" sx={{ fontSize: 40 }} />
                      <Box textAlign="right">
                        <Typography variant="h6">{metrics.scheduledPickups}</Typography>
                        <Typography variant="body2" color="textSecondary">Scheduled Pickups</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Speed color="success" sx={{ fontSize: 40 }} />
                      <Box textAlign="right">
                        <Typography variant="h6">{metrics.completionRate.toFixed(1)}%</Typography>
                        <Typography variant="body2" color="textSecondary">Completion Rate</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={cardVariants} initial="initial" animate="animate" whileHover="hover">
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Star color="warning" sx={{ fontSize: 40 }} />
                      <Box textAlign="right">
                        <Typography variant="h6">
                          <Rating value={metrics.averageRating} readOnly precision={0.5} size="small" />
                        </Typography>
                        <Typography variant="body2" color="textSecondary">Average Rating</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Earnings Trend</Typography>
                  <Box sx={{ height: 300 }}>
                    <Line
                      data={getMonthlyStatsChart()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => `₹${value}`,
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Scrap Type Distribution</Typography>
                  <Box sx={{ height: 300 }}>
                    <Doughnut
                      data={getScrapTypeChart()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Activity Section */}
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Pickups
                  </Typography>
                  <List>
                    {metrics.upcomingPickups.map((pickup, index) => (
                      <ListItem key={index} divider={index !== metrics.upcomingPickups.length - 1}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            <CalendarMonth />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={pickup.scrapName}
                          secondary={format(pickup.scheduledDate, "PPp")}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={`₹${pickup.price || 0}`}
                            color="primary"
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <List>
                    {metrics.recentActivity.map((activity, index) => (
                      <ListItem key={index} divider={index !== metrics.recentActivity.length - 1}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                            <Assignment />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${activity.details} - ${activity.sellerName}`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="textSecondary">
                                {activity.date ? format(activity.date, "PPp") : "Date not available"}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2" color="textSecondary">
                                {activity.location || "Location not available"}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Chip
                              label={activity.type || "Unknown"}
                              color={
                                activity.type === "Completed"
                                  ? "success"
                                  : activity.type === "Accepted"
                                  ? "primary"
                                  : "default"
                              }
                              size="small"
                            />
                            {activity.amount > 0 && (
                              <Typography variant="body2" color="textSecondary">
                                ₹{activity.amount.toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScraperDashboard;