import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHTP8eFXm2liG0bDmEDLXxVS6P5a1XaO0",
  authDomain: "chillwave-1134f.firebaseapp.com",
  projectId: "chillwave-1134f",
  storageBucket: "chillwave-1134f.firebasestorage.app",
  messagingSenderId: "115926770267",
  appId: "1:115926770267:web:cfcc4f521d0f6ab526557e",
  measurementId: "G-847286CEKX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
