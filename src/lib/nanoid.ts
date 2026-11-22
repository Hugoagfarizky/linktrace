const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const RESERVED_PATHS = new Set([
  "api",
  "login",
  "register",
  "dashboard",
  "links",
  "campaigns",
  "analytics",
  "utm",
  "settings",
  "favicon.ico",
  "_next",
  "robots.txt",
  "sitemap.xml",
]);

export function generateShortCode(length = 6): string {
  let result = "";
  const cryptoObj = typeof crypto !== "undefined" ? crypto : require("crypto");
  const randomBytes = new Uint8Array(length);
  cryptoObj.getRandomValues(randomBytes);

  for (let i = 0; i < length; i++) {
    result += ALPHABET[randomBytes[i] % ALPHABET.length];
  }

  // Ensure it doesn't accidentally collide with reserved routes
  if (RESERVED_PATHS.has(result.toLowerCase())) {
    return generateShortCode(length);
  }

  return result;
}
