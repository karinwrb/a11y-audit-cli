import {
  getMaskConfig,
  setMaskConfig,
  resetMaskConfig,
  isMaskEnabled,
  getMaskChar,
  getMaskFields,
  isPartialMask,
  getVisibleChars,
} from "./mask-config";

beforeEach(() => {
  resetMaskConfig();
});

describe("getMaskConfig", () => {
  it("returns default config", () => {
    const config = getMaskConfig();
    expect(config.enabled).toBe(false);
    expect(config.maskChar).toBe("*");
    expect(config.maskFields).toContain("token");
    expect(config.partialMask).toBe(false);
    expect(config.visibleChars).toBe(4);
  });

  it("returns a copy, not reference", () => {
    const a = getMaskConfig();
    const b = getMaskConfig();
    expect(a).not.toBe(b);
  });
});

describe("setMaskConfig", () => {
  it("merges partial config", () => {
    setMaskConfig({ enabled: true, maskChar: "#" });
    expect(isMaskEnabled()).toBe(true);
    expect(getMaskChar()).toBe("#");
    expect(getMaskFields()).toContain("token");
  });

  it("overwrites maskFields", () => {
    setMaskConfig({ maskFields: ["customField"] });
    expect(getMaskFields()).toEqual(["customField"]);
  });
});

describe("resetMaskConfig", () => {
  it("restores defaults after changes", () => {
    setMaskConfig({ enabled: true, maskChar: "X", visibleChars: 2 });
    resetMaskConfig();
    expect(isMaskEnabled()).toBe(false);
    expect(getMaskChar()).toBe("*");
    expect(getVisibleChars()).toBe(4);
  });
});

describe("isPartialMask", () => {
  it("returns false by default", () => {
    expect(isPartialMask()).toBe(false);
  });

  it("returns true when set", () => {
    setMaskConfig({ partialMask: true });
    expect(isPartialMask()).toBe(true);
  });
});

describe("getVisibleChars", () => {
  it("returns default value", () => {
    expect(getVisibleChars()).toBe(4);
  });

  it("returns updated value", () => {
    setMaskConfig({ visibleChars: 6 });
    expect(getVisibleChars()).toBe(6);
  });
});
