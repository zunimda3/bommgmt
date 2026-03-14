import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm next dev --port 3100',
    port: 3100,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
