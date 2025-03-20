import { GoogleGenerativeAI } from "@google/generative-ai";
import { log } from "./log";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw");

/**
 * Fetch nearby scrapers within a 4-5 km radius using Gemini API.
 * @param {string} city - The city of the user.
 * @param {string} state - The state of the user.
 * @returns {Promise<Array>} - Returns an array of nearby scrapers.
 */
export const fetchNearbyScrapersWithGamini = async (city, state) => {
  if (!city || !state) {
    console.error("City and state are required to fetch nearby scrapers.");
    return [];
  }

  const prompt = `
  You are an expert in geospatial analysis and a local marketplace advisor. Your task is to identify the **5 nearest scrap dealers** located within a **4-5 km radius** of the following location: **${city}, ${state}, India**.

  ### Requirements:
  1. Focus only on scrap dealers **within 4-5 km** of the specified location.
  2. Ensure consistency: The result for repeated queries with the same location should not change.
  3. Provide results in **structured JSON format** with the following fields:
     - **name**: Name of the scrap dealer.
     - **shop_address**: Complete address of the shop (including city, state, and postal code).
     - **contact_number**: Phone number of the scrap dealer (if available).

  ### Additional Instructions:
  - If no scrap dealers are found within the radius, return an **empty array** in JSON format.
  - Respond only with the **JSON output**, and do not include any additional text or comments.

  ### Example JSON Output:
  [
    {
      "name": "Goyal Scrap Dealer",
      "shop_address": "56, Saket Nagar, Indore, Madhya Pradesh 452018, India",
      "contact_number": "+91 94256 67890"
    },
    {
      "name": "Jain Scrap Mart",
      "shop_address": "101, New Palasia, Opposite Nehru Park, Indore, Madhya Pradesh 452001, India",
      "contact_number": "+91 99266 54321"
    }
  ]
  `;

  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    log("Raw Gemini Response:", text);

    // Remove any triple backticks from the response
    const sanitizedText = text.replace(/```json|```/g, "").trim();
    log("Sanitized JSON Response:", sanitizedText);

    // Parse the sanitized JSON text
    let scrapersList = [];
    try {
      scrapersList = JSON.parse(sanitizedText);
      if (!Array.isArray(scrapersList)) {
        console.error("Parsed data is not an array:", scrapersList);
        return [];
      }
    } catch (jsonError) {
      console.error("Error parsing Gemini JSON response:", jsonError);
      return [];
    }

    log("Final Nearby Scrapers List:", scrapersList);
    return scrapersList;
  } catch (error) {
    console.error("Error fetching nearby scrapers from Gemini API:", error);
    return [];
  }
};