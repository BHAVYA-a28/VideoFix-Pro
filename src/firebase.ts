import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHT1ZpvPWcdn07x3INYqPBFpWUbHciohg",
  authDomain: "webapp-46598.firebaseapp.com",
  projectId: "webapp-46598",
  storageBucket: "webapp-46598.firebasestorage.app",
  messagingSenderId: "247276949404",
  appId: "1:247276949404:web:ffc43a224de7165db60259",
  measurementId: "G-MWHNGHM7EL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 