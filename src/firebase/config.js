// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnc7Z206CkJhgdFJBUETmMLWW3HYLtz_A",
  authDomain: "cinema-reservation-app-ef433.firebaseapp.com",
  projectId: "cinema-reservation-app-ef433",
  storageBucket: "cinema-reservation-app-ef433.firebasestorage.app",
  messagingSenderId: "64234255907",
  appId: "1:64234255907:web:8da5dc4727aee1041a2396",
  measurementId: "G-3VW73F4FG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { db, auth, storage };
