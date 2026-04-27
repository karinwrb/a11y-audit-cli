import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTagConfig,
  setTagConfig,
  resetTagConfig,
  isTagFilterEnabled,
  getFilterTags,
  isMatchAll,
} from './tag-config';

beforeEach(() => resetTagConfig());

describe('getTagConfig', () => {
  it('returns default config', () => {
    const cfg = getTagConfig();
    expect(cfg.enabled).toBe(false);
    expect(cfg.tags).toEqual([]);
    expect(cfg.matchAll).toBe(false);
  });
});

describe('setTagConfig', () => {
  it('merges partial config', () => {
    setTagConfig({ enabled: true, tags: ['wcag2a'] });
    const cfg = getTagConfig();
    expect(cfg.enabled).toBe(true);
    expect(cfg.tags).toEqual(['wcag2a']);
    expect(cfg.matchAll).toBe(false);
  });
});

describe('isTagFilterEnabled', () => {
  it('returns false when disabled', () => {
    expect(isTagFilterEnabled()).toBe(false);
  });

  it('returns false when enabled but no tags', () => {
    setTagConfig({ enabled: true });
    expect(isTagFilterEnabled()).toBe(false);
  });

  it('returns true when enabled with tags', () => {
    setTagConfig({ enabled: true, tags: ['wcag2a'] });
    expect(isTagFilterEnabled()).toBe(true);
  });
});

describe('getFilterTags', () => {
  it('returns a copy of tags', () => {
    setTagConfig({ tags: ['a', 'b'] });
    const tags = getFilterTags();
    tags.push('c');
    expect(getFilterTags()).toHaveLength(2);
  });
});

describe('isMatchAll', () => {
  it('returns false by default', () => {
    expect(isMatchAll()).toBe(false);
  });

  it('returns true when set', () => {
    setTagConfig({ matchAll: true });
    expect(isMatchAll()).toBe(true);
  });
});
