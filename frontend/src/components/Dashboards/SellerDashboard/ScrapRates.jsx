import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { fetchScrapRatesWithGamini } from "../../../utils/gaminiUtils";

const GAMINI_API_KEY = "AIzaSyCLYSE-DC6RTRS8Pa58NX_Zz2q-5wZdbpw";
const GAMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GAMINI_API_KEY}`;

const ScrapRates = () => {
  const [scrapRates, setScrapRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const rates = await fetchScrapRatesWithGamini();
      setScrapRates(rates);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError("Failed to fetch scrap rates. Please try again later.");
      console.error("Error fetching scrap rates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case "up":
        return <TrendingUpIcon sx={{ color: "success.main" }} />;
      case "down":
        return <TrendingDownIcon sx={{ color: "error.main" }} />;
      default:
        return <TrendingFlatIcon sx={{ color: "info.main" }} />;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#004080",
            fontFamily: "'Arvo', serif",
          }}
        >
          Current Scrap Rates - Indore Market
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {lastUpdated && (
            <Typography variant="body2" color="text.secondary">
              Last updated: {lastUpdated}
            </Typography>
          )}
          <Tooltip title="Refresh Rates">
            <IconButton onClick={fetchRates} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Subcategory</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rate (₹)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Trend</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scrapRates.map((rate, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <TableCell>{rate.category}</TableCell>
                <TableCell>{rate.subcategory}</TableCell>
                <TableCell>₹{rate.rate}</TableCell>
                <TableCell>{rate.unit}</TableCell>
                <TableCell>
                  <Tooltip title={rate.trend}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {getTrendIcon(rate.trend)}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>{rate.last_updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScrapRates; 