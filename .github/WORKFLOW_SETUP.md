# GitHub Actions Workflow Setup Guide

This document explains the GitHub Actions workflows configured for the Quizmaster project and any necessary setup steps.

## Overview

The project uses three main workflows:

1. **CI** (`ci.yml`) - Continuous Integration for pull requests and main branch
2. **Release** (`release.yml`) - Automated releases with SLSA provenance
3. **Security** (`security.yml`) - Security scanning and OSSF Scorecard

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to main branch
- Pull requests to main branch

**Jobs:**
- **lint-and-build**: Runs ESLint and builds the project
- **e2e-tests**: Runs Playwright end-to-end tests

**Features:**
- Hardened runners with StepSecurity
- Pinned actions to commit SHAs
- Parallel job execution for faster feedback
- Build artifact uploads for verification
- Playwright test reports on failure

**No setup required** - This workflow runs automatically on all PRs and pushes to main.

### 2. Release Workflow (`release.yml`)

**Triggers:**
- Push of version tags (e.g., `v1.0.0`, `v2.1.3`)

**Jobs:**
- **build**: Builds production assets and creates GitHub release
- **provenance**: Generates SLSA Level 3 provenance attestations

**Features:**
- Automatic changelog generation from git commits
- SHA256 checksums for all artifacts
- SLSA provenance for supply chain security
- Pre-release detection (alpha, beta, rc tags)

**To create a release:**

1. Update version in `package.json`:
   ```bash
   # Update version to 1.0.0 (example)
   pnpm version 1.0.0
   ```

2. Push the tag:
   ```bash
   git push origin v1.0.0
   ```

3. The workflow automatically:
   - Builds production assets
   - Creates release archives (.tar.gz and .zip)
   - Generates checksums
   - Creates GitHub release with changelog
   - Generates SLSA provenance attestation

**No setup required** - Uses default GITHUB_TOKEN permissions.

### 3. Security Workflow (`security.yml`)

**Triggers:**
- Push to main branch
- Pull requests to main branch
- Weekly schedule (Mondays at 9:00 UTC)
- Manual trigger via workflow_dispatch

**Jobs:**
- **codeql**: CodeQL security analysis for JavaScript/TypeScript
- **dependency-review**: Reviews dependency changes in PRs
- **scorecard**: OSSF Scorecard security posture assessment
- **secret-scan**: Gitleaks secret scanning

**Features:**
- CodeQL security-extended queries
- Dependency vulnerability and license checking
- OSSF best practices assessment
- Secret detection in commit history

**Setup Required:**

1. **Enable GitHub Advanced Security** (for private repositories):
   - Go to Repository Settings → Code security and analysis
   - Enable "Dependency graph"
   - Enable "Dependabot alerts"
   - Enable "Dependabot security updates"
   - Enable "Code scanning" (CodeQL)

2. **Configure OSSF Scorecard** (optional):
   - The workflow publishes results to OpenSSF
   - Results appear in the Security tab under "Code scanning"
   - Badge can be added to README (already added)

**For public repositories:** All features work automatically with no additional setup.

## Dependabot Configuration

Dependabot is configured in `.github/dependabot.yml` to:

- Check npm dependencies weekly (Mondays at 9:00 UTC)
- Check GitHub Actions weekly
- Group patch and minor updates to reduce PR noise
- Auto-assign to @RobertYoung
- Apply labels for easy filtering

**Setup Required:**

1. Enable Dependabot in repository settings:
   - Settings → Code security and analysis
   - Enable "Dependabot version updates"

2. (Optional) Configure auto-merge for patch updates:
   - Settings → General → Pull Requests
   - Enable "Allow auto-merge"
   - Use branch protection rules to require CI before merge

## Branch Protection Rules (Recommended)

To enforce quality gates, configure branch protection for `main`:

1. Go to Settings → Branches → Branch protection rules
2. Add rule for `main` branch:
   - ✓ Require a pull request before merging
   - ✓ Require status checks to pass before merging
     - Add: `Lint and Build`
     - Add: `E2E Tests`
     - Add: `CodeQL Analysis`
   - ✓ Require branches to be up to date before merging
   - ✓ Require linear history (optional)
   - ✓ Include administrators (recommended)

## Security Best Practices Implemented

### StepSecurity Harden Runner
- All workflows use `step-security/harden-runner`
- Monitors network egress and file writes
- Currently in audit mode (learning phase)
- After a few runs, can switch to block mode for stricter control

### Pinned Actions
- All actions pinned to commit SHAs (not tags)
- Version comments included for reference
- Prevents supply chain attacks via compromised action versions

### Minimal Permissions
- Each job specifies only required permissions
- Uses `contents: read` by default
- Escalates permissions only when necessary

### SLSA Provenance
- Release artifacts include SLSA Level 3 attestations
- Provides cryptographic proof of build integrity
- Enables verification by consumers

### OSSF Scorecard
- Weekly assessment of security best practices
- Results published to Security tab
- Badge in README shows current score

## Verifying Release Artifacts

Users can verify release artifacts using:

1. **Checksum verification:**
   ```bash
   sha256sum -c checksums.txt
   ```

2. **SLSA provenance verification:**
   ```bash
   # Install slsa-verifier
   go install github.com/slsa-framework/slsa-verifier/v2/cli/slsa-verifier@latest

   # Verify artifact
   slsa-verifier verify-artifact \
     --provenance-path quizmaster-*.intoto.jsonl \
     --source-uri github.com/RobertYoung/quizmaster \
     quizmaster-*.tar.gz
   ```

## Troubleshooting

### CI Workflow Fails

**Lint errors:**
- Run `pnpm lint` locally to see errors
- Fix issues or update ESLint config

**Build errors:**
- Run `pnpm build` locally to reproduce
- Check TypeScript errors
- Ensure all dependencies are installed

**Test failures:**
- Run `pnpm test` locally
- Check Playwright report artifact in GitHub Actions

### Release Workflow Fails

**Tag already exists:**
- Delete remote tag: `git push --delete origin v1.0.0`
- Delete local tag: `git tag -d v1.0.0`
- Create new tag with different version

**Build failures:**
- Same as CI workflow troubleshooting
- Check that version tag format is correct (v*.*.*)

### Security Workflow Fails

**CodeQL failures:**
- Usually indicates potential security issues
- Review findings in Security tab
- May be false positives - can be dismissed with justification

**Dependency Review blocks PR:**
- Review flagged dependencies
- Update to patched versions
- Or add exception if risk is acceptable

**Scorecard warnings:**
- Review recommendations in Security tab
- Address high-priority findings first
- Some checks may not apply to all projects

## Maintenance

### Updating Workflows

When updating workflows:

1. Test changes in a fork or feature branch first
2. Update action versions carefully (verify new SHA)
3. Check StepSecurity harden-runner logs for new egress endpoints
4. Update documentation if behavior changes

### Monitoring

Regularly review:
- Dependabot PRs (weekly)
- Security scanning results (after each run)
- OSSF Scorecard recommendations (weekly)
- Failed workflow runs (as they occur)

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [StepSecurity Best Practices](https://www.stepsecurity.io/blog/github-actions-security-best-practices)
- [SLSA Framework](https://slsa.dev/)
- [OSSF Scorecard](https://scorecard.dev/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
