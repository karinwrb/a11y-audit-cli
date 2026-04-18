# a11y-audit-cli

> CLI tool that runs accessibility checks on URLs and outputs structured reports with fix suggestions.

---

## Installation

```bash
npm install -g a11y-audit-cli
```

---

## Usage

Run an accessibility audit against any public URL:

```bash
a11y-audit --url https://example.com
```

Save the report to a file:

```bash
a11y-audit --url https://example.com --output report.json --format json
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--url` | Target URL to audit | *(required)* |
| `--format` | Output format: `text`, `json`, `html` | `text` |
| `--output` | Write report to a file | stdout |
| `--level` | WCAG level: `A`, `AA`, `AAA` | `AA` |

### Example Output

```
[ERROR] Missing alt text on <img> — Line 42
  Fix: Add a descriptive alt attribute, e.g. alt="Company logo"

[WARN] Low color contrast ratio (3.2:1) — Line 87
  Fix: Increase contrast to at least 4.5:1 for normal text
```

---

## Requirements

- Node.js >= 16
- Internet access to the target URL

---

## Contributing

Pull requests are welcome. Please open an issue first to discuss any major changes.

---

## License

[MIT](LICENSE)