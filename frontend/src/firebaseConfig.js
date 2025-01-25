// // Import Firebase modules
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, GithubAuthProvider} from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBoZx71R_X5uVmwC80yAmFBVonc34s2rSM",
//   authDomain: "ecocraft-45bd5.firebaseapp.com",
//   projectId: "ecocraft-45bd5",
//   storageBucket: "ecocraft-45bd5.firebasestorage.app",
//   messagingSenderId: "526603846840",
//   appId: "1:526603846840:web:6418ffc7013749d8cae04d",
//   measurementId: "G-XW3ZRWDWMW",
// };

// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase services
// export const auth = getAuth(app); // For authentication
// export const db = getFirestore(app); // For Firestore

// export const googleProvider = new GoogleAuthProvider(); // Export GoogleAuthProvider
// export const githubProvider = new GithubAuthProvider(); // Export GithubAuthProvider

// export default app;






// Import necessary modules from Firebase
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged as firebaseOnAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoZx71R_X5uVmwC80yAmFBVonc34s2rSM",
  authDomain: "ecocraft-45bd5.firebaseapp.com",
  projectId: "ecocraft-45bd5",
  storageBucket: "ecocraft-45bd5.firebasestorage.app",
  messagingSenderId: "526603846840",
  appId: "1:526603846840:web:6418ffc7013749d8cae04d",
  measurementId: "G-XW3ZRWDWMW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // For authentication
export const db = getFirestore(app); // For Firestore

// Export the `onAuthStateChanged` function with an alias to avoid naming conflicts
export const onAuthStateChanged = firebaseOnAuthStateChanged; 

export default app;
