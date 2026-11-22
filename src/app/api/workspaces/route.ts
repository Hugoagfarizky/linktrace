import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createWorkspaceSchema } from "@/lib/validations/workspace";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
    include: {
      _count: {
        select: { links: true, campaigns: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ workspaces });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = createWorkspaceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, slug } = validated.data;

    // Check slug uniqueness
    const existing = await prisma.workspace.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A workspace with this URL slug already exists. Please pick another." },
        { status: 409 }
      );
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    console.error("Create workspace error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
