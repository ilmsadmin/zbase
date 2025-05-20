import { DefaultSession } from "next-auth";

// Mở rộng session user type của NextAuth
declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    permissions: string[];
    accessToken?: string;
  }
}

// User được sử dụng trong ứng dụng
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  permissions: string[];
}

// Auth state
export interface AuthState {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}
