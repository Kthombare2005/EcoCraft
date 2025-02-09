// const GAMINI_API_KEY = "AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw";
// const GAMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

// export const rankScrapersWithGamini = async (scrapers, city, state) => {
//   const dynamicPrompt = `
//     Rank the following scrap dealers based on their proximity and relevance to the location: ${city}, ${state}.
//     Scrap dealers:
//     ${scrapers
//       .map(
//         (scraper, index) =>
//           `${index + 1}. ${scraper.name} - Address: ${scraper.shop_address}`
//       )
//       .join("\n")}
//     Return the ranked list in the same order as provided, with the most relevant first.`;

//   try {
//     const response = await fetch(`${GAMINI_API_URL}${GAMINI_API_KEY}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         prompt: dynamicPrompt,
//         maxTokens: 500,
//       }),
//     });

//     const result = await response.json();
//     console.log("Gamini Response:", result);

//     // Extract ranked list from Gamini's response
//     const rankedScrapers = result.candidates?.[0]?.content
//       ?.split("\n")
//       .map((line) => {
//         const match = line.match(/^\d+\.\s(.+?)\s-\sAddress:/);
//         return match ? match[1] : null;
//       })
//       .filter(Boolean);

//     // Map the ranked names back to scraper objects
//     return scrapers.filter((scraper) =>
//       rankedScrapers.includes(scraper.name)
//     );
//   } catch (error) {
//     console.error("Error ranking scrapers with Gamini:", error);
//     return scrapers; // Fallback to unsorted scrapers
//   }
// };




// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI("AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw");

// export const findNearestScrapersWithGamini = async (city, state) => {
//   const dynamicPrompt = `
//     Find only active scrap dealers in or near ${city}, ${state}, who **BUY** scrap materials from sellers.
//     Exclude dealers who sell scrap or do not purchase scrap from individuals.
//     Ensure the selected scrap dealers are within 2-3 km or reachable in 10-15 minutes.
    
//     Provide the result in JSON format:
//     [
//       {
//         "name": "Scraper Name",
//         "shop_address": "Shop Address",
//         "contact_number": "Contact Number"
//       }
//     ]
    
//     Only return dealers who **actively buy scrap**. If there are none, return an empty array [].
//   `;

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const result = await model.generateContent(dynamicPrompt);

//     // Retrieve raw response text
//     const rawText = await result.response.text();

//     // Remove backticks and sanitize the response
//     const sanitizedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

//     console.log("Sanitized Response Text:", sanitizedText);

//     // Parse the sanitized response text
//     const rankedScrapers = sanitizedText.startsWith("[")
//       ? JSON.parse(sanitizedText)
//       : []; // Fallback to an empty array if parsing fails

//     console.log("Ranked Scrapers:", rankedScrapers);
//     return rankedScrapers;
//   } catch (error) {
//     console.error("Error in Gamini API request:", error);
//     return [];
//   }
// };




// import { GoogleGenerativeAI } from "@google/generative-ai";
// import axios from "axios";

// const genAI = new GoogleGenerativeAI("AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw"); // Replace with your actual API key
// const GOOGLE_MAPS_API_KEY = "AIzaSyCcenVOKOAhHj0DO_JmR_bocN9FEebP74M"; // Replace with your actual API key

// export const findNearestScrapersWithGamini = async (userLat, userLng) => {
//   try {
//     console.log("🔹 Fetching real-time scrap dealers from Google Maps...");

//     // 🔹 Step 1: Use Google Places API to find scrap dealers
//     const googleMapsResponse = await axios.get(
//       `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
//       {
//         params: {
//           location: `${userLat},${userLng}`, // User's exact location
//           radius: 5000, // 5 km radius
//           keyword: "scrap dealer",
//           type: "store",
//           key: GOOGLE_MAPS_API_KEY,
//         },
//       }
//     );

//     const places = googleMapsResponse.data.results;

//     if (!places || places.length === 0) {
//       console.warn("⚠️ No nearby scrapers found via Google Maps API.");
//       return [];
//     }

//     console.log(`✅ Found ${places.length} scrap dealers via Google Maps.`);

//     // 🔹 Step 2: Extract and refine Google Maps data
//     const scraperDetails = await Promise.all(
//       places.map(async (place) => {
//         let phoneNumber = "No contact available";

//         // Fetch additional details to get the phone number
//         try {
//           const detailsResponse = await axios.get(
//             `https://maps.googleapis.com/maps/api/place/details/json`,
//             {
//               params: {
//                 place_id: place.place_id,
//                 fields: "name,vicinity,formatted_phone_number,rating",
//                 key: GOOGLE_MAPS_API_KEY,
//               },
//             }
//           );

//           if (detailsResponse.data.result.formatted_phone_number) {
//             phoneNumber = detailsResponse.data.result.formatted_phone_number;
//           }
// } catch (error) {
//   console.warn("⚠️ AI Response JSON Parsing Failed. Using Google Data.", error);
//   rankedScrapers = scraperDetails.slice(0, 5);
// }


//         return {
//           name: place.name,
//           shop_address: place.vicinity || "Address not available",
//           contact_number: phoneNumber,
//           rating: place.rating || "N/A",
//         };
//       })
//     );

//     // 🔹 Step 3: Use Gemini AI to refine and rank the best scrapers
//     console.log("🔹 Sending scraper details to Gemini AI for ranking...");

//     const dynamicPrompt = `
//       Rank the following scrap dealers based on:
//       - **Proximity to the user's location** (top priority)
//       - **Best ratings** (if available)
//       - **Highest reliability for buying scrap**
      
//       **Return only the top 5 scrapers in JSON format.**
      
//       Input JSON:
//       ${JSON.stringify(scraperDetails)}

//       Output JSON (max 5 scrapers):
//       [
//         {
//           "name": "Scraper Name",
//           "shop_address": "Shop Address",
//           "contact_number": "Contact Number",
//           "rating": "Rating"
//         }
//       ]
//     `;

//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const geminiResult = await model.generateContent(dynamicPrompt);

//     // 🔹 Extract AI response
//     const rawText = await geminiResult.response.text();
//     console.log("🔹 Raw Gemini AI Response:", rawText);

//     // 🔹 Step 4: Clean & Parse JSON Response
//     const sanitizedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
//     let rankedScrapers = [];

//     try {
//       rankedScrapers = JSON.parse(sanitizedText);
//     } catch (error) {
//       console.error("❌ Error in `findNearestScrapersWithGamini`:", error);
//       return [];
//     }
    

//     console.log("✅ Final Ranked Scrapers:", rankedScrapers);
//     return rankedScrapers;
//   } catch (error) {
//     console.error("❌ Error in `findNearestScrapersWithGamini`:", error);
//     return [];
//   }
// };



// import { GoogleGenerativeAI } from "@google/generative-ai";
// import axios from "axios";

// const genAI = new GoogleGenerativeAI("AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw"); // Replace with your Gemini AI key
// const GOOGLE_MAPS_API_KEY = "AIzaSyCcenVOKOAhHj0DO_JmR_bocN9FEebP74M"; // Replace with your Google Maps API key

// // 🔹 Fetch nearby scrap dealers using Google Maps API
// export const findScrapersFromGoogleMaps = async (userLat, userLng) => {
//   try {
//     console.log("📍 Fetching nearby scrap dealers from Google Maps...");

//     const googleMapsResponse = await axios.get(
//       `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
//       {
//         params: {
//           location: `${userLat},${userLng}`, // User's latitude & longitude
//           radius: 5000, // Search within 5 km
//           keyword: "scrap dealer", // Search keyword
//           type: "store", // Google Maps place type
//           key: GOOGLE_MAPS_API_KEY,
//         },
//       }
//     );

//     const places = googleMapsResponse.data.results;

//     if (!places || places.length === 0) {
//       console.warn("⚠️ No nearby scrapers found in Google Maps API.");
//       return [];
//     }

//     console.log(`✅ Found ${places.length} scrap dealers via Google Maps.`);

//     // Extract relevant details from Google API response
//     return places.map((place) => ({
//       name: place.name,
//       shop_address: place.vicinity || "Address not available",
//       contact_number: place.formatted_phone_number || "No contact available",
//       rating: place.rating || "N/A",
//       latitude: place.geometry?.location?.lat,
//       longitude: place.geometry?.location?.lng,
//     }));
//   } catch (error) {
//     console.error("❌ Error in Google Maps API request:", error);
//     return [];
//   }
// };

// // 🔹 Rank & filter the best scrap dealers using Gemini AI
// export const findNearestScrapersWithGamini = async (userLat, userLng, googleMapsScrapers) => {
//   try {
//     console.log("🔹 Refining scrap dealer list with Gemini AI...");

//     if (!googleMapsScrapers || googleMapsScrapers.length === 0) {
//       console.warn("⚠️ No scrapers available to refine.");
//       return [];
//     }

//     const dynamicPrompt = `
//       Given the following list of scrap dealers near latitude ${userLat} and longitude ${userLng}, rank them based on:
//       - **Proximity to the user** (top priority)
//       - **Best ratings** (if available)
//       - **Highest reliability for buying scrap**
//       - **Provide only the top 5 best results.**

//       Input JSON:
//       ${JSON.stringify(googleMapsScrapers)}

//       Output JSON (Max 5 results):
//       [
//         {
//           "name": "Scraper Name",
//           "shop_address": "Shop Address",
//           "contact_number": "Contact Number",
//           "rating": "Rating",
//           "latitude": "Latitude",
//           "longitude": "Longitude"
//         }
//       ]
//     `;

//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const geminiResult = await model.generateContent(dynamicPrompt);

//     // 🔹 Extract AI response
//     const rawText = await geminiResult.response.text();
//     console.log("🔹 Raw Gemini AI Response:", rawText);

//     // 🔹 Clean & Parse JSON Response
//     const sanitizedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
//     const rankedScrapers = sanitizedText.startsWith("[") ? JSON.parse(sanitizedText) : [];

//     console.log("✅ Ranked Scrapers:", rankedScrapers);
//     return rankedScrapers;
//   } catch (error) {
//     console.error("❌ Error in Gemini AI request:", error);
//     return [];
//   }
// };




import { GoogleGenerativeAI } from "@google/generative-ai";
// import axios from "axios";

const genAI = new GoogleGenerativeAI("AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw"); // Replace with your actual Gemini API key

export const findNearestScrapersWithGamini = async (pinCode, address, city, state) => {
  try {
    let searchInput = "";

    if (pinCode) {
      console.log("📍 Searching scrapers using Pin Code:", pinCode);
      searchInput = `Find active scrap dealers near the pin code ${pinCode}. Ensure they are within 5 km and prioritize those who buy scrap materials.`;
    } else {
      console.warn("⚠️ Pin Code not provided or inaccurate. Using address as fallback.");
      searchInput = `
        Find active scrap dealers near the address:
        "${address}, ${city}, ${state}". 
        Ensure they are within 5 km and prioritize those who buy scrap materials.
      `;
    }

    const dynamicPrompt = `
      ${searchInput}

      Return the result in JSON format:
      [
        {
          "name": "Scraper Name",
          "shop_address": "Shop Address",
          "contact_number": "Contact Number",
          "distance": "Distance in km"
        }
      ]

      Only return dealers who actively buy scrap. If none are found, return an empty array [].
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(dynamicPrompt);

    const rawText = await result.response.text();
    console.log("🔹 Raw Gemini AI Response:", rawText);

    // Clean and parse the response text
    const sanitizedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const rankedScrapers = sanitizedText.startsWith("[") ? JSON.parse(sanitizedText) : [];

    console.log("✅ Ranked Scrapers:", rankedScrapers);
    return rankedScrapers;
  } catch (error) {
    console.error("❌ Error in findNearestScrapersWithGamini:", error);
    return [];
  }
};
