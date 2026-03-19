import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hashedKey] = storedHash.split(":");

  if (!salt || !hashedKey) {
    return false;
  }

  const keyBuffer = Buffer.from(hashedKey, "hex");

  if (keyBuffer.length !== KEY_LENGTH) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return timingSafeEqual(keyBuffer, derivedKey);
}
