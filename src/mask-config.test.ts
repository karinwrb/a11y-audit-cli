import {
  getMaskConfig,
  setMaskConfig,
  resetMaskConfig,
  isMaskEnabled,
  getMaskChar,
  getVisibleChars,
  getSensitiveFields,
  isMaskUrlsEnabled,
} from './mask-config';

beforeEach(() => resetMaskConfig());

describe('getMaskConfig', () => {
  it('returns default config', () => {
    const config = getMaskConfig();
    expect(config.enabled).toBe(false);
    expect(config.maskChar).toBe('*');
    expect(config.visibleChars).toBe(4);
    expect(config.sensitiveFields).toContain('token');
    expect(config.maskUrls).toBe(false);
  });
});

describe('setMaskConfig', () => {
  it('merges partial config', () => {
    setMaskConfig({ enabled: true, maskChar: '#' });
    const config = getMaskConfig();
    expect(config.enabled).toBe(true);
    expect(config.maskChar).toBe('#');
    expect(config.visibleChars).toBe(4);
  });

  it('overrides sensitiveFields', () => {
    setMaskConfig({ sensitiveFields: ['mySecret'] });
    expect(getSensitiveFields()).toEqual(['mySecret']);
  });
});

describe('resetMaskConfig', () => {
  it('restores defaults after mutation', () => {
    setMaskConfig({ enabled: true, maskChar: 'X', visibleChars: 2 });
    resetMaskConfig();
    expect(isMaskEnabled()).toBe(false);
    expect(getMaskChar()).toBe('*');
    expect(getVisibleChars()).toBe(4);
  });
});

describe('isMaskEnabled', () => {
  it('returns false by default', () => {
    expect(isMaskEnabled()).toBe(false);
  });

  it('returns true after enabling', () => {
    setMaskConfig({ enabled: true });
    expect(isMaskEnabled()).toBe(true);
  });
});

describe('getMaskChar', () => {
  it('returns default mask char', () => {
    expect(getMaskChar()).toBe('*');
  });
});

describe('getVisibleChars', () => {
  it('returns default visible chars', () => {
    expect(getVisibleChars()).toBe(4);
  });
});

describe('isMaskUrlsEnabled', () => {
  it('returns false by default', () => {
    expect(isMaskUrlsEnabled()).toBe(false);
  });

  it('returns true when set', () => {
    setMaskConfig({ maskUrls: true });
    expect(isMaskUrlsEnabled()).toBe(true);
  });
});
