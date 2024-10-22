import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyALELb4B73qRrVcmWuDz2c2PgHbV-0S8b4",
  authDomain: "tiendaderopadeportiva-4b728.firebaseapp.com",
  projectId: "tiendaderopadeportiva-4b728",
  storageBucket: "tiendaderopadeportiva-4b728.appspot.com",
  messagingSenderId: "813434698378",
  appId: "1:813434698378:web:9fdd6da878c934164c4b73"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

createRoot (document.getElementById("root")).render(
    <App/>
)
export default db;