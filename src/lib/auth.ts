// lib/auth.ts
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

export const {
    auth,
    handlers: { GET, POST },
    signIn,
    signOut,
} = NextAuth(authOptions);