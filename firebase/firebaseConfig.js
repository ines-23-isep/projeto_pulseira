import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = { 
apiKey: "AIzaSyDn435cWU-N8G6erdJzYXT7pnbPbkY8V7A",
  authDomain: "alwaysthere-f15b7.firebaseapp.com",
  databaseURL: "https://alwaysthere-f15b7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "alwaysthere-f15b7",
  storageBucket: "alwaysthere-f15b7.firebasestorage.app",
  messagingSenderId: "500527100463",
  appId: "1:500527100463:web:3ed03c923829183a7f0cda",
  measurementId: "G-Y3TL8JKYY5"

};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
