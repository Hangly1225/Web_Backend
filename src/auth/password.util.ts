import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(plainPassword: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plainPassword, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(
  plainPassword: string,
  storedPassword: string,
): boolean {
  const [salt, hash] = storedPassword.split(':');

  if (!salt || !hash) {
    return plainPassword === storedPassword;
  }

  const derived = scryptSync(plainPassword, salt, KEY_LENGTH);
  const original = Buffer.from(hash, 'hex');

  if (derived.length !== original.length) {
    return false;
  }

  return timingSafeEqual(derived, original);
}