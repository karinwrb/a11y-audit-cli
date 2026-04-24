import {
  stripHtmlTags,
  normalizeWhitespace,
  truncateText,
  transformString,
  transformResult,
  transformAndCount,
} from './transform-runner';
import { setTransformConfig, resetTransformConfig } from './transform-config';
import type { AuditResult } from './types';

const makeResult = (message: string): AuditResult => ({
  ruleId: 'rule-1',
  impact: 'serious',
  message,
  helpUrl: 'https://example.com/rule-1',
  nodes: [],
});

beforeEach(() => {
  resetTransformConfig();
});

test('stripHtmlTags removes html tags', () => {
  expect(stripHtmlTags('<b>bold</b> text')).toBe('bold text');
});

test('normalizeWhitespace collapses spaces', () => {
  expect(normalizeWhitespace('  hello   world  ')).toBe('hello world');
});

test('truncateText truncates long strings', () => {
  expect(truncateText('hello world', 5)).toBe('hello...');
});

test('truncateText leaves short strings unchanged', () => {
  expect(truncateText('hi', 10)).toBe('hi');
});

test('transformString is no-op when disabled', () => {
  const result = transformString('<b>test</b>  message');
  expect(result).toBe('<b>test</b>  message');
});

test('transformString strips html when enabled', () => {
  setTransformConfig({ enabled: true, stripHtml: true });
  expect(transformString('<b>test</b>')).toBe('test');
});

test('transformString normalizes whitespace when enabled', () => {
  setTransformConfig({ enabled: true, normalizeWhitespace: true });
  expect(transformString('  hello   world  ')).toBe('hello world');
});

test('transformString truncates when length set', () => {
  setTransformConfig({ enabled: true, truncateLength: 4 });
  expect(transformString('hello world')).toBe('hell...');
});

test('transformResult transforms message field', () => {
  setTransformConfig({ enabled: true, stripHtml: true });
  const result = transformResult(makeResult('<b>bad</b> heading'));
  expect(result.message).toBe('bad heading');
});

test('transformAndCount counts changed results', () => {
  setTransformConfig({ enabled: true, stripHtml: true });
  const results = [makeResult('<b>issue</b>'), makeResult('plain text')];
  const { results: out, transformedCount } = transformAndCount(results);
  expect(transformedCount).toBe(1);
  expect(out[0].message).toBe('issue');
});

test('transformAndCount returns original when disabled', () => {
  const results = [makeResult('<b>issue</b>')];
  const { results: out, transformedCount } = transformAndCount(results);
  expect(transformedCount).toBe(0);
  expect(out).toBe(results);
});
