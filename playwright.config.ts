import { defineConfig, devices } from '@playwright/test'

// End-to-end checks of the main cooking flow in a phone-sized Chrome. Uses the installed Chrome,
// so no browser download is needed; CI can set PW_CHANNEL= to use Playwright's own Chromium.
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  use: {
    ...devices['Pixel 7'],
    baseURL: 'http://localhost:5180',
    channel: process.env.PW_CHANNEL ?? 'chrome',
  },
  webServer: {
    command: 'npx vite --port 5180 --strictPort',
    url: 'http://localhost:5180',
    reuseExistingServer: !process.env.CI,
  },
})
