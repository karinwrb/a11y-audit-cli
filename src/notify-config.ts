export interface NotifyConfig {
  enabled: boolean;
  onComplete: boolean;
  onFailure: boolean;
  webhookUrl: string | null;
}

let config: NotifyConfig = {
  enabled: false,
  onComplete: false,
  onFailure: true,
  webhookUrl: null,
};

export function getNotifyConfig(): NotifyConfig {
  return { ...config };
}

export function setNotifyConfig(partial: Partial<NotifyConfig>): void {
  config = { ...config, ...partial };
}

export function resetNotifyConfig(): void {
  config = { enabled: false, onComplete: false, onFailure: true, webhookUrl: null };
}

export function isNotifyEnabled(): boolean {
  return config.enabled;
}

export function getWebhookUrl(): string | null {
  return config.webhookUrl;
}

export function shouldNotifyOnComplete(): boolean {
  return config.onComplete;
}

export function shouldNotifyOnFailure(): boolean {
  return config.onFailure;
}
