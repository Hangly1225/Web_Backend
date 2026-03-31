import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;
const HEX_PATTERN = /^[0-9a-f]+$/i;

export function isHashedPassword(password: string): boolean {
  const [salt, hash] = password.split(':');
  return Boolean(
    salt &&
      hash &&
      salt.length === 32 &&
      hash.length === KEY_LENGTH * 2 &&
      HEX_PATTERN.test(salt) &&
      HEX_PATTERN.test(hash),
  );
}

export function hashPassword(plainPassword: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plainPassword, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(
  plainPassword: string,
  storedPassword: string,
): boolean {
  if (!isHashedPassword(storedPassword)) {
    return false;
  }
  const [salt, hash] = storedPassword.split(':');

  const derived = scryptSync(plainPassword, salt, KEY_LENGTH);
  const original = Buffer.from(hash, 'hex');

  if (derived.length !== original.length) {
    return false;
  }

  return timingSafeEqual(derived, original);
}
