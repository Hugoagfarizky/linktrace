import { describe, it, expect } from "vitest";
import { generateShortCode, RESERVED_PATHS } from "../src/lib/nanoid";

describe("Short Code Generator", () => {
  it("generates a 6-character short code by default", () => {
    const code = generateShortCode();
    expect(code).toHaveLength(6);
    expect(typeof code).toBe("string");
  });

  it("generates custom length short codes", () => {
    const code8 = generateShortCode(8);
    expect(code8).toHaveLength(8);

    const code10 = generateShortCode(10);
    expect(code10).toHaveLength(10);
  });

  it("produces collision-resistant unique values", () => {
    const set = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const code = generateShortCode();
      expect(set.has(code)).toBe(false);
      set.add(code);
    }
    expect(set.size).toBe(500);
  });

  it("never generates a reserved system route", () => {
    for (let i = 0; i < 200; i++) {
      const code = generateShortCode();
      expect(RESERVED_PATHS.has(code.toLowerCase())).toBe(false);
    }
  });
});
