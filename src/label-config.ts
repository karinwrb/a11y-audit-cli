/**
 * Configuration for run labeling — attaches a human-readable label and
 * optional tags to every audit report for easier identification in CI logs.
 */

export interface LabelConfig {
  enabled: boolean;
  label: string;
  tags: string[];
}

let config: LabelConfig = {
  enabled: false,
  label: "",
  tags: [],
};

export function getLabelConfig(): LabelConfig {
  return { ...config };
}

export function setLabelConfig(partial: Partial<LabelConfig>): void {
  config = { ...config, ...partial };
}

export function resetLabelConfig(): void {
  config = { enabled: false, label: "", tags: [] };
}

export function isLabelEnabled(): boolean {
  return config.enabled;
}

export function getLabel(): string {
  return config.label;
}

export function getTags(): string[] {
  return [...config.tags];
}
