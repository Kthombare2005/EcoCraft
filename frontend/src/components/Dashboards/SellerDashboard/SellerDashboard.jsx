import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import Sidebar from "../Sidebar";
import { auth, db, onAuthStateChanged } from "../../../firebaseConfig";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { setDoc } from "firebase/firestore"; // Import Firestore setDoc function
import { GoogleGenerativeAI } from "@google/generative-ai";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const genAI = new GoogleGenerativeAI("AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const SellerDashboard = () => {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState({
    totalEarnings: 0, // ₹
    scrapTransformed: 0, // items
    atmosphereSaved: 0, // kg
    activeListings: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [graphData, setGraphData] = useState({
    scrapSold: [],
    revenueGenerated: [],
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [scrapRates, setScrapRates] = useState([]);

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

  const fetchScrapRates = async () => {
    try {
      console.log("Fetching scrap rates from Gamini API...");
  
      const prompt = `Provide the latest scrap material rates specifically for Indore, Madhya Pradesh, India, covering materials such as iron, aluminum, copper, brass, plastic, paper, glass, electronic waste, rubber, and steel.
Ensure that the response is in strict JSON format with a key 'scrap_rates_india' containing a 'rates' object where each material is a key.
Each price value must strictly follow the format: '₹min - ₹max/kg' (without extra text, disclaimers, or descriptions).
Only include the latest market-based price range without additional explanations or introductions.".`;
  
      const result = await model.generateContent(prompt);
  
      let rawText = result.response.text().trim();
      console.log("Raw AI Response:", rawText);
  
      // 🔹 Remove unwanted formatting (backticks, markdown)
      rawText = rawText.replace(/```json|```/g, "").trim();
  
      // ✅ Parse JSON safely
      let parsedData;
      try {
        parsedData = JSON.parse(rawText);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        return;
      }
  
      if (!parsedData.scrap_rates_india || !parsedData.scrap_rates_india.rates) {
        console.error("Invalid JSON format received:", parsedData);
        return;
      }
  
      // ✅ Convert "rates" object into an array, properly extracting values
      let scrapRates = Object.entries(parsedData.scrap_rates_india.rates).map(([key, value]) => {
        let material = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
        let priceRange = value.match(/\d+/g); // Extract only numeric values
  
        let price = 0;
        if (priceRange && priceRange.length >= 2) {
          const min = Number(priceRange[0]);
          const max = Number(priceRange[1]);
          price = ((min + max) / 2).toFixed(2); // ✅ Compute average price
        } else if (priceRange && priceRange.length === 1) {
          price = Number(priceRange[0]).toFixed(2); // ✅ Use single value if no range
        }
  
        return { material, price };
      });
  
      console.log("Processed Scrap Rates:", scrapRates);
  
      // 🔹 Fetch existing data from Firestore to avoid redundant writes
      const ratesDocRef = doc(db, "scrapRates", "latest");
      const existingDoc = await getDoc(ratesDocRef);
  
      if (existingDoc.exists() && JSON.stringify(existingDoc.data().rates) === JSON.stringify(scrapRates)) {
        console.log("No changes in scrap rates, skipping Firestore update.");
        return;
      }
  
      // ✅ Store updated rates in Firestore with a timestamp
      await setDoc(ratesDocRef, { rates: scrapRates, lastUpdated: new Date().toISOString() });
  
      // ✅ Update state to reflect new rates
      setScrapRates(scrapRates);
      console.log("Updated Scrap Rates:", scrapRates);
    } catch (error) {
      console.error("Error fetching scrap rates:", error);
    }
  };

  useEffect(() => {
    // Call fetchScrapRates when the component loads
    fetchScrapRates();

    const ratesDocRef = doc(db, "scrapRates", "latest");

    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(ratesDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setScrapRates(docSnap.data().rates);
      } else {
        console.error("Scrap rates document not found in Firestore.");
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  // const extractScrapRates = (text) => {
  //   const scrapRates = [];
  //   const lines = text.split("\n");

  //   lines.forEach((line) => {
  //     const match = line.match(/\*\*(.*?)\*\*:\s*(₹?[\d-]+)/); // Extract material and price
  //     if (match) {
  //       let material = match[1].trim();
  //       let price = match[2].replace("₹", "").trim();

  //       // Convert price range to average
  //       if (price.includes("-")) {
  //         const [min, max] = price.split("-").map(Number);
  //         price = ((min + max) / 2).toFixed(2);
  //       } else {
  //         price = parseFloat(price).toFixed(2);
  //       }

  //       scrapRates.push({ material, price });
  //     }
  //   });

  //   return scrapRates;
  // };

  const fetchMetrics = (uid) => {
    const metricsDocRef = doc(db, "metrics", uid);
    onSnapshot(metricsDocRef, (doc) => {
      if (doc.exists()) {
        setMetrics(doc.data());
      } else {
        // Fallback to dummy data
        setMetrics({
          totalEarnings: 18250, // ₹
          scrapTransformed: 37, // items
          atmosphereSaved: 215, // kg
          activeListings: 12,
        });
      }
    });
  };

  const fetchTransactions = (uid) => {
    const transactionsQuery = query(
      collection(db, "transactions"),
      where("userId", "==", uid),
      where("status", "==", "completed")
    );

    onSnapshot(transactionsQuery, (snapshot) => {
      if (snapshot.empty) {
        // Fallback to dummy data
        setTransactions([
          { description: "Scrap Metal Sale", amount: 1200 },
          { description: "Plastic Recycling", amount: 800 },
        ]);
      } else {
        const transactionData = snapshot.docs.map((doc) => doc.data());
        setTransactions(transactionData);
      }
    });
  };

  const fetchTransformations = (uid) => {
    const transformationsQuery = query(
      collection(db, "transformations"),
      where("userId", "==", uid),
      where("status", "!=", "completed")
    );

    onSnapshot(transformationsQuery, (snapshot) => {
      if (snapshot.empty) {
        // Fallback to dummy data
        setTransformations([
          { description: "Metal Art Sculpture", status: "In Progress" },
          { description: "Wooden Furniture", status: "Pending" },
        ]);
      } else {
        const transformationData = snapshot.docs.map((doc) => doc.data());
        setTransformations(transformationData);
      }
    });
  };

  const fetchGraphData = (uid) => {
    const graphDocRef = doc(db, "graphs", uid);
    onSnapshot(graphDocRef, (doc) => {
      if (doc.exists()) {
        setGraphData(doc.data());
      } else {
        // Fallback to dummy data
        setGraphData({
          scrapSold: [50, 80, 120, 150, 200, 250],
          revenueGenerated: [1000, 1500, 2000, 3000, 4000, 5000],
        });
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        fetchUserData(uid);
        fetchMetrics(uid);
        fetchTransactions(uid);
        fetchTransformations(uid);
        fetchGraphData(uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Scrap Sold vs Revenue Generated",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
      },
    },
  };

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Scrap Sold (kg)",
        data: graphData.scrapSold,
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Revenue Generated (₹)",
        data: graphData.revenueGenerated,
        borderColor: "#66BB6A",
        backgroundColor: "rgba(102, 187, 106, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Dashboard Content */}
      <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>
        {/* Welcome Message */}
        <Typography
          variant="h4"
          sx={{
            marginBottom: "24px",
            fontFamily: "Arvo, serif",
            color: "#004080",
          }}
        >
          Welcome, {user?.name || "Seller"} to Seller Dashboard
        </Typography>

        {/* Top Row: State Cards */}
        <Grid container spacing={3}>
          {[
            {
              label: "Total Scrap Sold",
              value: `₹${metrics.totalEarnings}`,
              icon: "💰",
              color: "#66BB6A",
            },
            {
              label: "Items Transformed",
              value: metrics.scrapTransformed,
              icon: "♻️",
              color: "#29B6F6",
            },
            {
              label: "Active Listings",
              value: metrics.activeListings,
              icon: "📋",
              color: "#FFCA28",
            },
            {
              label: "Environmental Impact",
              value: `${metrics.atmosphereSaved} kg`,
              icon: "🌍",
              color: "#8E24AA",
            },
          ].map((card, index) => (
            <Grid item xs={12} sm={3} key={index}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    borderRadius: "12px",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.3)",
                    },
                  }}
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
                      <Typography variant="subtitle1" sx={{ color: "#004080" }}>
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

        {/* Middle Row: Recent Transactions & Ongoing Transformations */}
        <Grid container spacing={3} sx={{ marginTop: "24px" }}>
          <Grid item xs={12} md={6}>
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": { boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.3)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: "#004080", marginBottom: "16px" }}
                  >
                    Recent Transactions
                  </Typography>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography variant="body1">
                          {transaction.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#66BB6A", fontWeight: "bold" }}
                        >
                          +₹{transaction.amount}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography variant="body1">
                          Scrap Metal Sale
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#66BB6A", fontWeight: "bold" }}
                        >
                          +₹450
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography variant="body1">Paper Recycling</Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#66BB6A", fontWeight: "bold" }}
                        >
                          +₹280
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": { boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.3)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: "#004080", marginBottom: "16px" }}
                  >
                    Ongoing Transformations
                  </Typography>
                  {transformations.length > 0 ? (
                    transformations.map((transformation, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography variant="body1">
                          {transformation.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              transformation.status === "In Progress"
                                ? "#FFCA28"
                                : "#66BB6A",
                            fontWeight: "bold",
                          }}
                        >
                          {transformation.status}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography variant="body1">
                          Metal Art Sculpture
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#FFCA28", fontWeight: "bold" }}
                        >
                          In Progress
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography variant="body1">
                          Wooden Furniture
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#FFCA28", fontWeight: "bold" }}
                        >
                          Pending
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Bottom Row: Graph & Live Scrap Rates */}
        {/* Bottom Row: Graph & Live Scrap Rates */}
        <Grid container spacing={3} sx={{ marginTop: "24px" }}>
          {/* Graph Block */}
          <Grid item xs={12} md={8}>
            {" "}
            {/* Reduced width from 9 to 8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: 2,
                  height: "500px",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": { boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.3)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: "#004080", marginBottom: "16px" }}
                  >
                    Scrap Sold vs Revenue Generated
                  </Typography>
                  <Box sx={{ height: "400px", width: "100%" }}>
                    <Line
                      data={lineChartData}
                      options={{
                        ...lineChartOptions,
                        maintainAspectRatio: false,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Live Scrap Rates Table */}
          <Grid item xs={12} md={4}>
            {" "}
            {/* Increased width from 3 to 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: 2,
                  height: "500px",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": { boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.3)" },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: "#004080", marginBottom: "16px" }}
                  >
                    Live Scrap Rates (₹ per kg)
                  </Typography>
                  <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        textAlign: "left",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              borderBottom: "2px solid #ccc",
                              paddingBottom: "8px",
                            }}
                          >
                            Material
                          </th>
                          <th
                            style={{
                              borderBottom: "2px solid #ccc",
                              paddingBottom: "8px",
                            }}
                          >
                            Price (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {scrapRates && scrapRates.length > 0 ? (
                          scrapRates.map((item, index) => (
                            <tr
                              key={index}
                              style={{ borderBottom: "1px solid #eee" }}
                            >
                              <td style={{ padding: "8px" }}>
                                {item.material}
                              </td>
                              <td
                                style={{ padding: "8px", fontWeight: "bold" }}
                              >
                                ₹{Number(item.price).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="2"
                              style={{ padding: "8px", textAlign: "center" }}
                            >
                              Loading scrap rates...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SellerDashboard;
