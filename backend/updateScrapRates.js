import axios from "axios";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBoZx71R_X5uVmwC80yAmFBVonc34s2rSM",
    authDomain: "ecocraft-45bd5.firebaseapp.com",
    projectId: "ecocraft-45bd5",
    storageBucket: "ecocraft-45bd5.firebasestorage.app",
    messagingSenderId: "526603846840",
    appId: "1:526603846840:web:6418ffc7013749d8cae04d",
    measurementId: "G-XW3ZRWDWMW",
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Gamini API Configuration
const GAMINI_API_URL = "https://api.gemini.ai/v2/scrap-rates";  // Example API (Change to real one)
const GAMINI_API_KEY = "AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw";

const updateScrapRates = async () => {
  try {
    const response = await axios.post(
      GAMINI_API_URL,
      {
        prompt: "Provide the latest scrap material rates in India.",
      },
      {
        headers: {
          "Authorization": `Bearer ${GAMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const scrapRates = response.data.rates || [];

    // Update Firestore
    await setDoc(doc(db, "scrapRates", "latest"), { rates: scrapRates });

    console.log("Scrap rates updated successfully:", scrapRates);
  } catch (error) {
    console.error("Error updating scrap rates:", error);
  }
};

// Run the function daily
updateScrapRates();
