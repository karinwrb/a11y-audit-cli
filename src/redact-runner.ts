import { getRedactConfig, isRedactEnabled } from './redact-config';

export function redactValue(value: string): string {
  return '[REDACTED]';
}

export function redactUrl(url: string): string {
  if (!isRedactEnabled()) return url;
  const { fields } = getRedactConfig();
  try {
    const parsed = new URL(url);
    let changed = false;
    for (const field of fields) {
      if (parsed.searchParams.has(field)) {
        parsed.searchParams.set(field, '[REDACTED]');
        changed = true;
      }
    }
    return changed ? parsed.toString() : url;
  } catch {
    return url;
  }
}

export function redactHeaders(
  headers: Record<string, string>
): Record<string, string> {
  if (!isRedactEnabled()) return headers;
  const { fields } = getRedactConfig();
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    const lower = key.toLowerCase();
    const matched = fields.some((f) => lower.includes(f.toLowerCase()));
    result[key] = matched ? redactValue(value) : value;
  }
  return result;
}

export function redactObject(
  obj: Record<string, unknown>
): Record<string, unknown> {
  if (!isRedactEnabled()) return obj;
  const { fields } = getRedactConfig();
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const matched = fields.some(
      (f) => key.toLowerCase() === f.toLowerCase()
    );
    result[key] = matched ? '[REDACTED]' : value;
  }
  return result;
}
