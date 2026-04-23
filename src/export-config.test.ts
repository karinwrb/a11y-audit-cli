import {
  getExportConfig,
  setExportConfig,
  resetExportConfig,
  isExportEnabled,
  getExportDestinations,
  isTimestampIncluded,
} from './export-config';

beforeEach(() => {
  resetExportConfig();
});

describe('getExportConfig', () => {
  it('returns default config', () => {
    const config = getExportConfig();
    expect(config.enabled).toBe(true);
    expect(config.destinations).toEqual(['file']);
    expect(config.includeTimestamp).toBe(true);
  });

  it('returns a copy, not the original', () => {
    const a = getExportConfig();
    const b = getExportConfig();
    expect(a).not.toBe(b);
  });
});

describe('setExportConfig', () => {
  it('updates enabled flag', () => {
    setExportConfig({ enabled: false });
    expect(isExportEnabled()).toBe(false);
  });

  it('updates destinations', () => {
    setExportConfig({ destinations: ['s3', 'stdout'] });
    expect(getExportDestinations()).toEqual(['s3', 'stdout']);
  });

  it('updates includeTimestamp', () => {
    setExportConfig({ includeTimestamp: false });
    expect(isTimestampIncluded()).toBe(false);
  });

  it('merges partial updates', () => {
    setExportConfig({ enabled: false });
    setExportConfig({ destinations: ['stdout'] });
    const config = getExportConfig();
    expect(config.enabled).toBe(false);
    expect(config.destinations).toEqual(['stdout']);
  });
});

describe('resetExportConfig', () => {
  it('restores defaults after changes', () => {
    setExportConfig({ enabled: false, destinations: ['s3'], includeTimestamp: false });
    resetExportConfig();
    expect(isExportEnabled()).toBe(true);
    expect(getExportDestinations()).toEqual(['file']);
    expect(isTimestampIncluded()).toBe(true);
  });
});

describe('getExportDestinations', () => {
  it('returns a copy of destinations array', () => {
    const a = getExportDestinations();
    const b = getExportDestinations();
    expect(a).not.toBe(b);
  });
});
