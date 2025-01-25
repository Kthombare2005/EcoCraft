import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../Sidebar"; // Ensure this is the correct path
import { auth, onAuthStateChanged } from "../../../firebaseConfig"; // Import Firebase auth service
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

const SellerDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");
  const [userName, setUserName] = useState(""); // To hold the logged-in user's name
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    // Set the greeting based on the time of the day
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
      setEmoji("☀️");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
      setEmoji("🌤️");
    } else {
      setGreeting("Good Evening");
      setEmoji("🌙");
    }

    // Check the authentication state and get the user's name from Firestore
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the user's document from Firestore
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid); // Assuming the Firestore collection is 'users'
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Set the user's name from Firestore
          const name = userDoc.data().name;
          setUserName(name);
        } else {
          // If the document doesn't exist, fallback to email
          setUserName(user.displayName || user.email);
        }
        setLoading(false); // Set loading to false once the user is fetched
      } else {
        setUserName("Guest");
        setLoading(false); // Set loading to false even if no user is logged in
      }
    });

    return () => {
      unsubscribe(); // Clean up the listener on component unmount
    };
  }, []);

  const handleSidebarToggle = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  // If user data is still loading, show a loading message
  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar onToggle={handleSidebarToggle} />
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: isCollapsed ? "80px" : "300px",
          transition: "margin-left 0.5s ease-in-out",
          padding: "20px",
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#1976D2",
            marginBottom: "10px",
            fontFamily: "'Arvo', serif, 'Playfair Display', serif, 'Playwrite VN', sans-serif", // Apply the custom fonts here
          }}
        >
          {greeting}, {userName}! {emoji}
        </Typography>
        <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", marginTop: "20px", color: "#333" }}>
  &quot;Sell your scrap, transform it into valuable products, and contribute to a more sustainable world!&quot;
</Typography>



      </Box>
    </Box>
  );
};

export default SellerDashboard;
