
// src/types/next-auth.d.ts
import type { DefaultSession, User as DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null;
      role?: string | null; // Added role
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: string | null; // Added role
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string; // Added role
  }
}
