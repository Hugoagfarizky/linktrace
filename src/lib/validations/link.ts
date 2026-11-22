import { z } from "zod";

export const createLinkSchema = z.object({
  destinationUrl: z
    .string()
    .url("Please enter a valid URL including http:// or https://")
    .max(2048, "URL is too long"),
  shortCode: z
    .string()
    .min(3, "Custom alias must be at least 3 characters")
    .max(30, "Custom alias must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Alias can only contain letters, numbers, hyphens and underscores")
    .optional()
    .or(z.literal("")),
  title: z.string().max(100, "Title must not exceed 100 characters").optional(),
  description: z.string().max(500, "Description must not exceed 500 characters").optional(),
  campaignId: z.string().cuid().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const updateLinkSchema = createLinkSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
