import {
  createCircuitBreaker,
  isCircuitOpen,
  recordSuccess,
  recordFailure,
  runWithCircuitBreaker,
} from './circuit-breaker';

describe('createCircuitBreaker', () => {
  it('starts in CLOSED state with zero counts', () => {
    const cb = createCircuitBreaker();
    expect(cb.state).toBe('CLOSED');
    expect(cb.failures).toBe(0);
    expect(cb.successes).toBe(0);
    expect(cb.openedAt).toBeNull();
  });

  it('accepts custom options', () => {
    const cb = createCircuitBreaker({ failureThreshold: 5, timeoutMs: 10_000 });
    expect(cb.options.failureThreshold).toBe(5);
    expect(cb.options.timeoutMs).toBe(10_000);
  });
});

describe('recordFailure', () => {
  it('opens the circuit after reaching failure threshold', () => {
    const cb = createCircuitBreaker({ failureThreshold: 2 });
    recordFailure(cb);
    expect(cb.state).toBe('CLOSED');
    recordFailure(cb);
    expect(cb.state).toBe('OPEN');
    expect(cb.openedAt).not.toBeNull();
  });

  it('immediately opens circuit when failing in HALF_OPEN state', () => {
    const cb = createCircuitBreaker();
    cb.state = 'HALF_OPEN';
    recordFailure(cb);
    expect(cb.state).toBe('OPEN');
  });
});

describe('recordSuccess', () => {
  it('closes circuit after enough successes in HALF_OPEN', () => {
    const cb = createCircuitBreaker({ successThreshold: 2 });
    cb.state = 'HALF_OPEN';
    recordSuccess(cb);
    expect(cb.state).toBe('HALF_OPEN');
    recordSuccess(cb);
    expect(cb.state).toBe('CLOSED');
    expect(cb.failures).toBe(0);
  });

  it('resets failures on success in CLOSED state', () => {
    const cb = createCircuitBreaker();
    cb.failures = 2;
    recordSuccess(cb);
    expect(cb.failures).toBe(0);
  });
});

describe('isCircuitOpen', () => {
  it('returns true when OPEN and timeout not elapsed', () => {
    const cb = createCircuitBreaker({ timeoutMs: 60_000 });
    cb.state = 'OPEN';
    cb.openedAt = Date.now();
    expect(isCircuitOpen(cb)).toBe(true);
  });

  it('transitions to HALF_OPEN when timeout has elapsed', () => {
    const cb = createCircuitBreaker({ timeoutMs: 100 });
    cb.state = 'OPEN';
    cb.openedAt = Date.now() - 200;
    expect(isCircuitOpen(cb)).toBe(false);
    expect(cb.state).toBe('HALF_OPEN');
  });
});

describe('runWithCircuitBreaker', () => {
  it('executes fn and records success', async () => {
    const cb = createCircuitBreaker();
    const result = await runWithCircuitBreaker(cb, async () => 'ok');
    expect(result).toBe('ok');
    expect(cb.failures).toBe(0);
  });

  it('records failure and re-throws on fn error', async () => {
    const cb = createCircuitBreaker({ failureThreshold: 1 });
    await expect(runWithCircuitBreaker(cb, async () => { throw new Error('fail'); })).rejects.toThrow('fail');
    expect(cb.state).toBe('OPEN');
  });

  it('throws immediately when circuit is OPEN', async () => {
    const cb = createCircuitBreaker({ timeoutMs: 60_000 });
    cb.state = 'OPEN';
    cb.openedAt = Date.now();
    await expect(runWithCircuitBreaker(cb, async () => 'ok')).rejects.toThrow('Circuit breaker is OPEN');
  });
});
