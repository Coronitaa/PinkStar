
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase/clientApp';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import type { AuthFormActionData } from '@/components/auth/AuthForm'; // Updated import
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
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (data: AuthFormActionData) => {
    setLoading(true);
    if (!data.email || !data.passwordBody || !data.username) {
      toast({ title: "Sign Up Failed", description: "Missing required fields.", variant: "destructive" });
      setLoading(false);
      return null;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.passwordBody);
      
      // Update profile with username as displayName
      if (userCredential.user && data.username) {
        await updateProfile(userCredential.user, {
          displayName: data.username,
          // photoURL: can be added later if an avatar upload feature is implemented
        });
        // Refresh user to get updated profile information
        // No direct reload needed, onAuthStateChanged will eventually pick it up or can manually update state.
        setUser(auth.currentUser); // Optimistically update user state
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
    try {
      // For now, Firebase's signInWithEmailAndPassword expects an email.
      // A full username/phone sign-in would require a backend lookup to get the email.
      // We are passing the 'identifier' directly as email.
      // If 'identifier' is a username, this will fail unless the username is also a valid email format
      // and happens to be the user's registered email.
      const userCredential = await signInWithEmailAndPassword(auth, data.identifier, data.passwordBody);
      toast({ title: "Sign In Successful", description: "Welcome back!" });
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = error.message || "Invalid credentials or user not found. Please try again.";
      if (error.code === 'auth/invalid-email' && data.identifier && !data.identifier.includes('@')) {
        errorMessage = "If signing in with username, ensure it's linked to your account. For now, try your email."
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid credentials or user not found. Please check your email/username and password.";
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
