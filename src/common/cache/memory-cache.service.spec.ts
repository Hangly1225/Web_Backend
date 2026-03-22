import { MemoryCacheService } from './memory-cache.service';

describe('MemoryCacheService', () => {
  it('returns cached values within the TTL window', async () => {
    const service = new MemoryCacheService();
    let loadCount = 0;

    const first = await service.getOrSet('products:1', 1_000, () => {
      loadCount += 1;
      return { value: 'cached' };
    });

    const second = await service.getOrSet('products:1', 1_000, () => {
      loadCount += 1;
      return { value: 'fresh' };
    });

    expect(first).toEqual({ value: 'cached' });
    expect(second).toEqual({ value: 'cached' });
    expect(loadCount).toBe(1);
  });

  it('invalidates all matching keys by prefix', async () => {
    const service = new MemoryCacheService();
    let loadCount = 0;

    await service.getOrSet('products:item:1', 1_000, () => {
      loadCount += 1;
      return { value: 'old' };
    });

    service.deleteByPrefix('products:');

    const reloaded = await service.getOrSet('products:item:1', 1_000, () => {
      loadCount += 1;
      return { value: 'new' };
    });

    expect(reloaded).toEqual({ value: 'new' });
    expect(loadCount).toBe(2);
  });
});