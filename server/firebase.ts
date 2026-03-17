import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Get these values from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyB7tV28HxBcxU6nKMgqZpAe5RnyC-jvJU8",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "workbridge-273ad.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "workbridge-273ad",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "workbridge-273ad.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1092375078581",
  appId: process.env.FIREBASE_APP_ID || "1:1092375078581:web:9d9c4d58996ede2da7c0fc",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-T8DZ5Z73Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Debug log to confirm initialization
console.log('🔥 Firebase initialized with project:', firebaseConfig.projectId);

export default app;
