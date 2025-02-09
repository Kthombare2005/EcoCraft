import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyCcenVOKOAhHj0DO_JmR_bocN9FEebP74M"; // Replace with your actual API key

/**
 * Fetch nearby scrap dealers using Google Maps Places API.
 * @param {string} pinCode - Pin code of the location.
 * @param {string} address - Address details as fallback.
 * @param {number} radius - Search radius in meters (default: 5000).
 * @returns {Array} List of nearby scrap dealers.
 */
export const findScrapersFromGoogleMaps = async (pinCode, address, city, state, radius = 5000) => {
  try {
    let location;

    // 🔹 Step 1: Convert Pin Code or Address to Lat/Lng using Geocoding API
    if (pinCode || (address && city && state)) {
      const geocodeQuery = pinCode ? pinCode : `${address}, ${city}, ${state}`;
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: geocodeQuery,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (geocodeResponse.data.results.length > 0) {
        location = geocodeResponse.data.results[0].geometry.location;
        console.log("📍 Resolved Location:", location);
      } else {
        console.error("❌ Unable to resolve location for:", geocodeQuery);
        return [];
      }
    } else {
      console.error("❌ No pin code or address provided.");
      return [];
    }

    // 🔹 Step 2: Fetch Nearby Scrap Dealers Using Places API
    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${location.lat},${location.lng}`,
          radius,
          keyword: "scrap dealer",
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const places = placesResponse.data.results;

    if (places.length === 0) {
      console.warn("⚠️ No nearby scrap dealers found.");
      return [];
    }

    // 🔹 Step 3: Map the Results into a Standardized Format
    const scrapers = places.map((place) => ({
      name: place.name,
      shop_address: place.vicinity || "Address not available",
      contact_number: "Contact Not Available", // Contact info is not directly provided by Google
      rating: place.rating || "N/A",
      location: place.geometry.location,
    }));

    console.log("✅ Nearby Scrap Dealers:", scrapers);
    return scrapers;
  } catch (error) {
    console.error("❌ Error fetching scrapers from Google Maps:", error);
    return [];
  }
};
