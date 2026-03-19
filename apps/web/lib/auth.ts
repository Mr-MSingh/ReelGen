import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@reelgen/db";
import { signInSchema } from "@/lib/auth-schemas";
import { verifyPassword } from "@/lib/password";
import { ensureWorkspaceForUser } from "@/lib/workspace-provisioning";

const providers = [] as NextAuthOptions["providers"];

providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = signInSchema.safeParse(credentials);

      if (!parsed.success) {
        return null;
      }

      const email = parsed.data.email.toLowerCase();
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          passwordHash: true,
        },
      });

      if (!user?.passwordHash) {
        return null;
      }

      const isValidPassword = await verifyPassword(
        parsed.data.password,
        user.passwordHash
      );

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  })
);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      const userId = user?.id ?? token.id ?? token.sub;

      if (!userId) {
        return token;
      }

      token.id = userId;

      if (!token.workspaceId) {
        const workspace = await prisma.workspace.findFirst({
          where: { ownerUserId: userId },
          select: { id: true },
        });

        if (workspace) {
          token.workspaceId = workspace.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? "";
        session.user.workspaceId = token.workspaceId;
        session.user.name = session.user.name ?? token.name;
        session.user.email = session.user.email ?? token.email;
        session.user.image =
          session.user.image ?? (typeof token.picture === "string" ? token.picture : null);
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email) {
        return;
      }

      await ensureWorkspaceForUser({
        userId: user.id,
        email: user.email,
        name: user.name,
      });
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};
