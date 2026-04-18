import {
  registerPlugin,
  unregisterPlugin,
  getRegisteredPlugins,
  applyPlugins,
} from './plugin-runner';
import { setPluginConfig, resetPluginConfig } from './plugin-config';
import { AuditResult } from './types';

const makeResult = (id: string): AuditResult => ({
  id,
  description: 'desc',
  impact: 'minor',
  severity: 'low',
  wcagCriteria: '1.1.1',
  fixSuggestion: 'fix it',
  passed: false,
});

beforeEach(() => {
  resetPluginConfig();
  ['tag-adder', 'id-prefixer'].forEach(unregisterPlugin);
});

test('returns results unchanged when plugins disabled', () => {
  const results = [makeResult('r1')];
  expect(applyPlugins(results)).toEqual(results);
});

test('applies registered plugin transform', () => {
  registerPlugin('tag-adder', (rs) => rs.map((r) => ({ ...r, id: r.id + '-tagged' })));
  setPluginConfig({ enabled: true, plugins: ['tag-adder'] });
  const out = applyPlugins([makeResult('r1')]);
  expect(out[0].id).toBe('r1-tagged');
});

test('skips unregistered plugin with warning', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  setPluginConfig({ enabled: true, plugins: ['missing'] });
  const results = [makeResult('r1')];
  expect(applyPlugins(results)).toEqual(results);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('missing'));
  warn.mockRestore();
});

test('chains multiple plugins in order', () => {
  registerPlugin('id-prefixer', (rs) => rs.map((r) => ({ ...r, id: 'pfx-' + r.id })));
  registerPlugin('tag-adder', (rs) => rs.map((r) => ({ ...r, id: r.id + '-tagged' })));
  setPluginConfig({ enabled: true, plugins: ['id-prefixer', 'tag-adder'] });
  const out = applyPlugins([makeResult('r1')]);
  expect(out[0].id).toBe('pfx-r1-tagged');
});

test('getRegisteredPlugins lists registered names', () => {
  registerPlugin('tag-adder', (rs) => rs);
  expect(getRegisteredPlugins()).toContain('tag-adder');
});
