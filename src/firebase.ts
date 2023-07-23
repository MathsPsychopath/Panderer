import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

if (!import.meta.env.VITE_FIREBASE_API_KEY)
  throw new Error("Undefined firebase api key");

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "panderer-fef7a.web.app",
  databaseURL: "https://panderer-fef7a-default-rtdb.firebaseio.com",
  projectId: "panderer-fef7a",
  storageBucket: "panderer-fef7a.appspot.com",
  messagingSenderId: "1014047149708",
  appId: "1:1014047149708:web:e3ec51c129a4dae748b5a9",
  measurementId: "G-YSM7MZ3BCH",
};

export const app = initializeApp(firebaseConfig);
export const rtDB = getDatabase(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);
export const auth = getAuth(app);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);
