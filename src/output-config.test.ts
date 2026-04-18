import {
  getOutputConfig,
  setOutputConfig,
  resetOutputConfig,
  getFormat,
  isVerbose,
  isColorEnabled,
  getOutputDir,
} from './output-config';

beforeEach(() => {
  resetOutputConfig();
});

describe('getOutputConfig', () => {
  it('returns defaults', () => {
    const config = getOutputConfig();
    expect(config.format).toBe('text');
    expect(config.verbose).toBe(false);
    expect(config.color).toBe(true);
    expect(config.outputDir).toBe('./reports');
  });
});

describe('setOutputConfig', () => {
  it('merges partial config', () => {
    setOutputConfig({ format: 'json', verbose: true });
    const config = getOutputConfig();
    expect(config.format).toBe('json');
    expect(config.verbose).toBe(true);
    expect(config.color).toBe(true);
  });
});

describe('resetOutputConfig', () => {
  it('restores defaults', () => {
    setOutputConfig({ format: 'markdown', color: false });
    resetOutputConfig();
    expect(getFormat()).toBe('text');
    expect(isColorEnabled()).toBe(true);
  });
});

describe('helpers', () => {
  it('getFormat returns current format', () => {
    setOutputConfig({ format: 'markdown' });
    expect(getFormat()).toBe('markdown');
  });

  it('isVerbose returns verbose flag', () => {
    setOutputConfig({ verbose: true });
    expect(isVerbose()).toBe(true);
  });

  it('getOutputDir returns output directory', () => {
    setOutputConfig({ outputDir: '/tmp/out' });
    expect(getOutputDir()).toBe('/tmp/out');
  });
});
