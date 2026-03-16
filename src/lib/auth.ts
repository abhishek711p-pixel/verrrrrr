// ... existing code ...
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
// ... existing code ...
  providers: [
    CredentialsProvider({
// ... existing code ...
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" } 
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log("NextAuth: Attempting login for", credentials.email, "with name", credentials.name);
          const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: credentials.name,
              email: credentials.email,
              password: credentials.password,
              role: credentials.role,
            }),
            cache: "no-store",
          });
          
          console.log("NextAuth: Backend response status:", res.status);
          if (!res.ok) {
            const errorText = await res.text();
            console.error("NextAuth: Backend error:", errorText);
            return null;
          }

          const data = await res.json();
          console.log("NextAuth: Backend success!", data.user.email);
          if (data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
            };
          }
        } catch (error) {
          console.error("NextAuth: Exception during fetch:", error);
          return null;
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', 
  }
}
