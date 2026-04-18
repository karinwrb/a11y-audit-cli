export interface OutputConfig {
  format: 'text' | 'json' | 'markdown';
  outputDir: string;
  verbose: boolean;
  color: boolean;
}

const defaults: OutputConfig = {
  format: 'text',
  outputDir: './reports',
  verbose: false,
  color: true,
};

let current: OutputConfig = { ...defaults };

export function getOutputConfig(): OutputConfig {
  return { ...current };
}

export function setOutputConfig(partial: Partial<OutputConfig>): void {
  current = { ...current, ...partial };
}

export function resetOutputConfig(): void {
  current = { ...defaults };
}

export function getFormat(): OutputConfig['format'] {
  return current.format;
}

export function isVerbose(): boolean {
  return current.verbose;
}

export function isColorEnabled(): boolean {
  return current.color;
}

export function getOutputDir(): string {
  return current.outputDir;
}
