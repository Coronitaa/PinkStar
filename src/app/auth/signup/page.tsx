
'use client';

import { AuthForm, type AuthFormActionData } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (data: AuthFormActionData) => {
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
