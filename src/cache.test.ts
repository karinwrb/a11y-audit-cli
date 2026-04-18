import * as fs from 'fs';
import * as path from 'path';
import { getCacheKey, readCache, writeCache, clearCache } from './cache';
import { AuditReport } from './types';

const CACHE_DIR = path.join(process.cwd(), '.a11y-cache');

const mockReport: AuditReport = {
  url: 'https://example.com',
  timestamp: new Date().toISOString(),
  score: 85,
  results: [],
  summary: { total: 0, critical: 0, serious: 0, moderate: 0, minor: 0 },
};

afterEach(() => {
  clearCache();
});

describe('getCacheKey', () => {
  it('returns consistent md5 hash for same url', () => {
    const key1 = getCacheKey('https://example.com');
    const key2 = getCacheKey('https://example.com');
    expect(key1).toBe(key2);
  });

  it('returns different keys for different urls', () => {
    const key1 = getCacheKey('https://example.com');
    const key2 = getCacheKey('https://other.com');
    expect(key1).not.toBe(key2);
  });
});

describe('writeCache and readCache', () => {
  it('writes and reads a report correctly', () => {
    writeCache('https://example.com', mockReport);
    const result = readCache('https://example.com');
    expect(result).not.toBeNull();
    expect(result?.url).toBe('https://example.com');
    expect(result?.score).toBe(85);
  });

  it('returns null for uncached url', () => {
    const result = readCache('https://notcached.com');
    expect(result).toBeNull();
  });

  it('returns null for expired cache', () => {
    writeCache('https://example.com', mockReport);
    const key = getCacheKey('https://example.com');
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const oldTime = Date.now() - 1000 * 60 * 61;
    fs.utimesSync(filePath, oldTime / 1000, oldTime / 1000);
    const result = readCache('https://example.com');
    expect(result).toBeNull();
  });
});

describe('clearCache', () => {
  it('removes all cached files', () => {
    writeCache('https://example.com', mockReport);
    writeCache('https://other.com', mockReport);
    clearCache();
    expect(fs.readdirSync(CACHE_DIR).length).toBe(0);
  });

  it('does not throw if cache dir does not exist', () => {
    expect(() => clearCache()).not.toThrow();
  });
});
