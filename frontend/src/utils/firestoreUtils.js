// import stringSimilarity from "string-similarity";
// import { db } from "../firebaseConfig"; // Adjust the path
// import { collection, query, where, getDocs } from "firebase/firestore";

// export const fetchAllScrapers = async (city, state) => {
//   try {
//     const q = query(
//       collection(db, "users"),
//       where("account_type", "==", "Scraper") // Filter by scrapers
//     );

//     const querySnapshot = await getDocs(q);
//     const scrapers = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     // Combine city and state for comparison
//     const targetLocation = `${city}, ${state}`.toLowerCase();

//     // Sort scrapers by address similarity
//     const sortedScrapers = scrapers
//       .map((scraper) => {
//         const similarity = stringSimilarity.compareTwoStrings(
//           scraper.shop_address.toLowerCase(),
//           targetLocation
//         );
//         return { ...scraper, similarity };
//       })
//       .sort((a, b) => b.similarity - a.similarity); // Higher similarity first

//     // Filter scrapers with significant similarity
//     return sortedScrapers.filter((scraper) => scraper.similarity >= 0.5); // Set a similarity threshold
//   } catch (error) {
//     console.error("Error fetching nearby scrapers:", error);
//     return [];
//   }
// };



import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const fetchAllScrapers = async () => {
  try {
    const q = query(
      collection(db, "users"),
      where("account_type", "==", "Scraper") // Fetch only scrapers
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching all scrapers:", error);
    return [];
  }
};
