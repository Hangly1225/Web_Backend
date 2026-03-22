import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

@Injectable()
export class MemoryCacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  async getOrSet<T>(
    key: string,
    ttlMs: number,
    loader: () => Promise<T> | T,
  ): Promise<T> {
    const now = Date.now();
    const cached = this.store.get(key) as CacheEntry<T> | undefined;

    if (cached && cached.expiresAt > now) {
      return cached.value;
    }

    const value = await loader();
    this.store.set(key, {
      value,
      expiresAt: now + ttlMs,
    });
    return value;
  }

  delete(key: string) {
    this.store.delete(key);
  }

  deleteByPrefix(prefix: string) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }
}