import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@blackmoss/db";
import { UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getRedisSessionClient } from "./redis";

// Redis session store adapter
class RedisSessionStore {
  private client: ReturnType<typeof getRedisSessionClient>;

  constructor() {
    this.client = getRedisSessionClient()!;
  }

  async get(sessionToken: string) {
    const data = await this.client.get(`session:${sessionToken}`);
    return data ? JSON.parse(data) : null;
  }

  async set(sessionToken: string, session: any, maxAge: number) {
    await this.client.setEx(
      `session:${sessionToken}`,
      maxAge,
      JSON.stringify(session)
    );
  }

  async delete(sessionToken: string) {
    await this.client.del(`session:${sessionToken}`);
  }
}

export const authOptionsRedis: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        if (user.status !== UserStatus.ACTIVE) {
          throw new Error("Account is not active");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};
