import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { ZodError } from "zod";
import { signUpSchema } from "@/lib/auth-schemas";
import { hashPassword } from "@/lib/password";
import { ensureWorkspaceForUser } from "@/lib/workspace-provisioning";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = signUpSchema.parse(json);
    const email = parsed.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });

    if (existingUser?.passwordHash) {
      return NextResponse.json(
        { error: "An account with this email already exists.", code: "email_exists" },
        { status: 409 }
      );
    }

    if (existingUser && !existingUser.passwordHash) {
      return NextResponse.json(
        { error: "This email is already linked to a Google account.", code: "google_account" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(parsed.password);

    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.name.trim(),
        passwordHash,
        status: "active",
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    await ensureWorkspaceForUser({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid input.", code: "invalid_input" },
        { status: 400 }
      );
    }

    console.error("Unable to register credentials user", error);

    return NextResponse.json(
      { error: "Unable to create account right now.", code: "server_error" },
      { status: 500 }
    );
  }
}
