import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getActiveWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createLinkSchema } from "@/lib/validations/link";
import { generateShortCode, RESERVED_PATHS } from "@/lib/nanoid";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) {
    return NextResponse.json({ error: "No active workspace found" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const campaignId = searchParams.get("campaignId") || undefined;
  const status = searchParams.get("status") || "all";

  const whereClause: any = {
    workspaceId: workspace.id,
  };

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortCode: { contains: search, mode: "insensitive" } },
      { destinationUrl: { contains: search, mode: "insensitive" } },
    ];
  }

  if (campaignId) {
    whereClause.campaignId = campaignId;
  }

  if (status === "active") {
    whereClause.isActive = true;
  } else if (status === "disabled") {
    whereClause.isActive = false;
  }

  try {
    const links = await prisma.link.findMany({
      where: whereClause,
      include: {
        campaign: {
          select: { id: true, name: true },
        },
        _count: {
          select: { clickEvents: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedLinks = links.map((link) => ({
      id: link.id,
      shortCode: link.shortCode,
      destinationUrl: link.destinationUrl,
      title: link.title,
      description: link.description,
      isActive: link.isActive,
      expiresAt: link.expiresAt,
      campaignId: link.campaignId,
      campaignName: link.campaign?.name || null,
      clicksCount: link._count.clickEvents,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    }));

    return NextResponse.json({ links: formattedLinks });
  } catch (error) {
    console.error("Fetch links error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) {
    return NextResponse.json({ error: "No active workspace found" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validated = createLinkSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { destinationUrl, title, description, campaignId, expiresAt } = validated.data;
    let shortCode = validated.data.shortCode?.trim();

    if (shortCode) {
      // Validate against reserved system paths
      if (RESERVED_PATHS.has(shortCode.toLowerCase())) {
        return NextResponse.json(
          { error: `The alias '/${shortCode}' is a reserved system path. Please choose another.` },
          { status: 400 }
        );
      }

      // Check uniqueness
      const existing = await prisma.link.findUnique({
        where: { shortCode },
      });

      if (existing) {
        return NextResponse.json(
          { error: `The alias '/${shortCode}' is already taken. Please choose another.` },
          { status: 409 }
        );
      }
    } else {
      // Auto-generate unique short code
      let unique = false;
      let attempts = 0;
      while (!unique && attempts < 10) {
        shortCode = generateShortCode(6);
        const exists = await prisma.link.findUnique({ where: { shortCode } });
        if (!exists) unique = true;
        attempts++;
      }
      if (!unique) {
        return NextResponse.json({ error: "Failed to generate unique alias" }, { status: 500 });
      }
    }

    // Verify campaign belongs to workspace if provided
    if (campaignId) {
      const camp = await prisma.campaign.findFirst({
        where: { id: campaignId, workspaceId: workspace.id },
      });
      if (!camp) {
        return NextResponse.json({ error: "Campaign not found in this workspace" }, { status: 404 });
      }
    }

    const link = await prisma.link.create({
      data: {
        destinationUrl,
        shortCode: shortCode!,
        title: title || destinationUrl,
        description,
        workspaceId: workspace.id,
        campaignId: campaignId || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        campaign: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(
      {
        link: {
          ...link,
          campaignName: link.campaign?.name || null,
          clicksCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
