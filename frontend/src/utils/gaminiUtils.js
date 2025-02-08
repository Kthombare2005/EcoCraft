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




import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB1El1CE7z3rS6yEAuDgWAzlfwZJWD4lTw");

export const findNearestScrapersWithGamini = async (city, state) => {
  const dynamicPrompt = `
    Find only active scrap dealers in or near ${city}, ${state}, who **BUY** scrap materials from sellers.
    Exclude dealers who sell scrap or do not purchase scrap from individuals.
    Ensure the selected scrap dealers are within 2-3 km or reachable in 10-15 minutes.
    
    Provide the result in JSON format:
    [
      {
        "name": "Scraper Name",
        "shop_address": "Shop Address",
        "contact_number": "Contact Number"
      }
    ]
    
    Only return dealers who **actively buy scrap**. If there are none, return an empty array [].
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(dynamicPrompt);

    // Retrieve raw response text
    const rawText = await result.response.text();

    // Remove backticks and sanitize the response
    const sanitizedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("Sanitized Response Text:", sanitizedText);

    // Parse the sanitized response text
    const rankedScrapers = sanitizedText.startsWith("[")
      ? JSON.parse(sanitizedText)
      : []; // Fallback to an empty array if parsing fails

    console.log("Ranked Scrapers:", rankedScrapers);
    return rankedScrapers;
  } catch (error) {
    console.error("Error in Gamini API request:", error);
    return [];
  }
};
