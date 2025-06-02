
// src/lib/firebase/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client if it's not already initialized
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
  // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Add other providers as needed
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // On initial sign-in, persist the user's ID and role to the token
      if (user && user.id) { // user object is available on initial sign in
        token.id = user.id;
        // Fetch the user from Prisma DB to get their role
        // The 'user' object from the provider might not have the role if it's managed in your DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role || 'user'; // Default to 'user' if not found, though adapter should create it
      }
      return token;
    },
    async session({ session, token }) {
      // Add ID and role to the session object
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    // Optional: If you need to create/update user in Prisma DB upon OAuth sign-in
    // and the adapter doesn't handle it exactly as you need (e.g., for default role setting).
    // However, PrismaAdapter usually handles user creation/linking.
    // The role should ideally be set when the user is first created by the adapter,
    // or updated through an admin interface.
    // If the adapter doesn't set a default role, you might need to customize
    // the adapter's createUser method or handle it here (though jwt is more common for augmenting token).
  },
  // Add any other NextAuth.js configurations here
  // e.g., pages for custom sign-in, error pages, etc.
  // pages: {
  //   signIn: '/auth/signin',
  // },
});
