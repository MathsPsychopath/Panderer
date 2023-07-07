import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvmpL9tSc83TrH2DRfoxFbUbjalw8YvdM",
  authDomain: "panderer-fef7a.firebaseapp.com",
  databaseURL: "https://panderer-fef7a-default-rtdb.firebaseio.com",
  projectId: "panderer-fef7a",
  storageBucket: "panderer-fef7a.appspot.com",
  messagingSenderId: "1014047149708",
  appId: "1:1014047149708:web:e3ec51c129a4dae748b5a9",
  measurementId: "G-YSM7MZ3BCH",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
