import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export type Role = "customer" | "vendor" | "admin";

export interface User {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  role: Role;
  createdAt: any;
  updatedAt: any;
}

export class AuthService {
  static async loginWithGoogle(): Promise<{ success: boolean; data?: User; error?: any }> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists in firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new customer user
        const newUser: User = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: "customer",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, newUser);
        return { success: true, data: newUser };
      }

      return { success: true, data: userSnap.data() as User };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error };
    }
  }

  static async logout(): Promise<{ success: boolean; error?: any }> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Logout Error:", error);
      return { success: false, error };
    }
  }
}
