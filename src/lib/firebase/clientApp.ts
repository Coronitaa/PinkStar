
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'; // For later Firestore use

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration if environment variables are not set.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Check for placeholder values before initializing
const placeholders = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let usesPlaceholders = false;
for (const key in placeholders) {
  if (firebaseConfig[key as keyof typeof firebaseConfig] === placeholders[key as keyof typeof placeholders]) {
    usesPlaceholders = true;
    console.error(
      `Firebase Configuration Warning: The value for '${key}' is using a placeholder ('${placeholders[key as keyof typeof placeholders]}'). ` +
      `Please ensure your Firebase environment variables (e.g., NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}) are correctly set ` +
      `or update the placeholders in src/lib/firebase/clientApp.ts with your actual project credentials.`
    );
  }
}

if (usesPlaceholders) {
  console.error(
    "CRITICAL FIREBASE CONFIGURATION ERROR: Firebase is configured with placeholder values. Authentication and other Firebase services will not work correctly. " +
    "Verify your project's environment variable setup in Firebase Studio or your .env.local file."
  );
}

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
