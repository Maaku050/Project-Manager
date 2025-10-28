// ✅ Import only what works in React Native
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCx52C_TNQHpjiKKMUPzdx7Hh4ybQ2I9ZI",
  authDomain: "project-manager-db-84920.firebaseapp.com",
  projectId: "project-manager-db-84920",
  storageBucket: "project-manager-db-84920.appspot.com", // ✅ Fix typo (.app → .appspot.com)
  messagingSenderId: "698768460581",
  appId: "1:698768460581:web:c5a826f9604131340b28cc",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Exports — React Native safe
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);