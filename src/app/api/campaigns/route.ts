import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getActiveWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCampaignSchema } from "@/lib/validations/campaign";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return NextResponse.json({ error: "No active workspace" }, { status: 400 });

  try {
    const campaigns = await prisma.campaign.findMany({
      where: { workspaceId: workspace.id },
      include: {
        _count: {
          select: { links: true },
        },
        links: {
          select: {
            _count: {
              select: { clickEvents: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = campaigns.map((c) => {
      const totalClicks = c.links.reduce((acc, l) => acc + l._count.clickEvents, 0);
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        linksCount: c._count.links,
        clicksCount: totalClicks,
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json({ campaigns: formatted });
  } catch (error) {
    console.error("Fetch campaigns error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return NextResponse.json({ error: "No active workspace" }, { status: 400 });

  try {
    const body = await request.json();
    const validated = createCampaignSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description } = validated.data;

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
