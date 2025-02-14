import { Box, CircularProgress } from "@mui/material";

const PageLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 9999,
      }}
    >
      <CircularProgress size={80} sx={{ color: "#004080" }} />
    </Box>
  );
};

export default PageLoader;
