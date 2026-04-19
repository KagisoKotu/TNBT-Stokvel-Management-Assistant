// frontend/src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// This is the object you copied from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDhpOZkBa1yIbWcNJ2aYRV-uVyDxT_u9rI",
  authDomain: "stokvelstokkieauth.firebaseapp.com",
  projectId: "stokvelstokkieauth",
  storageBucket: "stokvelstokkieauth.firebasestorage.app",
  messagingSenderId: "533738969001",
  appId: "1:533738969001:web:5aabb5650042e6243dd6b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth service so you can use it in your Login/Signup components
export const auth = getAuth(app);
export default app;