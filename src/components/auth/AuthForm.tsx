
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { AuthFormData as GenericAuthFormData } from '@/lib/types'; // Using the merged type
import { PasswordStrengthBar } from './PasswordStrengthBar';

// Schema for Sign Up
const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).max(20, { message: 'Username must be at most 20 characters.' }).regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s\-()]+$/, { message: 'Invalid phone number format.' }),
  passwordBody: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

// Schema for Sign In
const signInSchema = z.object({
  identifier: z.string().min(1, { message: 'Please enter your email or username.' }),
  passwordBody: z.string().min(1, { message: 'Please enter your password.' }),
});


export type AuthFormActionData = GenericAuthFormData; // For onSubmit prop

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: AuthFormActionData) => Promise<any>;
  loading: boolean;
}

export function AuthForm({ mode, onSubmit, loading }: AuthFormProps) {
  const currentSchema = mode === 'signup' ? signUpSchema : signInSchema;

  const form = useForm<AuthFormActionData>({ // Use the generic AuthFormData for the form state
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      username: '',
      phoneNumber: '',
      identifier: '',
      passwordBody: '',
    },
  });

  const passwordValue = form.watch('passwordBody');

  const title = mode === 'signin' ? 'Sign In to PinkStar' : 'Create an Account';
  const description = mode === 'signin' ? 'Enter your credentials to access your account.' : 'Fill in the details to join PinkStar.';
  const buttonText = mode === 'signin' ? 'Sign In' : 'Sign Up';
  const alternativeText = mode === 'signin' ? "Don't have an account?" : 'Already have an account?';
  const alternativeLink = mode === 'signin' ? '/auth/signup' : '/auth/signin';
  const alternativeLinkText = mode === 'signin' ? 'Sign Up' : 'Sign In';

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {mode === 'signup' && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="your_username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {mode === 'signin' && (
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Username</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com or your_username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="passwordBody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    {mode === 'signup' && <PasswordStrengthBar password={passwordValue} />}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full button-primary-glow" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {alternativeText}{' '}
            <Link href={alternativeLink} className="font-medium text-primary hover:underline">
              {alternativeLinkText}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
