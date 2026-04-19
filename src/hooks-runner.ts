import { execSync } from 'child_process';
import { getHooksConfig, isHooksEnabled } from './hooks-config';

export interface HookContext {
  url: string;
  timestamp: number;
}

function runCommand(cmd: string, context: HookContext): void {
  const env = {
    ...process.env,
    HOOK_URL: context.url,
    HOOK_TIMESTAMP: String(context.timestamp),
  };
  execSync(cmd, { env, stdio: 'inherit' });
}

export function runBeforeHook(context: HookContext): void {
  if (!isHooksEnabled()) return;
  const { beforeScan } = getHooksConfig();
  if (!beforeScan) return;
  try {
    runCommand(beforeScan, context);
  } catch (err) {
    console.warn(`[hooks] beforeScan hook failed: ${(err as Error).message}`);
  }
}

export function runAfterHook(context: HookContext): void {
  if (!isHooksEnabled()) return;
  const { afterScan } = getHooksConfig();
  if (!afterScan) return;
  try {
    runCommand(afterScan, context);
  } catch (err) {
    console.warn(`[hooks] afterScan hook failed: ${(err as Error).message}`);
  }
}

export function buildHookContext(url: string): HookContext {
  return { url, timestamp: Date.now() };
}
