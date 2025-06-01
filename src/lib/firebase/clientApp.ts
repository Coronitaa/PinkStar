
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore'; // For later Firestore use

// Your web app's Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyD97Fp5mUTTSumtOoNNi-GWqvvhTWXZVqE",
  authDomain: "pinkstar-phr46.firebaseapp.com",
  projectId: "pinkstar-phr46",
  storageBucket: "pinkstar-phr46.firebasestorage.app", // Corrected from .firebasestorage.app
  messagingSenderId: "319415996267",
  appId: "1:319415996267:web:5be8f9bfc2b98440ad862e"
};

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
