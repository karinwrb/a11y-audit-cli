import {
  getAuthConfig,
  setAuthConfig,
  resetAuthConfig,
  isAuthEnabled,
  getBearerToken,
  getBasicCredentials,
  buildAuthHeaders,
} from './auth-config';

beforeEach(() => {
  resetAuthConfig();
});

test('defaults to disabled', () => {
  expect(isAuthEnabled()).toBe(false);
  expect(getBearerToken()).toBeUndefined();
  expect(getBasicCredentials()).toBeUndefined();
});

test('setAuthConfig updates fields', () => {
  setAuthConfig({ enabled: true, bearerToken: 'tok123' });
  expect(isAuthEnabled()).toBe(true);
  expect(getBearerToken()).toBe('tok123');
});

test('buildAuthHeaders returns empty when disabled', () => {
  setAuthConfig({ bearerToken: 'tok' });
  expect(buildAuthHeaders()).toEqual({});
});

test('buildAuthHeaders returns bearer header', () => {
  setAuthConfig({ enabled: true, bearerToken: 'mytoken' });
  expect(buildAuthHeaders()).toEqual({ Authorization: 'Bearer mytoken' });
});

test('buildAuthHeaders returns basic header', () => {
  setAuthConfig({ enabled: true, basicUser: 'admin', basicPass: 'secret' });
  const headers = buildAuthHeaders();
  expect(headers['Authorization']).toMatch(/^Basic /);
  const decoded = Buffer.from(headers['Authorization'].slice(6), 'base64').toString();
  expect(decoded).toBe('admin:secret');
});

test('getBasicCredentials returns undefined if incomplete', () => {
  setAuthConfig({ enabled: true, basicUser: 'admin' });
  expect(getBasicCredentials()).toBeUndefined();
});

test('resetAuthConfig restores defaults', () => {
  setAuthConfig({ enabled: true, bearerToken: 'tok' });
  resetAuthConfig();
  expect(isAuthEnabled()).toBe(false);
  expect(getBearerToken()).toBeUndefined();
});

test('getAuthConfig returns copy', () => {
  setAuthConfig({ enabled: true });
  const cfg = getAuthConfig();
  cfg.enabled = false;
  expect(isAuthEnabled()).toBe(true);
});
