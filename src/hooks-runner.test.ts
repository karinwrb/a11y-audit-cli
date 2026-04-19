import { execSync } from 'child_process';
import { runBeforeHook, runAfterHook, buildHookContext } from './hooks-runner';
import { setHooksConfig, resetHooksConfig } from './hooks-config';

jest.mock('child_process', () => ({ execSync: jest.fn() }));
const mockExec = execSync as jest.Mock;

afterEach(() => {
  resetHooksConfig();
  mockExec.mockReset();
});

describe('buildHookContext', () => {
  it('creates context with url and timestamp', () => {
    const ctx = buildHookContext('https://example.com');
    expect(ctx.url).toBe('https://example.com');
    expect(typeof ctx.timestamp).toBe('number');
  });
});

describe('runBeforeHook', () => {
  it('does nothing when hooks disabled', () => {
    setHooksConfig({ enabled: false, beforeScan: 'echo before' });
    runBeforeHook(buildHookContext('https://example.com'));
    expect(mockExec).not.toHaveBeenCalled();
  });

  it('does nothing when no beforeScan command', () => {
    setHooksConfig({ enabled: true, beforeScan: undefined });
    runBeforeHook(buildHookContext('https://example.com'));
    expect(mockExec).not.toHaveBeenCalled();
  });

  it('executes beforeScan command when enabled', () => {
    setHooksConfig({ enabled: true, beforeScan: 'echo before' });
    runBeforeHook(buildHookContext('https://example.com'));
    expect(mockExec).toHaveBeenCalledWith('echo before', expect.objectContaining({ env: expect.objectContaining({ HOOK_URL: 'https://example.com' }) }));
  });

  it('warns but does not throw on command failure', () => {
    setHooksConfig({ enabled: true, beforeScan: 'bad-cmd' });
    mockExec.mockImplementation(() => { throw new Error('not found'); });
    expect(() => runBeforeHook(buildHookContext('https://x.com'))).not.toThrow();
  });
});

describe('runAfterHook', () => {
  it('executes afterScan command when enabled', () => {
    setHooksConfig({ enabled: true, afterScan: 'echo after' });
    runAfterHook(buildHookContext('https://example.com'));
    expect(mockExec).toHaveBeenCalledWith('echo after', expect.any(Object));
  });
});
