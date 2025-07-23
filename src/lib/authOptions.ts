// lib/authOptions.ts
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        password: true,
                        gambar: true // Pastikan ini di-select
                    }
                });

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                return isValid ? {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.gambar, // Kirim gambar sebagai image
                } : null;
            }
        })
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/admin/login" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email ?? "";
                token.name = user.name ?? "";
                token.gambar = user.image ?? undefined; // Sertakan gambar di token
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.gambar as string; // Sertakan gambar di session
            }
            return session;
        }
    }
};