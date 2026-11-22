import { describe, it, expect } from "vitest";
import { buildUtmUrl, utmBuilderSchema } from "../src/lib/validations/utm";

describe("UTM Builder", () => {
  it("generates a valid UTM URL with required parameters", () => {
    const result = buildUtmUrl({
      url: "https://example.com/pricing",
      source: "google",
      medium: "cpc",
      campaign: "spring_sale",
    });

    const parsed = new URL(result);
    expect(parsed.origin).toBe("https://example.com");
    expect(parsed.pathname).toBe("/pricing");
    expect(parsed.searchParams.get("utm_source")).toBe("google");
    expect(parsed.searchParams.get("utm_medium")).toBe("cpc");
    expect(parsed.searchParams.get("utm_campaign")).toBe("spring_sale");
    expect(parsed.searchParams.get("utm_term")).toBeNull();
    expect(parsed.searchParams.get("utm_content")).toBeNull();
  });

  it("attaches optional term and content parameters", () => {
    const result = buildUtmUrl({
      url: "https://example.com/blog",
      source: "newsletter",
      medium: "email",
      campaign: "digest_24",
      term: "saas_metrics",
      content: "hero_cta",
    });

    const parsed = new URL(result);
    expect(parsed.searchParams.get("utm_term")).toBe("saas_metrics");
    expect(parsed.searchParams.get("utm_content")).toBe("hero_cta");
  });

  it("preserves existing query parameters on the target URL", () => {
    const result = buildUtmUrl({
      url: "https://example.com/checkout?ref=partner123&discount=10",
      source: "partner",
      medium: "affiliate",
      campaign: "referral_program",
    });

    const parsed = new URL(result);
    expect(parsed.searchParams.get("ref")).toBe("partner123");
    expect(parsed.searchParams.get("discount")).toBe("10");
    expect(parsed.searchParams.get("utm_source")).toBe("partner");
    expect(parsed.searchParams.get("utm_medium")).toBe("affiliate");
  });

  it("validates schema correctly", () => {
    const valid = utmBuilderSchema.safeParse({
      url: "https://linktrace.dev",
      source: "twitter",
      medium: "social",
      campaign: "launch",
    });
    expect(valid.success).toBe(true);

    const invalidUrl = utmBuilderSchema.safeParse({
      url: "not-a-valid-url",
      source: "twitter",
      medium: "social",
      campaign: "launch",
    });
    expect(invalidUrl.success).toBe(false);

    const missingRequired = utmBuilderSchema.safeParse({
      url: "https://linktrace.dev",
      source: "",
      medium: "social",
      campaign: "launch",
    });
    expect(missingRequired.success).toBe(false);
  });
});
