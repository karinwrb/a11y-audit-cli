import * as fs from 'fs';
import * as path from 'path';
import {
  initCheckpoint,
  loadCheckpoint,
  saveCheckpoint,
  markUrlComplete,
  clearCheckpoint,
  getRemainingUrls,
} from './checkpoint-runner';
import { setCheckpointConfig, resetCheckpointConfig } from './checkpoint-config';

const TEST_DIR = '.test-checkpoints';
const RUN_ID = 'test-run-001';

beforeEach(() => {
  setCheckpointConfig({ enabled: true, checkpointDir: TEST_DIR, resumeOnRestart: true });
});

afterEach(() => {
  clearCheckpoint(RUN_ID);
  if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
  resetCheckpointConfig();
});

test('initCheckpoint creates state with all urls pending', () => {
  const urls = ['https://a.com', 'https://b.com'];
  const state = initCheckpoint(RUN_ID, urls);
  expect(state.pendingUrls).toEqual(urls);
  expect(state.completedUrls).toEqual([]);
});

test('loadCheckpoint returns null when file does not exist', () => {
  const result = loadCheckpoint('nonexistent-run');
  expect(result).toBeNull();
});

test('saveCheckpoint and loadCheckpoint round-trip', () => {
  const state = initCheckpoint(RUN_ID, ['https://x.com']);
  const loaded = loadCheckpoint(RUN_ID);
  expect(loaded).not.toBeNull();
  expect(loaded!.pendingUrls).toEqual(['https://x.com']);
});

test('markUrlComplete moves url from pending to completed', () => {
  initCheckpoint(RUN_ID, ['https://a.com', 'https://b.com']);
  markUrlComplete(RUN_ID, 'https://a.com');
  const state = loadCheckpoint(RUN_ID)!;
  expect(state.completedUrls).toContain('https://a.com');
  expect(state.pendingUrls).not.toContain('https://a.com');
});

test('getRemainingUrls excludes completed urls', () => {
  const state = initCheckpoint(RUN_ID, ['https://a.com', 'https://b.com']);
  state.completedUrls.push('https://a.com');
  const remaining = getRemainingUrls(state);
  expect(remaining).toEqual(['https://b.com']);
});

test('initCheckpoint resumes existing state when resumeOnRestart is true', () => {
  initCheckpoint(RUN_ID, ['https://a.com', 'https://b.com']);
  markUrlComplete(RUN_ID, 'https://a.com');
  const resumed = initCheckpoint(RUN_ID, ['https://a.com', 'https://b.com']);
  expect(resumed.completedUrls).toContain('https://a.com');
});

test('clearCheckpoint removes the checkpoint file', () => {
  initCheckpoint(RUN_ID, ['https://a.com']);
  clearCheckpoint(RUN_ID);
  expect(loadCheckpoint(RUN_ID)).toBeNull();
});

test('loadCheckpoint returns null when disabled', () => {
  setCheckpointConfig({ enabled: false });
  const state = initCheckpoint(RUN_ID, ['https://a.com']);
  expect(loadCheckpoint(RUN_ID)).toBeNull();
});
