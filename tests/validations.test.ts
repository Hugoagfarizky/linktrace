import { describe, it, expect } from "vitest";
import { createLinkSchema, updateLinkSchema } from "../src/lib/validations/link";
import { createCampaignSchema } from "../src/lib/validations/campaign";
import { createWorkspaceSchema } from "../src/lib/validations/workspace";
import { registerSchema, loginSchema } from "../src/lib/validations/auth";

describe("Validation Schemas", () => {
  describe("Link Validations", () => {
    it("validates valid link creation inputs", () => {
      const res = createLinkSchema.safeParse({
        destinationUrl: "https://example.com/target",
        shortCode: "my-alias_99",
        title: "Test Link",
      });
      expect(res.success).toBe(true);
    });

    it("rejects invalid destination URL", () => {
      const res = createLinkSchema.safeParse({
        destinationUrl: "not-a-valid-url",
      });
      expect(res.success).toBe(false);
    });

    it("rejects alias with illegal characters or too short", () => {
      const invalidChars = createLinkSchema.safeParse({
        destinationUrl: "https://example.com",
        shortCode: "invalid alias with spaces!",
      });
      expect(invalidChars.success).toBe(false);

      const tooShort = createLinkSchema.safeParse({
        destinationUrl: "https://example.com",
        shortCode: "ab",
      });
      expect(tooShort.success).toBe(false);
    });
  });

  describe("Workspace Validations", () => {
    it("validates slug with lowercase alphanumeric and hyphens", () => {
      const valid = createWorkspaceSchema.safeParse({
        name: "My Team",
        slug: "my-team-12",
      });
      expect(valid.success).toBe(true);

      const invalidUppercase = createWorkspaceSchema.safeParse({
        name: "My Team",
        slug: "MyTeam",
      });
      expect(invalidUppercase.success).toBe(false);
    });
  });

  describe("Auth Validations", () => {
    it("validates registration with min 8 char password", () => {
      const valid = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "securepassword123",
      });
      expect(valid.success).toBe(true);

      const shortPassword = registerSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        password: "short",
      });
      expect(shortPassword.success).toBe(false);
    });

    it("validates login schema", () => {
      const valid = loginSchema.safeParse({
        email: "user@test.com",
        password: "password123",
      });
      expect(valid.success).toBe(true);
    });
  });
});
