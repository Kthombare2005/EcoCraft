import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import ScraperSidebar from "./Sidebar"; 
import { auth, db, onAuthStateChanged } from "../../../firebaseConfig";
import { onSnapshot, doc } from "firebase/firestore"; // ✅ Removed unused `getDoc`
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ScraperDashboard = () => {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    totalWasteCollected: 0,
    completedPickups: 0,
    activePickups: 0,
    co2Saved: 0,
    totalEarnings: 0,
  });
  const [graphData, setGraphData] = useState({ wasteCollected: [], earningsGenerated: [] });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMetrics(currentUser.uid);
        fetchGraphData(currentUser.uid);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMetrics = (uid) => {
    const metricsDocRef = doc(db, "scraperMetrics", uid);
    onSnapshot(metricsDocRef, (doc) => {
      if (doc.exists()) {
        setMetrics(doc.data());
      }
    });
  };

  const fetchGraphData = (uid) => {
    const graphDocRef = doc(db, "scraperGraphs", uid);
    onSnapshot(graphDocRef, (doc) => {
      if (doc.exists()) {
        setGraphData(doc.data());
      }
    });
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Waste Collected (kg)",
        data: graphData.wasteCollected,
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Earnings Generated (₹)",
        data: graphData.earningsGenerated,
        borderColor: "#66BB6A",
        backgroundColor: "rgba(102, 187, 106, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <ScraperSidebar />
      <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
        <Typography variant="h4" sx={{ marginBottom: "24px", fontFamily: "Arvo, serif", color: "#004080" }}>
          Welcome, {user?.name || "Scraper"} to Scraper Dashboard
        </Typography>

        {/* Overview Metrics */}
        <Grid container spacing={3}>
          {[
            { label: "Total Waste Collected", value: `${metrics.totalWasteCollected} kg`, icon: "♻️", color: "#66BB6A" },
            { label: "Total Pickups Completed", value: metrics.completedPickups, icon: "🚛", color: "#FFA726" },
            { label: "Active Pickup Requests", value: metrics.activePickups, icon: "📋", color: "#29B6F6" },
            { label: "Environmental Impact", value: `${metrics.co2Saved} kg CO₂`, icon: "🌍", color: "#8E24AA" },
          ].map((card, index) => (
            <Grid item xs={12} sm={3} key={index}>
              <Card>
                <CardContent>
                  <Typography>{card.label}</Typography>
                  <Typography>{card.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Graph */}
        <Grid container spacing={3} sx={{ marginTop: "24px" }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">Waste Collected vs Earnings</Typography>
                <Box sx={{ height: "300px" }}>
                  <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ScraperDashboard;
