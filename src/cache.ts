import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { AuditReport } from './types';

const CACHE_DIR = path.join(process.cwd(), '.a11y-cache');
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export function getCacheKey(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex');
}

export function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function readCache(url: string): AuditReport | null {
  const key = getCacheKey(url);
  const filePath = path.join(CACHE_DIR, `${key}.json`);

  if (!fs.existsSync(filePath)) return null;

  const stat = fs.statSync(filePath);
  const age = Date.now() - stat.mtimeMs;
  if (age > CACHE_TTL_MS) {
    fs.unlinkSync(filePath);
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as AuditReport;
  } catch {
    return null;
  }
}

export function writeCache(url: string, report: AuditReport): void {
  ensureCacheDir();
  const key = getCacheKey(url);
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
}

export function clearCache(): void {
  if (!fs.existsSync(CACHE_DIR)) return;
  const files = fs.readdirSync(CACHE_DIR);
  for (const file of files) {
    fs.unlinkSync(path.join(CACHE_DIR, file));
  }
}

/**
 * Returns cache statistics: total number of entries and count of expired entries.
 */
export function getCacheStats(): { total: number; expired: number } {
  if (!fs.existsSync(CACHE_DIR)) return { total: 0, expired: 0 };

  const files = fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith('.json'));
  let expired = 0;

  for (const file of files) {
    const stat = fs.statSync(path.join(CACHE_DIR, file));
    if (Date.now() - stat.mtimeMs > CACHE_TTL_MS) {
      expired++;
    }
  }

  return { total: files.length, expired };
}
