import {
  getAlertConfig,
  setAlertConfig,
  resetAlertConfig,
  isAlertEnabled,
  isAlertOnCritical,
  getAlertScoreThreshold,
  isAlertOnNewViolations,
  getAlertChannels,
} from './alert-config';

beforeEach(() => {
  resetAlertConfig();
});

describe('getAlertConfig', () => {
  it('returns defaults', () => {
    const cfg = getAlertConfig();
    expect(cfg.enabled).toBe(false);
    expect(cfg.onCritical).toBe(true);
    expect(cfg.onScoreBelow).toBeNull();
    expect(cfg.onNewViolations).toBe(false);
    expect(cfg.channels).toEqual([]);
  });
});

describe('setAlertConfig', () => {
  it('merges partial overrides', () => {
    setAlertConfig({ enabled: true, channels: ['slack'] });
    const cfg = getAlertConfig();
    expect(cfg.enabled).toBe(true);
    expect(cfg.channels).toEqual(['slack']);
    expect(cfg.onCritical).toBe(true);
  });

  it('sets score threshold', () => {
    setAlertConfig({ onScoreBelow: 80 });
    expect(getAlertScoreThreshold()).toBe(80);
  });
});

describe('resetAlertConfig', () => {
  it('restores defaults after changes', () => {
    setAlertConfig({ enabled: true, onScoreBelow: 50 });
    resetAlertConfig();
    expect(isAlertEnabled()).toBe(false);
    expect(getAlertScoreThreshold()).toBeNull();
  });
});

describe('helpers', () => {
  it('isAlertOnCritical returns true by default', () => {
    expect(isAlertOnCritical()).toBe(true);
  });

  it('isAlertOnNewViolations returns false by default', () => {
    expect(isAlertOnNewViolations()).toBe(false);
  });

  it('getAlertChannels returns a copy', () => {
    setAlertConfig({ channels: ['email', 'pagerduty'] });
    const ch = getAlertChannels();
    ch.push('extra');
    expect(getAlertChannels()).toEqual(['email', 'pagerduty']);
  });
});
