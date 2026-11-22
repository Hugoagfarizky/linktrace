import { NextResponse } from "next/server";
import { getCurrentUser, getActiveWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null, workspace: null }, { status: 401 });
  }

  const workspace = await getActiveWorkspace(user.id);
  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    user,
    activeWorkspace: workspace,
    workspaces,
  });
}
