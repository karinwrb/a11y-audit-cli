/**
 * Cooldown runner: tracks the last audit time per URL and enforces
 * a minimum delay before allowing a repeat audit.
 */

import { getCooldownMs, isCooldownEnabled } from './cooldown-config';

/** Maps URL -> timestamp (ms) of last completed audit */
const lastAuditTime = new Map<string, number>();

/**
 * Returns the remaining cooldown in ms for the given URL.
 * Returns 0 if no cooldown is active.
 */
export function getRemainingCooldown(url: string): number {
  if (!isCooldownEnabled()) return 0;
  const last = lastAuditTime.get(url);
  if (last === undefined) return 0;
  const elapsed = Date.now() - last;
  const remaining = getCooldownMs() - elapsed;
  return remaining > 0 ? remaining : 0;
}

/**
 * Returns true when the URL is still within its cooldown window.
 */
export function isOnCooldown(url: string): boolean {
  return getRemainingCooldown(url) > 0;
}

/**
 * Records that an audit for the given URL just completed.
 */
export function recordAudit(url: string): void {
  lastAuditTime.set(url, Date.now());
}

/**
 * Clears the cooldown record for a specific URL.
 */
export function clearCooldown(url: string): void {
  lastAuditTime.delete(url);
}

/**
 * Resets all cooldown state (useful in tests).
 */
export function clearAllCooldowns(): void {
  lastAuditTime.clear();
}

/**
 * If the URL is on cooldown, waits until the cooldown expires,
 * then records a new audit timestamp. Otherwise records immediately.
 */
export async function enforceCooldown(url: string): Promise<void> {
  const wait = getRemainingCooldown(url);
  if (wait > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, wait));
  }
  recordAudit(url);
}

export function formatCooldownSummary(url: string): string {
  const remaining = getRemainingCooldown(url);
  if (remaining <= 0) return `[cooldown] ${url}: ready`;
  return `[cooldown] ${url}: ${remaining}ms remaining`;
}
