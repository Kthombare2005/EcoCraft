import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Sidebar from "../Sidebar";
import { db } from "../../../firebaseConfig";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const ScrapManagement = () => {
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    dateRange: "",
  });
  const [scrapListings, setScrapListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const fetchScrapListings = () => {
    const scrapQuery = query(collection(db, "scrapListings"));
    onSnapshot(scrapQuery, (snapshot) => {
      const listings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setScrapListings(listings);
    });
  };

  const fetchTransactions = () => {
    const transactionsQuery = query(collection(db, "transactions"));
    onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsData);
    });
  };

  const handleAddNewScrap = async () => {
    try {
      await addDoc(collection(db, "scrapListings"), {
        type: "New Scrap",
        status: "Pending",
        listedOn: new Date().toLocaleDateString(),
        weight: "0 kg",
        category: "Misc",
        location: "Unknown",
        price: "₹0",
      });
    } catch (error) {
      console.error("Error adding new scrap:", error);
    }
  };

  useEffect(() => {
    fetchScrapListings();
    fetchTransactions();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: "24px", overflowY: "auto", backgroundColor: "#f8f9fa" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Scrap Management
        </Typography>

        {/* Filters */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              variant="outlined"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              variant="outlined"
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Metal">Metal</MenuItem>
              <MenuItem value="Paper">Paper</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date Range"
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* Scrap Listings */}
        <Grid container spacing={3} className="mb-6">
          {scrapListings.map((listing) => (
            <Grid item xs={12} sm={6} key={listing.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                      {listing.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Listed on: {listing.listedOn}
                    </Typography>
                    <Typography variant="body2">Weight: {listing.weight}</Typography>
                    <Typography variant="body2">Category: {listing.category}</Typography>
                    <Typography variant="body2">Location: {listing.location}</Typography>
                    <Typography variant="h6" color="primary">
                      {listing.price}
                    </Typography>
                    <Button size="small" variant="outlined" color="primary" sx={{ mt: 1 }}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}

          {/* Add New Scrap Card */}
          <Grid item xs={12} sm={6} className="flex justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={handleAddNewScrap}
            >
              <Card
                sx={{
                  backgroundColor: "#e3f2fd",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent className="text-center">
                  <AddCircleIcon color="primary" fontSize="large" />
                  <Typography variant="h6">List New Scrap</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Click to add a new scrap listing
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent Transactions */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Recent Transactions
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transition: "background-color 0.3s ease",
                    },
                  }}
                >
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.item}</TableCell>
                  <TableCell>{transaction.buyer}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ScrapManagement;
