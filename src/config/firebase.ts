import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB8OxrMH7p1AKEaUlXvSqKcjzpUZRYx3wM",
  authDomain: "ldoil-cc862.firebaseapp.com",
  projectId: "ldoil-cc862",
  storageBucket: "ldoil-cc862.firebasestorage.app", // Make sure this matches your Firebase project
  messagingSenderId: "75122542336",
  appId: "1:75122542336:web:a5db7169e77918835215e5"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Verify storage is properly initialized
try {
  if (!storage) {
    throw new Error('Firebase Storage not initialized')
  }
} catch (error) {
  console.error('Firebase Storage initialization error:', error)
}

export default app