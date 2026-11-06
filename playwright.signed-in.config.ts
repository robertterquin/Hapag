import { execSync } from 'node:child_process'
import { defineConfig, devices } from '@playwright/test'

// Signed-in flows against a local Supabase (`npx supabase start`): real auth, tables, security rules,
// edge functions and a local mailbox. Keys come from the local stack, never from the hosted project.
const status = Object.fromEntries(
  execSync('npx supabase status -o env', { encoding: 'utf8' })
    .split('\n')
    .map((line) => line.match(/^([A-Z_]+)="?(.*?)"?$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => [match[1], match[2]]),
)
process.env.LOCAL_SUPABASE_URL = status.API_URL
process.env.LOCAL_SUPABASE_ANON_KEY = status.ANON_KEY
process.env.LOCAL_SUPABASE_SERVICE_KEY = status.SERVICE_ROLE_KEY
process.env.LOCAL_MAIL_URL = status.MAILPIT_URL ?? status.INBUCKET_URL

export default defineConfig({
  testDir: 'e2e-signed-in',
  timeout: 60_000,
  workers: 1,
  use: {
    ...devices['Pixel 7'],
    baseURL: 'http://localhost:5180',
    channel: process.env.CI ? undefined : 'chrome',
  },
  webServer: {
    command: 'npx vite --port 5180 --strictPort',
    url: 'http://localhost:5180',
    reuseExistingServer: false,
    env: {
      VITE_SUPABASE_URL: status.API_URL,
      VITE_SUPABASE_ANON_KEY: status.ANON_KEY,
      VITE_SUPABASE_FUNCTION_URL: `${status.API_URL}/functions/v1`,
    },
  },
})
