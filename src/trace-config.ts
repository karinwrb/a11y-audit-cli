export interface TraceConfig {
  enabled: boolean;
  includeTimings: boolean;
  includeHeaders: boolean;
  traceIdHeader: string;
}

const DEFAULT_TRACE_CONFIG: TraceConfig = {
  enabled: false,
  includeTimings: true,
  includeHeaders: false,
  traceIdHeader: 'X-Trace-Id',
};

let current: TraceConfig = { ...DEFAULT_TRACE_CONFIG };

export function getTraceConfig(): TraceConfig {
  return { ...current };
}

export function setTraceConfig(config: Partial<TraceConfig>): void {
  current = { ...current, ...config };
}

export function resetTraceConfig(): void {
  current = { ...DEFAULT_TRACE_CONFIG };
}

export function isTraceEnabled(): boolean {
  return current.enabled;
}

export function isTimingsEnabled(): boolean {
  return current.includeTimings;
}

export function isHeadersTraced(): boolean {
  return current.includeHeaders;
}

export function getTraceIdHeader(): string {
  return current.traceIdHeader;
}
