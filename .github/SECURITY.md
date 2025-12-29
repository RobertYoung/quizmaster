# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Quizmaster, please report it by emailing the repository owner directly. Please do not create a public GitHub issue for security vulnerabilities.

### What to Include

Please include the following information in your report:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### Response Time

We aim to respond to security reports within 48 hours and will keep you informed about the progress of fixing the vulnerability.

## Security Best Practices

This project implements several security measures:

### GitHub Actions Security

- **Hardened Runners**: All workflows use StepSecurity's harden-runner to monitor and restrict network egress
- **Pinned Actions**: All actions are pinned to specific commit SHAs to prevent supply chain attacks
- **Minimal Permissions**: Workflows use least-privilege GITHUB_TOKEN permissions
- **Dependency Updates**: Automated security updates via Dependabot for both npm packages and GitHub Actions

### Supply Chain Security

- **SLSA Provenance**: Release artifacts include SLSA Level 3 provenance attestations
- **Dependency Scanning**: Automated dependency review on pull requests
- **Secret Scanning**: Gitleaks integration to detect committed secrets
- **OSSF Scorecard**: Continuous assessment of security best practices

### Code Security

- **CodeQL Analysis**: Automated security scanning for JavaScript/TypeScript vulnerabilities
- **Dependency Review**: Automated review of dependency changes in pull requests
- **License Compliance**: Automated checking for incompatible licenses

## Verifying Release Artifacts

Release artifacts include SHA256 checksums and SLSA provenance attestations. To verify a release:

1. Download the release artifact and checksums.txt
2. Verify the checksum:
   ```bash
   sha256sum -c checksums.txt
   ```
3. Verify SLSA provenance (requires [slsa-verifier](https://github.com/slsa-framework/slsa-verifier)):
   ```bash
   slsa-verifier verify-artifact \
     --provenance-path quizmaster-*.intoto.jsonl \
     --source-uri github.com/RobertYoung/quizmaster \
     quizmaster-*.tar.gz
   ```

## Security Updates

Security updates are released as soon as possible after a vulnerability is confirmed. Update to the latest version to ensure you have all security patches.

## Supported Versions

Only the latest release receives security updates. We recommend always using the most recent version.
