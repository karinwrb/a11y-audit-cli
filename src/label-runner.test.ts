import { describe, it, expect, beforeEach } from "vitest";
import { applyLabel, formatLabelMeta } from "./label-runner";
import { setLabelConfig, resetLabelConfig } from "./label-config";
import { AuditReport } from "./types";

const baseReport: AuditReport = {
  url: "https://example.com",
  timestamp: "2024-01-01T00:00:00.000Z",
  score: 90,
  results: [],
  violations: 0,
};

describe("applyLabel", () => {
  beforeEach(() => resetLabelConfig());

  it("returns report unchanged when labeling is disabled", () => {
    const result = applyLabel(baseReport);
    expect(result.runLabel).toBeUndefined();
    expect(result.runTags).toBeUndefined();
  });

  it("attaches label when enabled", () => {
    setLabelConfig({ enabled: true, label: "nightly", tags: [] });
    const result = applyLabel(baseReport);
    expect(result.runLabel).toBe("nightly");
  });

  it("attaches tags when enabled", () => {
    setLabelConfig({ enabled: true, label: "", tags: ["ci", "prod"] });
    const result = applyLabel(baseReport);
    expect(result.runTags).toEqual(["ci", "prod"]);
  });

  it("does not attach runLabel when label is empty string", () => {
    setLabelConfig({ enabled: true, label: "", tags: [] });
    const result = applyLabel(baseReport);
    expect(result.runLabel).toBeUndefined();
  });

  it("does not mutate the original report", () => {
    setLabelConfig({ enabled: true, label: "test", tags: ["a"] });
    applyLabel(baseReport);
    expect((baseReport as any).runLabel).toBeUndefined();
  });
});

describe("formatLabelMeta", () => {
  it("returns empty string when no label or tags", () => {
    expect(formatLabelMeta({ ...baseReport })).toBe("");
  });

  it("formats label only", () => {
    expect(formatLabelMeta({ ...baseReport, runLabel: "nightly" })).toBe(
      "Label: nightly"
    );
  });

  it("formats tags only", () => {
    expect(formatLabelMeta({ ...baseReport, runTags: ["ci", "prod"] })).toBe(
      "Tags: ci, prod"
    );
  });

  it("formats both label and tags separated by pipe", () => {
    const result = formatLabelMeta({
      ...baseReport,
      runLabel: "nightly",
      runTags: ["ci"],
    });
    expect(result).toBe("Label: nightly | Tags: ci");
  });
});
