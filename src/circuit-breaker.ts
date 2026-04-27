/**
 * Circuit breaker to prevent repeated requests to failing endpoints.
 * States: CLOSED (normal), OPEN (failing, reject fast), HALF_OPEN (testing recovery).
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold: number;  // failures before opening
  successThreshold: number;  // successes in HALF_OPEN before closing
  timeoutMs: number;         // ms before attempting recovery (HALF_OPEN)
}

export interface CircuitBreaker {
  state: CircuitState;
  failures: number;
  successes: number;
  openedAt: number | null;
  options: CircuitBreakerOptions;
}

export function createCircuitBreaker(options?: Partial<CircuitBreakerOptions>): CircuitBreaker {
  return {
    state: 'CLOSED',
    failures: 0,
    successes: 0,
    openedAt: null,
    options: {
      failureThreshold: options?.failureThreshold ?? 3,
      successThreshold: options?.successThreshold ?? 2,
      timeoutMs: options?.timeoutMs ?? 30_000,
    },
  };
}

export function isCircuitOpen(cb: CircuitBreaker): boolean {
  if (cb.state === 'OPEN') {
    const elapsed = Date.now() - (cb.openedAt ?? 0);
    if (elapsed >= cb.options.timeoutMs) {
      cb.state = 'HALF_OPEN';
      cb.successes = 0;
      return false;
    }
    return true;
  }
  return false;
}

export function recordSuccess(cb: CircuitBreaker): void {
  if (cb.state === 'HALF_OPEN') {
    cb.successes += 1;
    if (cb.successes >= cb.options.successThreshold) {
      cb.state = 'CLOSED';
      cb.failures = 0;
      cb.successes = 0;
      cb.openedAt = null;
    }
  } else if (cb.state === 'CLOSED') {
    cb.failures = 0;
  }
}

export function recordFailure(cb: CircuitBreaker): void {
  cb.failures += 1;
  if (cb.state === 'HALF_OPEN' || cb.failures >= cb.options.failureThreshold) {
    cb.state = 'OPEN';
    cb.openedAt = Date.now();
    cb.successes = 0;
  }
}

export async function runWithCircuitBreaker<T>(
  cb: CircuitBreaker,
  fn: () => Promise<T>
): Promise<T> {
  if (isCircuitOpen(cb)) {
    throw new Error(`Circuit breaker is OPEN for this endpoint. Retry after ${cb.options.timeoutMs}ms.`);
  }
  try {
    const result = await fn();
    recordSuccess(cb);
    return result;
  } catch (err) {
    recordFailure(cb);
    throw err;
  }
}
