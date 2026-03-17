import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@reelgen/db";

const providers = [] as NextAuthOptions["providers"];

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
    strategy: "database",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const workspace = await prisma.workspace.findFirst({
          where: { ownerUserId: user.id },
          select: { id: true },
        });
        if (workspace) {
          session.user.workspaceId = workspace.id;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const existing = await prisma.workspace.findFirst({
        where: { ownerUserId: user.id },
      });
      if (existing) {
        return;
      }

      const baseName = user.name ?? user.email?.split("@")[0] ?? "Workspace";
      const plan = {
        status: "trial",
        planCode: "free",
        monthlyVideoLimit: 5,
        monthlyCreditsIncluded: 50,
      };

      const workspace = await prisma.workspace.create({
        data: {
          ownerUserId: user.id,
          name: `${baseName} Workspace`,
          timezone: "UTC",
          defaultLanguage: "en",
          planId: "free",
          subscription: {
            create: {
              status: plan.status,
              planCode: plan.planCode,
              monthlyVideoLimit: plan.monthlyVideoLimit,
              monthlyCreditsIncluded: plan.monthlyCreditsIncluded,
            },
          },
        },
      });

      await prisma.creditLedger.create({
        data: {
          workspaceId: workspace.id,
          type: "monthly",
          delta: plan.monthlyCreditsIncluded,
          balanceAfter: plan.monthlyCreditsIncluded,
          reason: "Initial credit grant",
        },
      });
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};
