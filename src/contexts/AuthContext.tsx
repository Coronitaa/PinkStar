
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, db } from '@/lib/firebase/clientApp'; // Ensure db is imported
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
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
        // Placeholder for admin check. In production, use custom claims.
        setIsAdmin(currentUser.email === 'admin@example.com');
        // Optionally, fetch more user profile data from Firestore here if needed globally
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
        // Update Firebase Auth profile
        await updateProfile(userCredential.user, {
          displayName: data.username,
        });

        // Store additional profile info in Firestore
        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          email: data.email,
          username: data.username,
          phoneNumber: data.phoneNumber,
          createdAt: new Date().toISOString(),
        });
        
        // Optimistically update user state with new profile info if needed
        setUser(auth.currentUser); 
      }
      
      toast({ title: "Sign Up Successful", description: `Welcome ${data.username}!` });
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ title: "Sign Up Failed", description: error.message || "Please try again.", variant: "destructive" });
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

    // Client-side pre-check for email format if identifier is not an email
    // This provides a clearer message before hitting Firebase for non-email identifiers.
    if (!data.identifier.includes('@')) {
      // Basic check, not a full email validation
      // Here, we assume if no "@" it's a username or phone.
      // Full username/phone login would require backend lookup.
      toast({ 
        title: "Sign In Information", 
        description: "Signing in with a username or phone number directly is not fully supported yet. Please use your email address to sign in.", 
        variant: "default" // Or "destructive" if preferred
      });
      setLoading(false);
      return null;
    }

    try {
      // Firebase's signInWithEmailAndPassword expects an email.
      // If data.identifier contains "@", we proceed.
      const userCredential = await signInWithEmailAndPassword(auth, data.identifier, data.passwordBody);
      toast({ title: "Sign In Successful", description: "Welcome back!" });
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = error.message || "Invalid credentials or user not found. Please try again.";
      
      // This specific check might be redundant now due to the pre-check, 
      // but kept for robustness if data.identifier passes pre-check but is still invalid for Firebase.
      if (error.code === 'auth/invalid-email') {
         errorMessage = "The email address provided is not valid. Please check the format and try again."
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid credentials or user not found. Please check your email and password.";
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
    } catch (error: any) {
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
