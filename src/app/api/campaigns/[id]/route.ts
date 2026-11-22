import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getActiveWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateCampaignSchema } from "@/lib/validations/campaign";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return NextResponse.json({ error: "No active workspace" }, { status: 400 });

  const campaign = await prisma.campaign.findFirst({
    where: { id, workspaceId: workspace.id },
    include: {
      links: {
        include: {
          _count: {
            select: { clickEvents: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const formattedLinks = campaign.links.map((link) => ({
    id: link.id,
    shortCode: link.shortCode,
    destinationUrl: link.destinationUrl,
    title: link.title,
    isActive: link.isActive,
    clicksCount: link._count.clickEvents,
    createdAt: link.createdAt,
  }));

  const totalClicks = formattedLinks.reduce((sum, l) => sum + l.clicksCount, 0);

  return NextResponse.json({
    campaign: {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      linksCount: formattedLinks.length,
      clicksCount: totalClicks,
      links: formattedLinks,
      createdAt: campaign.createdAt,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return NextResponse.json({ error: "No active workspace" }, { status: 400 });

  try {
    const existing = await prisma.campaign.findFirst({
      where: { id, workspaceId: workspace.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Campaign not found or access denied" }, { status: 404 });
    }

    const body = await request.json();
    const validated = updateCampaignSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        name: validated.data.name ?? existing.name,
        description: validated.data.description !== undefined ? validated.data.description : existing.description,
      },
    });

    return NextResponse.json({ campaign: updated });
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return NextResponse.json({ error: "No active workspace" }, { status: 400 });

  const existing = await prisma.campaign.findFirst({
    where: { id, workspaceId: workspace.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Campaign not found or access denied" }, { status: 404 });
  }

  // Dissociate links from this campaign before deleting so links are preserved
  await prisma.link.updateMany({
    where: { campaignId: id },
    data: { campaignId: null },
  });

  await prisma.campaign.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Campaign deleted successfully" });
}
