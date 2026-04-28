import {
  getSamplingConfig,
  setSamplingConfig,
  resetSamplingConfig,
  isSamplingEnabled,
  getSamplingRate,
} from "./sampling-config";

describe("sampling-config", () => {
  afterEach(() => {
    resetSamplingConfig();
  });

  describe("getSamplingConfig", () => {
    it("returns default config", () => {
      const config = getSamplingConfig();
      expect(config.enabled).toBe(false);
      expect(config.rate).toBe(1.0);
    });
  });

  describe("setSamplingConfig", () => {
    it("updates enabled flag", () => {
      setSamplingConfig({ enabled: true });
      expect(getSamplingConfig().enabled).toBe(true);
    });

    it("updates sampling rate", () => {
      setSamplingConfig({ rate: 0.5 });
      expect(getSamplingConfig().rate).toBe(0.5);
    });

    it("merges partial config", () => {
      setSamplingConfig({ enabled: true });
      setSamplingConfig({ rate: 0.25 });
      const config = getSamplingConfig();
      expect(config.enabled).toBe(true);
      expect(config.rate).toBe(0.25);
    });
  });

  describe("resetSamplingConfig", () => {
    it("restores defaults after changes", () => {
      setSamplingConfig({ enabled: true, rate: 0.1 });
      resetSamplingConfig();
      const config = getSamplingConfig();
      expect(config.enabled).toBe(false);
      expect(config.rate).toBe(1.0);
    });
  });

  describe("isSamplingEnabled", () => {
    it("returns false by default", () => {
      expect(isSamplingEnabled()).toBe(false);
    });

    it("returns true when enabled", () => {
      setSamplingConfig({ enabled: true });
      expect(isSamplingEnabled()).toBe(true);
    });
  });

  describe("getSamplingRate", () => {
    it("returns default rate of 1.0", () => {
      expect(getSamplingRate()).toBe(1.0);
    });

    it("returns configured rate", () => {
      setSamplingConfig({ rate: 0.75 });
      expect(getSamplingRate()).toBe(0.75);
    });

    it("clamps rate above 1.0 to 1.0", () => {
      setSamplingConfig({ rate: 1.5 });
      expect(getSamplingRate()).toBeLessThanOrEqual(1.0);
    });

    it("clamps rate below 0 to 0", () => {
      setSamplingConfig({ rate: -0.1 });
      expect(getSamplingRate()).toBeGreaterThanOrEqual(0);
    });
  });
});
