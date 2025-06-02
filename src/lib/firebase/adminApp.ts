// src/lib/firebase/adminApp.ts
import admin from 'firebase-admin';

// WARNING: INLINING SERVICE ACCOUNT KEYS IS NOT SECURE FOR PRODUCTION.
// THIS IS FOR TESTING/DEBUGGING IN CONTROLLED ENVIRONMENTS ONLY.
// ALWAYS USE ENVIRONMENT VARIABLES IN PRODUCTION.
const INLINE_SERVICE_ACCOUNT_KEY_JSON_FOR_TESTING_ONLY = `{
  "type": "service_account",
  "project_id": "pinkstar-i7yl6",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "firebase-adminsdk-fbsvc@pinkstar-i7yl6.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40pinkstar-i7yl6.iam.gserviceaccount.com"
}`; // Replace ... with your actual key parts if testing this way.

let adminAppInstance: admin.app.App | undefined;
// let adminDbInstance: admin.firestore.Firestore | undefined; // Commented out for DB independence

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    adminAppInstance = admin.app();
    // adminDbInstance = admin.firestore(adminAppInstance); // Commented out
    // console.log("Firebase Admin SDK already initialized.");
    return;
  }

  const serviceAccountKeyJson = process.env.FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT_KEY_JSON;

  if (!serviceAccountKeyJson) {
    console.error(
      'Firebase Admin SDK: WARNING - FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT_KEY_JSON environment variable NOT FOUND.'
    );
    // Temporarily try inline key for debugging if env var is missing
    console.warn(
      'Firebase Admin SDK: WARNING - Attempting to use INLINE service account key for TESTING PURPOSES ONLY. DO NOT USE IN PRODUCTION.'
    );
    try {
      const serviceAccount = JSON.parse(INLINE_SERVICE_ACCOUNT_KEY_JSON_FOR_TESTING_ONLY);
      adminAppInstance = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      // adminDbInstance = admin.firestore(adminAppInstance); // Commented out
      console.log("Firebase Admin SDK initialized successfully (possibly using an inline key for testing).");
    } catch (error: any) {
      console.error(
        'Firebase Admin SDK: CRITICAL - Error parsing or initializing with INLINE service account key JSON. Error:',
        error.message
      );
    }
    return;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKeyJson);
    adminAppInstance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    // adminDbInstance = admin.firestore(adminAppInstance); // Commented out
    console.log("Firebase Admin SDK initialized successfully from environment variable.");
  } catch (error: any) {
    console.error(
      'Firebase Admin SDK: CRITICAL - Error parsing or initializing with service account key JSON from environment variable. Ensure the variable contains valid JSON. Error:',
      error.message
    );
  }
}

initializeAdminApp();

export const adminApp = adminAppInstance;
// export const adminDb = adminDbInstance; // Export commented out
