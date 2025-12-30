import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  // Use list reporter in CI for real-time streaming output, HTML locally for detailed reports
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "html",
  // Set global timeout to prevent hanging
  timeout: 30000,
  use: {
    baseURL: isCI ? "http://localhost:4173" : "http://localhost:5173",
    trace: "on-first-retry",
    // Capture screenshot on failure for debugging
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Use preview (production build) in CI for stability, dev server locally
    command: isCI ? "pnpm preview" : "pnpm dev",
    url: isCI ? "http://localhost:4173" : "http://localhost:5173",
    reuseExistingServer: !isCI,
    // Timeout for server to start
    timeout: 120000,
    // Pipe stdout to prevent blocking in CI
    stdout: "pipe",
    stderr: "pipe",
  },
});
