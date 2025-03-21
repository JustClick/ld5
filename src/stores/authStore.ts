import { create } from 'zustand'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import type { User } from '../types/auth'

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
  setUser: (user: User | null) => void
  initializeAuthListener: () => () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  initializeAuthListener: () => {
    set({ loading: true })
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            set({ user: { ...userData, id: firebaseUser.uid }, loading: false })
          } else {
            set({ user: null, loading: false })
          }
        } else {
          set({ user: null, loading: false })
        }
      } catch (error) {
        console.error('Auth listener error:', error)
        set({ user: null, loading: false })
      }
    })
    return unsubscribe
  },

  setUser: (user) => set({ user, loading: false }),

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      
      if (!userDoc.exists()) {
        await signOut(auth)
        throw new Error('User account not found. Please contact support.')
      }
      
      const userData = userDoc.data() as User
      if (!userData.active) {
        await signOut(auth)
        throw new Error('Account is deactivated. Please contact support.')
      }

      set({ user: { ...userData, id: firebaseUser.uid }, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false, user: null })
      throw error
    }
  },

  signUp: async (email: string, password: string, userData: Partial<User>) => {
    set({ loading: true, error: null })
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      const newUser: User = {
        id: firebaseUser.uid,
        email,
        displayName: userData.displayName || '',
        role: 'employee',
        active: true,
        ...userData
      }
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      set({ user: newUser, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    try {
      await signOut(auth)
      set({ user: null, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true, error: null })
    try {
      await sendPasswordResetEmail(auth, email)
      set({ loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  clearError: () => set({ error: null })
}))