import { create } from 'zustand';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type UserRole = 'customer' | 'vendor' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  loadingAuth: boolean;
  login: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: (defaultRole?: UserRole) => Promise<User>;
  register: (name: string, email: string, pass: string, role: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loadingAuth: true,
  setUser: (user) => set({ user, loadingAuth: false }),
  
  login: async (email, pass) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        set({ user: userData });
        return userData;
      } else {
        const partialUser: User = { id: userCredential.user.uid, name: email.split('@')[0], email, role: 'customer' };
        set({ user: partialUser });
        return partialUser;
      }
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error("Email atau password salah.");
      }
      throw new Error(error.message);
    }
  },

  loginWithGoogle: async (defaultRole: UserRole = 'customer') => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const uid = userCredential.user.uid;
      const email = userCredential.user.email || '';
      const name = userCredential.user.displayName || email.split('@')[0];

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        set({ user: userData });
        return userData;
      } else {
        // Create new user in Firestore
        const newUser: User = { id: uid, name, email, role: defaultRole };
        await setDoc(doc(db, 'users', uid), newUser);
        set({ user: newUser });
        return newUser;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  register: async (name, email, pass, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = userCredential.user.uid;
      const newUser: User = {
        id: uid,
        name,
        email,
        role
      };
      
      // Save user document to Firestore
      await setDoc(doc(db, 'users', uid), newUser);
      
      set({ user: newUser });
      return newUser;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error("Email ini sudah terdaftar.");
      }
      throw new Error(error.message);
    }
  },

  logout: async () => {
    await firebaseSignOut(auth);
    set({ user: null });
  }
}));

// Firebase Auth Observer to hydrate state on app load
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          useAuthStore.getState().setUser(userDoc.data() as User);
        } else {
          useAuthStore.getState().setUser({
            id: firebaseUser.uid,
            name: firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            role: 'customer'
          });
        }
      } catch (err) {
        console.error("Error fetching user role", err);
      }
    } else {
      useAuthStore.getState().setUser(null);
    }
  });
}
