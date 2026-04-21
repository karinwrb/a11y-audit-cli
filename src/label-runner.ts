/**
 * Applies run labels and tags to audit reports.
 */

import { AuditReport } from "./types";
import { getLabelConfig, isLabelEnabled } from "./label-config";

export interface LabeledReport extends AuditReport {
  runLabel?: string;
  runTags?: string[];
}

/**
 * Attaches label and tags from config to a report.
 * Returns a new object; does not mutate the original.
 */
export function applyLabel(report: AuditReport): LabeledReport {
  if (!isLabelEnabled()) {
    return { ...report };
  }

  const { label, tags } = getLabelConfig();
  const labeled: LabeledReport = { ...report };

  if (label) {
    labeled.runLabel = label;
  }

  if (tags.length > 0) {
    labeled.runTags = [...tags];
  }

  return labeled;
}

/**
 * Formats label metadata as a short string for text output.
 */
export function formatLabelMeta(report: LabeledReport): string {
  const parts: string[] = [];

  if (report.runLabel) {
    parts.push(`Label: ${report.runLabel}`);
  }

  if (report.runTags && report.runTags.length > 0) {
    parts.push(`Tags: ${report.runTags.join(", ")}`);
  }

  return parts.join(" | ");
}
