import type { AuditResult } from './types';
import { filterByTagsAndCount, formatTagSummary } from './tag-runner';
import { isTagFilterEnabled, getFilterTags } from './tag-config';

export type AuditorFn = (url: string) => Promise<AuditResult[]>;

export function createTagFilteringAuditor(
  base: AuditorFn,
  options: { verbose?: boolean } = {}
): AuditorFn {
  return async (url: string): Promise<AuditResult[]> => {
    const raw = await base(url);

    if (!isTagFilterEnabled()) {
      return raw;
    }

    const { results, total, kept } = filterByTagsAndCount(raw);

    if (options.verbose) {
      const tags = getFilterTags();
      console.log(formatTagSummary(total, kept, tags));
    }

    return results;
  };
}
