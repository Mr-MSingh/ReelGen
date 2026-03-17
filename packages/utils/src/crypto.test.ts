import { describe, expect, it } from "vitest";
import { decryptText, encryptText } from "./crypto";

describe("crypto helpers", () => {
  it("round-trips payloads", () => {
    process.env.ENCRYPTION_KEY =
      "0000000000000000000000000000000000000000000000000000000000000000";
    const input = "token-123";
    const encrypted = encryptText(input);
    const output = decryptText(encrypted);
    expect(output).toBe(input);
  });
});
