import { z } from "zod";

export const utmBuilderSchema = z.object({
  url: z.string().url("Please enter a valid website URL"),
  source: z.string().min(1, "Campaign source is required (e.g., google, newsletter)"),
  medium: z.string().min(1, "Campaign medium is required (e.g., cpc, email, social)"),
  campaign: z.string().min(1, "Campaign name is required (e.g., summer_sale)"),
  term: z.string().optional(),
  content: z.string().optional(),
});

export type UtmBuilderInput = z.infer<typeof utmBuilderSchema>;

export function buildUtmUrl(data: UtmBuilderInput): string {
  const parsed = new URL(data.url);
  parsed.searchParams.set("utm_source", data.source.trim());
  parsed.searchParams.set("utm_medium", data.medium.trim());
  parsed.searchParams.set("utm_campaign", data.campaign.trim());
  if (data.term?.trim()) parsed.searchParams.set("utm_term", data.term.trim());
  if (data.content?.trim()) parsed.searchParams.set("utm_content", data.content.trim());
  return parsed.toString();
}
