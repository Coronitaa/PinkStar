
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, db } from '@/lib/firebase/clientApp';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { AuthFormActionData } from '@/components/auth/AuthForm';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (data: AuthFormActionData) => Promise<User | null>;
  signIn: (data: AuthFormActionData) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(currentUser.email === 'admin@example.com');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (data: AuthFormActionData) => {
    setLoading(true);
    if (!data.email || !data.passwordBody || !data.username || !data.phoneNumber) {
      toast({ title: "Sign Up Failed", description: "Missing required fields.", variant: "destructive" });
      setLoading(false);
      return null;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.passwordBody);

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: data.username,
        });

        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          email: data.email,
          username: data.username,
          username_lowercase: data.username.toLowerCase(), // For case-insensitive username queries
          phoneNumber: data.phoneNumber,
          createdAt: new Date().toISOString(),
        });

        setUser(auth.currentUser);
      }

      toast({ title: "Sign Up Successful", description: `Welcome ${data.username}!` });
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign up error:", error);
      let errorMessage = error.message || "Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use. Please try a different email or sign in.";
      }
      toast({ title: "Sign Up Failed", description: errorMessage, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: AuthFormActionData) => {
    setLoading(true);
    if (!data.identifier || !data.passwordBody) {
      toast({ title: "Sign In Failed", description: "Missing required fields.", variant: "destructive" });
      setLoading(false);
      return null;
    }

    let emailToSignIn = data.identifier;

    try {
      // If identifier does not look like an email, assume it's a username and try to find the email
      if (!data.identifier.includes('@')) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username_lowercase", "==", data.identifier.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast({ title: "Sign In Failed", description: "Username not found. Please check your username or try signing in with your email.", variant: "destructive" });
          setLoading(false);
          return null;
        }
        // Assuming usernames are unique (you should enforce this with Firestore rules or backend logic)
        const userDoc = querySnapshot.docs[0].data();
        emailToSignIn = userDoc.email; // Use the email associated with the username
      }

      // Proceed with sign-in using the (potentially resolved) email
      const userCredential = await signInWithEmailAndPassword(auth, emailToSignIn, data.passwordBody);
      toast({ title: "Sign In Successful", description: "Welcome back!" });
      return userCredential.user;

    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = error.message || "Sign-in failed. Please try again.";

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid credentials. Please check your email/username and password.";
      } else if (error.code === 'auth/invalid-email') {
         errorMessage = "The email address format is invalid. If you used a username, please ensure it's correct and associated with an account."
      }
      toast({ title: "Sign In Failed", description: errorMessage, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    } catch (error: any) { // Added missing opening brace here
      console.error("Sign out error:", error);
      toast({ title: "Sign Out Failed", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
