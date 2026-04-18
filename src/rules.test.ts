import { rules, runRules } from './rules';

describe('rules registry', () => {
  it('contains expected rule ids', () => {
    const ids = rules.map(r => r.id);
    expect(ids).toContain('img-alt');
    expect(ids).toContain('label-for-input');
    expect(ids).toContain('html-lang');
  });

  it('each rule has required fields', () => {
    rules.forEach(rule => {
      expect(rule.id).toBeTruthy();
      expect(rule.description).toBeTruthy();
      expect(rule.severity).toBeTruthy();
      expect(rule.wcagCriteria).toBeTruthy();
      expect(typeof rule.check).toBe('function');
    });
  });
});

describe('img-alt rule', () => {
  const rule = rules.find(r => r.id === 'img-alt')!;

  it('flags img without alt', () => {
    const html = '<img src="photo.jpg">';
    expect(rule.check(html)).toHaveLength(1);
  });

  it('does not flag img with alt', () => {
    const html = '<img src="photo.jpg" alt="A photo">';
    expect(rule.check(html)).toHaveLength(0);
  });

  it('flags multiple imgs without alt', () => {
    const html = '<img src="a.jpg"><img src="b.jpg">';
    expect(rule.check(html)).toHaveLength(2);
  });
});

describe('html-lang rule', () => {
  const rule = rules.find(r => r.id === 'html-lang')!;

  it('flags html without lang', () => {
    expect(rule.check('<html><body></body></html>')).toHaveLength(1);
  });

  it('does not flag html with lang', () => {
    expect(rule.check('<html lang="en"><body></body></html>')).toHaveLength(0);
  });
});

describe('runRules', () => {
  it('aggregates violations from all rules', () => {
    const html = '<html><body><img src="x.jpg"></body></html>';
    const violations = runRules(html);
    expect(violations.length).toBeGreaterThan(1);
  });

  it('returns empty array for fully compliant html', () => {
    const html = '<html lang="en"><body><img src="x.jpg" alt="desc"></body></html>';
    const violations = runRules(html);
    expect(violations).toHaveLength(0);
  });
});
