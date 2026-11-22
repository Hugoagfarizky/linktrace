import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await context.params;

  if (!shortCode) {
    return NextResponse.json({ error: "Missing short code" }, { status: 400 });
  }

  try {
    // 1. Resolve short code from database
    const link = await prisma.link.findUnique({
      where: { shortCode },
      select: {
        id: true,
        destinationUrl: true,
        isActive: true,
        expiresAt: true,
      },
    });

    // 2. Link not found
    if (!link) {
      return NextResponse.json(
        { error: "Short link not found", shortCode },
        { status: 404 }
      );
    }

    // 3. Link inactive
    if (!link.isActive) {
      return NextResponse.json(
        { error: "This link has been disabled by its owner" },
        { status: 410 }
      );
    }

    // 4. Link expired
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 }
      );
    }

    // 5. Asynchronous, non-blocking click tracking
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || null;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const isMobile = /mobile|iphone|android|ipad/i.test(userAgent);
    const deviceType = isMobile ? "mobile" : "desktop";

    // Non-blocking event logging
    prisma.clickEvent
      .create({
        data: {
          linkId: link.id,
          referrer,
          deviceType,
          visitorHash: Buffer.from(ip + userAgent).toString("base64").substring(0, 32),
        },
      })
      .catch((err) => {
        console.error("Non-blocking click track error:", err);
      });

    // 6. Fast temporary redirect
    return NextResponse.redirect(new URL(link.destinationUrl), {
      status: 307,
    });
  } catch (error) {
    console.error("Redirect engine failure:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
