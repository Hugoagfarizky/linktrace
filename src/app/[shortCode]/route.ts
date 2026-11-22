import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordClickAsync } from "@/lib/tracking";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await context.params;

  if (!shortCode) {
    return NextResponse.redirect(new URL("/link-error?type=not-found", request.url));
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
      return NextResponse.redirect(
        new URL(`/link-error?type=not-found&code=${encodeURIComponent(shortCode)}`, request.url)
      );
    }

    // 3. Link inactive
    if (!link.isActive) {
      return NextResponse.redirect(
        new URL(`/link-error?type=disabled&code=${encodeURIComponent(shortCode)}`, request.url)
      );
    }

    // 4. Link expired
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.redirect(
        new URL(`/link-error?type=expired&code=${encodeURIComponent(shortCode)}`, request.url)
      );
    }

    // 5. Asynchronous, non-blocking click tracking
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer");
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null;

    recordClickAsync(link.id, { referrer, userAgent, ip, country });

    // 6. Fast 307 temporary redirect
    return NextResponse.redirect(new URL(link.destinationUrl), {
      status: 307,
    });
  } catch (error) {
    console.error("Redirect engine failure:", error);
    return NextResponse.redirect(new URL("/link-error?type=server-error", request.url));
  }
}
