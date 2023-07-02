import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { initializeApp } from "firebase/app";

const dev_firebaseConfig = {
  apiKey: "AIzaSyAvmpL9tSc83TrH2DRfoxFbUbjalw8YvdM",
  authDomain: "panderer-fef7a.firebaseapp.com",
  databaseURL: "https://panderer-fef7a-default-rtdb.firebaseio.com",
  projectId: "panderer-fef7a",
  storageBucket: "panderer-fef7a.appspot.com",
  messagingSenderId: "1014047149708",
  appId: "1:1014047149708:web:84bb67f27f886b0148b5a9",
  measurementId: "G-DL16YG09CC",
};

const prod_firebaseConfig = {
  apiKey: "AIzaSyAvmpL9tSc83TrH2DRfoxFbUbjalw8YvdM",
  authDomain: "panderer-fef7a.firebaseapp.com",
  databaseURL: "https://panderer-fef7a-default-rtdb.firebaseio.com",
  projectId: "panderer-fef7a",
  storageBucket: "panderer-fef7a.appspot.com",
  messagingSenderId: "1014047149708",
  appId: "1:1014047149708:web:e3ec51c129a4dae748b5a9",
  measurementId: "G-YSM7MZ3BCH",
};

export const app = initializeApp(
  process.env.NODE_ENV === "production"
    ? prod_firebaseConfig
    : dev_firebaseConfig
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

