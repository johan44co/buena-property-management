import {
  AuthOptions,
  DefaultSession,
  DefaultUser,
  getServerSession,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: UserRole;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role?: UserRole;
  }
}

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
