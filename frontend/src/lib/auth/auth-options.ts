import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {          // Gọi API đăng nhập từ backend
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.error("Login failed:", await response.text());
            return null;
          }
            const data = await response.json();
          console.log("Login response data:", JSON.stringify(data, null, 2));
          
          // Check the format of roles in the response
          const userRole = Array.isArray(data.user.roles) && data.user.roles.length > 0 
            ? String(data.user.roles[0]).toUpperCase() 
            : "USER";
            
          console.log("Extracted role:", userRole);
          
          return {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.name,
            role: userRole,
            permissions: data.user.permissions || [],
            accessToken: data.access_token
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],  callbacks: {    async jwt({ token, user }) {
      if (user) {
        console.log("JWT Callback - user:", JSON.stringify(user, null, 2));
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.permissions = user.permissions;
        console.log("JWT Token after update:", JSON.stringify(token, null, 2));
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - token:", JSON.stringify(token, null, 2));
      
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
        session.accessToken = token.accessToken as string;
        
        console.log("Session after update:", JSON.stringify(session, null, 2));
      }
      return session;
    },
  },  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
