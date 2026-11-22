import { describe, it, expect } from "vitest";
import { parseReferrer, parseUserAgent, generateVisitorHash } from "../src/lib/tracking";

describe("Tracking Utilities", () => {
  describe("parseReferrer", () => {
    it("handles null or empty referrers as Direct", () => {
      expect(parseReferrer(null)).toBe("Direct / None");
      expect(parseReferrer("")).toBe("Direct / None");
    });

    it("identifies major social and search platforms", () => {
      expect(parseReferrer("https://l.instagram.com/")).toBe("Instagram");
      expect(parseReferrer("https://t.co/abc123xyz")).toBe("Twitter / X");
      expect(parseReferrer("https://www.youtube.com/watch?v=123")).toBe("YouTube");
      expect(parseReferrer("https://www.linkedin.com/feed/")).toBe("LinkedIn");
      expect(parseReferrer("https://www.google.com/search?q=linktrace")).toBe("Google Search");
      expect(parseReferrer("https://web.whatsapp.com/")).toBe("WhatsApp");
    });

    it("formats custom domains cleanly", () => {
      expect(parseReferrer("https://www.medium.com/@author")).toBe("medium.com");
      expect(parseReferrer("https://producthunt.com/posts/linktrace")).toBe("producthunt.com");
    });
  });

  describe("parseUserAgent", () => {
    it("identifies Desktop Chrome on Windows", () => {
      const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const result = parseUserAgent(ua);
      expect(result.deviceType).toBe("desktop");
      expect(result.browser).toBe("Chrome");
      expect(result.os).toBe("Windows");
    });

    it("identifies Mobile Safari on iPhone", () => {
      const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
      const result = parseUserAgent(ua);
      expect(result.deviceType).toBe("mobile");
      expect(result.browser).toBe("Safari");
      expect(result.os).toBe("iOS");
    });

    it("identifies Tablet on iPad", () => {
      const ua = "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";
      const result = parseUserAgent(ua);
      expect(result.deviceType).toBe("tablet");
      expect(result.browser).toBe("Safari");
      expect(result.os).toBe("iOS");
    });
  });

  describe("generateVisitorHash", () => {
    it("produces deterministic hash for same IP and UA on the same day", () => {
      const h1 = generateVisitorHash("192.168.1.100", "Mozilla/5.0 Chrome/120");
      const h2 = generateVisitorHash("192.168.1.100", "Mozilla/5.0 Chrome/120");
      expect(h1).toBe(h2);
      expect(typeof h1).toBe("string");
    });

    it("produces different hashes for different IPs", () => {
      const h1 = generateVisitorHash("192.168.1.100", "Mozilla/5.0 Chrome/120");
      const h2 = generateVisitorHash("10.0.0.50", "Mozilla/5.0 Chrome/120");
      expect(h1).not.toBe(h2);
    });
  });
});
