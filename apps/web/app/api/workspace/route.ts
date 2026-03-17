import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  timezone: z.string().min(2).optional(),
  defaultLanguage: z.string().min(2).optional(),
  defaultBrandTheme: z.string().min(1).optional(),
});

export async function GET() {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: auth.workspaceId },
  });

  return NextResponse.json(workspace);
}

export async function PATCH(request: Request) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const workspace = await prisma.workspace.update({
    where: { id: auth.workspaceId },
    data: parsed.data,
  });

  return NextResponse.json(workspace);
}
