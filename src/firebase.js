import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration - User's actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyB2kVOGI3anJDBwMvM7T_YtsXEyQC46yI4",
  authDomain: "sridhar-cloud-portfolio.firebaseapp.com",
  databaseURL: "https://sridhar-cloud-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sridhar-cloud-portfolio",
  storageBucket: "sridhar-cloud-portfolio.firebasestorage.app",
  messagingSenderId: "982846796463",
  appId: "1:982846796463:web:ad88e9ec367a7ae32a1a5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Realtime Database instance
const database = getDatabase(app);

export { database };

