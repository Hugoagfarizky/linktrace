import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters").max(80, "Campaign name is too long"),
  description: z.string().max(300, "Description must not exceed 300 characters").optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
