import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getActiveWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateLinkSchema } from "@/lib/validations/link";
import { RESERVED_PATHS } from "@/lib/nanoid";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return NextResponse.json({ error: "No active workspace" }, { status: 400 });

  const link = await prisma.link.findFirst({
    where: { id, workspaceId: workspace.id },
    include: {
      campaign: { select: { id: true, name: true } },
      _count: { select: { clickEvents: true } },
    },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json({
    link: {
      ...link,
      campaignName: link.campaign?.name || null,
      clicksCount: link._count.clickEvents,
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
    const existing = await prisma.link.findFirst({
      where: { id, workspaceId: workspace.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Link not found or access denied" }, { status: 404 });
    }

    const body = await request.json();
    const validated = updateLinkSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { destinationUrl, title, description, isActive, expiresAt, campaignId } = validated.data;
    const shortCode = validated.data.shortCode?.trim();

    if (shortCode && shortCode !== existing.shortCode) {
      if (RESERVED_PATHS.has(shortCode.toLowerCase())) {
        return NextResponse.json(
          { error: `The alias '/${shortCode}' is reserved.` },
          { status: 400 }
        );
      }
      const duplicate = await prisma.link.findUnique({ where: { shortCode } });
      if (duplicate) {
        return NextResponse.json({ error: "Short code already in use." }, { status: 409 });
      }
    }

    const updated = await prisma.link.update({
      where: { id },
      data: {
        destinationUrl: destinationUrl ?? existing.destinationUrl,
        shortCode: shortCode ?? existing.shortCode,
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : existing.expiresAt,
        campaignId: campaignId !== undefined ? campaignId : existing.campaignId,
      },
      include: {
        campaign: { select: { id: true, name: true } },
        _count: { select: { clickEvents: true } },
      },
    });

    return NextResponse.json({
      link: {
        ...updated,
        campaignName: updated.campaign?.name || null,
        clicksCount: updated._count.clickEvents,
      },
    });
  } catch (error) {
    console.error("Update link error:", error);
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

  const existing = await prisma.link.findFirst({
    where: { id, workspaceId: workspace.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Link not found or access denied" }, { status: 404 });
  }

  await prisma.link.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Link deleted successfully" });
}
