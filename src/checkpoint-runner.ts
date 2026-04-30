import * as fs from 'fs';
import * as path from 'path';
import { getCheckpointConfig, isCheckpointEnabled } from './checkpoint-config';

export interface CheckpointState {
  completedUrls: string[];
  pendingUrls: string[];
  startedAt: string;
  updatedAt: string;
}

export function buildCheckpointPath(runId: string): string {
  const { checkpointDir } = getCheckpointConfig();
  return path.join(checkpointDir, `${runId}.json`);
}

export function loadCheckpoint(runId: string): CheckpointState | null {
  if (!isCheckpointEnabled()) return null;
  const filePath = buildCheckpointPath(runId);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as CheckpointState;
  } catch {
    return null;
  }
}

export function saveCheckpoint(runId: string, state: CheckpointState): void {
  if (!isCheckpointEnabled()) return;
  const filePath = buildCheckpointPath(runId);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2));
}

export function markUrlComplete(runId: string, url: string): void {
  const state = loadCheckpoint(runId);
  if (!state) return;
  if (!state.completedUrls.includes(url)) {
    state.completedUrls.push(url);
  }
  state.pendingUrls = state.pendingUrls.filter(u => u !== url);
  saveCheckpoint(runId, state);
}

export function initCheckpoint(runId: string, urls: string[]): CheckpointState {
  const existing = loadCheckpoint(runId);
  if (existing && getCheckpointConfig().resumeOnRestart) {
    return existing;
  }
  const state: CheckpointState = {
    completedUrls: [],
    pendingUrls: [...urls],
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveCheckpoint(runId, state);
  return state;
}

export function clearCheckpoint(runId: string): void {
  const filePath = buildCheckpointPath(runId);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function getRemainingUrls(state: CheckpointState): string[] {
  return state.pendingUrls.filter(u => !state.completedUrls.includes(u));
}
