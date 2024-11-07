import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDhwvX2HXcxzPZpaX_Cy2VYV1cKgBE7KJQ",
    authDomain: "ecommerece-bulbul2025.firebaseapp.com",
    projectId: "ecommerece-bulbul2025",
    storageBucket: "ecommerece-bulbul2025.firebasestorage.app",
    messagingSenderId: "909753061910",
    appId: "1:909753061910:web:fe94b065e3cf240d8f9b37",
    measurementId: "G-0FD68BPRYM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 