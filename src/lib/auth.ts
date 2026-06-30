
/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Auth Configuration
 */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// The __Secure-/__Host- cookie name prefixes are REQUIRED by browsers to carry
// the Secure attribute. Over plain HTTP (local dev) a __Secure-/__Host- cookie is
// rejected outright, which silently breaks login. So only use the secure prefixes
// (and the Secure flag) in production, and plain names + non-secure in dev.
const useSecureCookies = process.env.NODE_ENV === "production"
const securePrefix = useSecureCookies ? "__Secure-" : ""
const hostPrefix = useSecureCookies ? "__Host-" : ""

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    cookies: {
        sessionToken: {
            name: `${securePrefix}blackmoss.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        callbackUrl: {
            name: `${securePrefix}blackmoss.callback-url`,
            options: {
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
        csrfToken: {
            name: `${hostPrefix}blackmoss.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
            },
        },
    },
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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        }
    }
};
