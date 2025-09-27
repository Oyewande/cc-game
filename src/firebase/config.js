// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration    
const firebaseConfig = {
  apiKey: "AIzaSyBT7uzk46sD8rFBdd2Ic5HtxyvPAmMRb0E",
  authDomain: "countries-and-capitals-8defd.firebaseapp.com",
  projectId: "countries-and-capitals-8defd",
  storageBucket: "countries-and-capitals-8defd.firebasestorage.app",
  messagingSenderId: "108643486429",
  appId: "1:108643486429:web:688ebd302d05d9e25ea934",
  measurementId: "G-D23CKMCH45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };


// firebase login
// firebase init
// firebase deploy