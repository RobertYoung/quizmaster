# Contributing to Quizmaster

Thank you for your interest in contributing to Quizmaster! This document provides guidelines and information about our development workflow.

## Development Setup

1. **Prerequisites**
   - Node.js 20 LTS or higher
   - pnpm 9 or higher

2. **Clone and Install**
   ```bash
   git clone https://github.com/RobertYoung/quizmaster.git
   cd quizmaster
   pnpm install
   ```

3. **Development Commands**
   ```bash
   pnpm dev      # Start development server
   pnpm build    # Build for production
   pnpm lint     # Run ESLint
   pnpm test     # Run Playwright tests
   pnpm preview  # Preview production build
   ```

## Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clear, descriptive commit messages
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Before Submitting**
   - Run `pnpm lint` to check for linting errors
   - Run `pnpm build` to ensure the build succeeds
   - Run `pnpm test` to verify all tests pass

4. **Submit Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Wait for CI checks to pass

## CI/CD Pipeline

### Automated Checks

All pull requests and pushes to main trigger automated checks:

- **Linting**: ESLint checks for code quality and style issues
- **Build**: TypeScript compilation and Vite build
- **Tests**: Playwright E2E tests
- **Security Scanning**: CodeQL, dependency review, secret scanning
- **Dependency Review**: Checks for vulnerable dependencies

### Security Best Practices

Our GitHub Actions workflows follow security best practices:

- **Hardened Runners**: All jobs use StepSecurity's harden-runner to monitor network egress
- **Pinned Actions**: Actions are pinned to commit SHAs (not tags) to prevent supply chain attacks
- **Minimal Permissions**: Each job requests only the permissions it needs
- **Dependency Scanning**: Automated security scanning on all dependencies
- **Secret Scanning**: Gitleaks integration prevents committed secrets

### Updating Dependencies

Dependencies are managed through:

- **Dependabot**: Automated weekly updates for npm packages and GitHub Actions
- **Grouped Updates**: Patch and minor updates are grouped to reduce PR noise
- **Auto-merge**: Patch updates can be auto-merged after CI passes (if configured)

### Release Process

Releases are automated through GitHub Actions:

1. **Version Update**: Update version in `package.json`
2. **Create Tag**: Create and push a version tag (e.g., `v1.0.0`)
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. **Automated Build**: GitHub Actions builds release artifacts
4. **SLSA Provenance**: Supply chain attestations are generated
5. **GitHub Release**: Release is created with artifacts and changelog

## Code Style

- Use TypeScript for type safety
- Follow the existing ESLint configuration
- Use functional components with hooks
- Keep components focused and single-purpose
- Write meaningful variable and function names

## Testing

- Write Playwright tests for new user-facing features
- Test different question types and edge cases
- Ensure tests are deterministic and don't rely on timing

## Questions or Issues?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Review existing issues before creating new ones

## Security Vulnerabilities

If you discover a security vulnerability, please follow our [Security Policy](.github/SECURITY.md) and report it privately rather than opening a public issue.

## License

By contributing to Quizmaster, you agree that your contributions will be licensed under the MIT License.
