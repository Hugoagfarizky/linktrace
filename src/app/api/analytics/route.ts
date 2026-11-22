import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getActiveWorkspace } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return NextResponse.json({ error: "No active workspace" }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";
  const linkId = searchParams.get("linkId") || undefined;
  const campaignId = searchParams.get("campaignId") || undefined;

  let days = 30;
  if (range === "7d") days = 7;
  else if (range === "90d") days = 90;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  try {
    // 1. Get workspace overall counts
    const totalLinks = await prisma.link.count({
      where: { workspaceId: workspace.id },
    });

    const activeCampaigns = await prisma.campaign.count({
      where: { workspaceId: workspace.id },
    });

    // 2. Click events query filter
    const clickWhere: any = {
      link: { workspaceId: workspace.id },
      timestamp: { gte: startDate },
    };

    if (linkId) clickWhere.linkId = linkId;
    if (campaignId) clickWhere.link = { ...clickWhere.link, campaignId };

    const events = await prisma.clickEvent.findMany({
      where: clickWhere,
      select: {
        timestamp: true,
        referrer: true,
        deviceType: true,
        browser: true,
        country: true,
        visitorHash: true,
        link: {
          select: {
            id: true,
            title: true,
            shortCode: true,
            destinationUrl: true,
          },
        },
      },
      orderBy: { timestamp: "asc" },
    });

    const totalClicks = events.length;

    // Unique visitors estimation (distinct visitorHash)
    const uniqueVisitorHashes = new Set(events.map((e) => e.visitorHash).filter(Boolean));
    const uniqueVisitors = uniqueVisitorHashes.size;

    // Daily breakdown map for time-series chart
    const dailyMap = new Map<string, { clicks: number; visitorSet: Set<string> }>();
    for (let i = 0; i <= days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      dailyMap.set(key, { clicks: 0, visitorSet: new Set() });
    }

    // Accumulators for breakdowns
    const referrerMap = new Map<string, number>();
    const deviceMap = new Map<string, number>();
    const browserMap = new Map<string, number>();
    const countryMap = new Map<string, number>();
    const linkClickMap = new Map<string, { title: string; shortCode: string; destination: string; count: number }>();

    for (const e of events) {
      const dateKey = e.timestamp.toISOString().split("T")[0];
      if (dailyMap.has(dateKey)) {
        const entry = dailyMap.get(dateKey)!;
        entry.clicks++;
        if (e.visitorHash) entry.visitorSet.add(e.visitorHash);
      }

      // Referrer
      const ref = e.referrer || "Direct / None";
      referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1);

      // Device
      const dev = e.deviceType ? e.deviceType.charAt(0).toUpperCase() + e.deviceType.slice(1) : "Desktop";
      deviceMap.set(dev, (deviceMap.get(dev) || 0) + 1);

      // Browser
      const br = e.browser || "Other";
      browserMap.set(br, (browserMap.get(br) || 0) + 1);

      // Country
      const c = e.country || "Unknown";
      countryMap.set(c, (countryMap.get(c) || 0) + 1);

      // Link clicks
      if (e.link) {
        const cur = linkClickMap.get(e.link.id) || {
          title: e.link.title || e.link.destinationUrl,
          shortCode: e.link.shortCode,
          destination: e.link.destinationUrl,
          count: 0,
        };
        cur.count++;
        linkClickMap.set(e.link.id, cur);
      }
    }

    const timeSeries = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date: date.substring(5), // MM-DD
      clicks: data.clicks,
      visitors: data.visitorSet.size,
    }));

    const formatBreakdown = (map: Map<string, number>, total: number) => {
      return Array.from(map.entries())
        .map(([name, count]) => ({
          name,
          count,
          percent: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    };

    const topLinks = Array.from(linkClickMap.entries())
      .map(([id, info]) => ({ id, ...info }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      summary: {
        totalLinks,
        activeCampaigns,
        totalClicks,
        uniqueVisitors,
        range,
      },
      timeSeries,
      referrers: formatBreakdown(referrerMap, totalClicks),
      devices: formatBreakdown(deviceMap, totalClicks),
      browsers: formatBreakdown(browserMap, totalClicks),
      countries: formatBreakdown(countryMap, totalClicks),
      topLinks,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
