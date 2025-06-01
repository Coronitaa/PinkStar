
'use client';

import { AuthForm, type AuthFormActionData } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Since sign-up is suspended, we can show a message or redirect.
  // For now, AuthForm component itself will display a "suspended" message if mode is 'signup'.

  const handleSignUp = async (data: AuthFormActionData) => {
    // This function might not be called if the form is disabled,
    // but keeping it for completeness or if suspension is temporary.
    setLoading(true);
    const user = await signUp(data);
    if (user) {
      router.push('/'); // Redirect to home page or dashboard
    }
     // Only set loading to false if user is not returned, 
    // otherwise, page will redirect and unmount.
    if(!user) setLoading(false);
  };

  return <AuthForm mode="signup" onSubmit={handleSignUp} loading={loading} />;
}
