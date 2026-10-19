import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { test } from 'node:test'

const read = (path) => readFile(path, 'utf8')
const exists = (path) => access(path).then(() => true, () => false)

test('signed-in AI use is capped and total daily use has a ceiling', async () => {
  const handler = await read('supabase/functions/generate-recipes/index.ts')
  assert.doesNotMatch(handler, /if \(!userId\) \{\s*const identity/)
  assert.match(handler, /signedInLimit/)
  assert.match(handler, /hapag:ai:global:\$\{currentDay\}/)
})

test('the edge function exposes a health check that pings the rate limiter', async () => {
  const handler = await read('supabase/functions/generate-recipes/index.ts')
  const limiter = await read('supabase/functions/generate-recipes/rateLimit.ts')
  assert.match(handler, /request\.method === 'GET'/)
  assert.match(handler, /rateLimiterHealthy/)
  assert.match(limiter, /\/ping/)
})

test('voice readout uses only the device voice, with no server or unlicensed audio', async () => {
  const pkg = JSON.parse(await read('package.json'))
  const hook = await read('src/hooks/useVoiceReadout.ts')
  assert.equal(pkg.dependencies['msedge-tts'], undefined)
  assert.equal(await exists('api/text-to-speech.ts'), false)
  assert.equal(await exists('public/audio/steps'), false)
  assert.equal(await exists('src/services/ttsService.ts'), false)
  assert.match(hook, /speechSynthesis/)
  assert.doesNotMatch(hook, /fetch\(|new Audio/)
})

test('page crashes show a recovery screen and are reported', async () => {
  const app = await read('src/app/App.tsx')
  const main = await read('src/main.tsx')
  const boundary = await read('src/components/ErrorBoundary.tsx')
  const reporting = await read('src/lib/errorReporting.ts')
  assert.match(app, /<ErrorBoundary key=\{contentKey\}/)
  assert.match(main, /<ErrorBoundary area="app">/)
  assert.match(main, /unhandledrejection/)
  assert.match(boundary, /componentDidCatch[\s\S]*reportError/)
  assert.match(boundary, /Something went wrong/)
  assert.match(reporting, /VITE_SENTRY_DSN/)
  assert.match(reporting, /userInfo: false, cookies: false, httpHeaders: false, httpBodies: \[\], urlQueryParams: false/)
  assert.match(reporting, /import\('@sentry\/react'\)/)
})
