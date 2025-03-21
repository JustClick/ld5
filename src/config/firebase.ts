import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Log the configuration (excluding sensitive values)
console.log('Firebase config (auth domain):', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);

// Initialize Firebase
let auth;
let db;
let storage;
let app;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Verify storage is properly initialized
try {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }
} catch (error) {
  console.error('Firebase Storage initialization error:', error);
}

export { auth, db, storage };
export default app;