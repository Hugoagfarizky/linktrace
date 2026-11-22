import { prisma } from "@/lib/prisma";

export interface TrackingData {
  referrer: string | null;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  country: string | null;
  visitorHash: string;
}

export function parseReferrer(rawReferrer: string | null): string {
  if (!rawReferrer) return "Direct / None";

  try {
    const url = new URL(rawReferrer);
    const host = url.hostname.toLowerCase();

    if (host.includes("instagram.com")) return "Instagram";
    if (host === "t.co" || host.endsWith(".t.co") || host.includes("twitter.com") || host === "x.com" || host.endsWith(".x.com")) return "Twitter / X";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("facebook.com") || host.includes("fb.com")) return "Facebook";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("google.")) return "Google Search";
    if (host.includes("bing.")) return "Bing Search";
    if (host.includes("reddit.com")) return "Reddit";
    if (host.includes("whatsapp.")) return "WhatsApp";
    if (host === "t.me" || host.endsWith(".t.me") || host.includes("telegram.")) return "Telegram";

    return host.replace(/^www\./, "");
  } catch {
    return "Other";
  }
}

export function parseUserAgent(ua: string) {
  const lower = ua.toLowerCase();

  // Device
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  if (/ipad|tablet|(android(?!.*mobile))/i.test(lower)) {
    deviceType = "tablet";
  } else if (/mobile|iphone|ipod|android/i.test(lower)) {
    deviceType = "mobile";
  }

  // Browser
  let browser = "Other";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("chrome") && !lower.includes("chromium")) browser = "Chrome";
  else if (lower.includes("safari") && !lower.includes("chrome")) browser = "Safari";
  else if (lower.includes("firefox")) browser = "Firefox";
  else if (lower.includes("opera") || lower.includes("opr/")) browser = "Opera";

  // Operating System (check mobile iOS first as iOS UA contains 'like Mac OS X')
  let os = "Other";
  if (lower.includes("iphone") || lower.includes("ipad") || lower.includes("ios")) os = "iOS";
  else if (lower.includes("macintosh") || lower.includes("mac os")) os = "macOS";
  else if (lower.includes("android")) os = "Android";
  else if (lower.includes("windows")) os = "Windows";
  else if (lower.includes("linux")) os = "Linux";

  return { deviceType, browser, os };
}

export function generateVisitorHash(ip: string, ua: string): string {
  // Rotate salt daily so IP can never be reverse-engineered or tracked across days
  const today = new Date().toISOString().split("T")[0];
  const data = `${ip}-${ua}-${today}-linktrace-salt`;

  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function recordClickAsync(
  linkId: string,
  headers: {
    referrer: string | null;
    userAgent: string;
    ip: string;
    country: string | null;
  }
) {
  const { deviceType, browser, os } = parseUserAgent(headers.userAgent);
  const normalizedReferrer = parseReferrer(headers.referrer);
  const visitorHash = generateVisitorHash(headers.ip, headers.userAgent);

  // Fire-and-forget: does not block HTTP redirect
  prisma.clickEvent
    .create({
      data: {
        linkId,
        referrer: normalizedReferrer,
        deviceType,
        browser,
        os,
        country: headers.country || "Unknown",
        visitorHash,
      },
    })
    .catch((err) => {
      console.error("Non-blocking click record failure:", err);
    });
}
