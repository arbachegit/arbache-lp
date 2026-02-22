import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  testMatch: ['tests/**/*.spec.ts', 'e2e/**/*.spec.ts'],
  timeout: 60000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.E2E_WORKERS
    ? parseInt(process.env.E2E_WORKERS)
    : undefined,

  reporter: [['html'], ['list']],

  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: process.env.E2E_LOCALE || 'pt-BR',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx serve out -l 3000',
    port: 3000,
    reuseExistingServer: true,
  },
});
