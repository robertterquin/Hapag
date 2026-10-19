# Phase 20: Production Readiness

Phases 18 and 19 made Hapag look and feel finished. This phase makes it safe to put in front of real users: the backend has to work reliably, cost has to be capped, failures have to be visible, and the release has to be repeatable. No new features; every change closes a gap found in the review below.

Guiding rules for every phase:

1. **Fail closed, cost capped.** Every public endpoint has a limit, and nothing can run up an AI or speech bill unchecked.
2. **See it break before users report it.** Errors reach a dashboard; a broken page shows a friendly screen, not a blank one.
3. **Every release is the same release.** Checks run automatically on every push; deploys come from `main` only.
4. **Test what users actually do.** The signed-in flows and real AI recipes get verified, not assumed.

Phases run in order; each one ends with all checks passing.

| Phase | Outcome | Size | Priority |
|---|---|---|---|
| 20.0 Backend fixes | AI recipes work again; exposed token rotated | S | Blocker |
| 20.1 Security and cost limits | Speech endpoint locked down; signed-in AI capped; vulnerable dependency removed; CORS narrowed | M | Blocker |
| 20.2 Reliability and monitoring | Error boundary, error reporting, uptime check | M | Blocker |
| 20.3 Automated checks and deploys | CI on every push; preview and production environments | S | High |
| 20.4 Signed-in and AI QA | End-to-end tests for sign-up, saved, profile, pantry sync, and AI results | M | High |
| 20.5 Launch essentials | Privacy policy, terms, account deletion, share previews, install support | M | High |
| 20.6 Launch checklist | Final pass on production; go/no-go | S | Required |

---

## 20.0 Review findings

Reviewed on 2026-10-19 against the repository and the hosted Supabase project.

### Backend
- **AI recipes are down for signed-out users.** `generate-recipes` returns 503 because the `UPSTASH_REDIS_REST_URL` secret points to an old Upstash database; the current one is `ethical-kangaroo-122089`. Every search falls back to the catalog.
- **The Upstash token was exposed** in chat and a terminal, so it must be rotated.
- **Signed-in users have no AI limit.** The rate limiter only runs when `identifyUser` returns nothing (`supabase/functions/generate-recipes/index.ts`), so one account can call OpenAI without limit.

### Security
- **The text-to-speech endpoint is open to anyone.** `api/text-to-speech.ts` allows any origin (`Access-Control-Allow-Origin: *`), has no rate limit, and accepts 2,000 characters per call.
- **It also relies on an unofficial service.** `msedge-tts` calls Microsoft Edge's private read-aloud endpoint, which isn't licensed for third-party production use and can change or be blocked without notice.
- **There's a high-severity vulnerability.** `npm audit` reports 8 advisories in `axios@1.19.0`, which `msedge-tts` pulls in.
- **The edge function allows any origin** (`Access-Control-Allow-Origin: *`).
- **No security headers.** `vercel.json` only has the SPA rewrite: no Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`.
- **Row-level security is in place** on all six tables (`profiles`, `user_preferences`, `saved_recipes`, `cooked_events`, `pantry_items`, `recipe_feedback`). This is good, but it hasn't been tested against a second account.

### Reliability
- **No error boundary.** A render error in any page leaves a blank screen.
- **No error reporting or uptime monitoring.** Failures in the browser, the edge function, or the speech endpoint only show up in local consoles and provider logs.

### Release process
- **No CI.** There's no `.github/workflows`, so typecheck, lint, tests, and build only run when someone remembers.
- **No separate preview environment.** Local, preview, and production builds all point at the same Supabase project.

### Untested
- Signed-in flows: sign-up and confirmation email, sign-in, Saved, Profile preferences, pantry and staples sync, recipe feedback.
- Real AI recipe cards (blocked by the Upstash issue).
- Real devices: iOS Safari and Android Chrome (only emulated so far).

### Launch essentials
- No privacy policy or terms, though the app stores accounts, pantry items, preferences, and feedback.
- No way for a user to delete their account and data.
- `index.html` has only a title: no description, Open Graph or Twitter tags, or theme colour, so shared links show no preview.
- No web app manifest or icons, so Hapag can't be added to the home screen as an app.
- Dish photo credits exist in `src/data/dishPhotos.ts`, but aren't confirmed to show wherever a photo appears.

---

## 20.0 Backend fixes

- **Update the Upstash secrets.** You run the command in terminal tab c4; Claude never handles the token. It pings Upstash first, so nothing changes if the URL or token is wrong.

  ```bash
  curl -s "$UPSTASH_REDIS_REST_URL/ping" -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" | grep -q PONG && npx supabase secrets set UPSTASH_REDIS_REST_URL="$UPSTASH_REDIS_REST_URL" UPSTASH_REDIS_REST_TOKEN="$UPSTASH_REDIS_REST_TOKEN" --project-ref jwtvyjtdcbfdcnqtpsxp && echo DONE || echo "Upstash check failed, nothing changed"
  ```

- **Rotate the exposed token** in the Upstash console, then set the new value with the same command.
- **Confirm AI recipes work again:** run a signed-out search and check for AI recipe cards, then make four searches in an hour and check the fourth returns 429 with a friendly message.

**Exit:** a signed-out search returns AI recipes; the rate limit triggers; the old token no longer works.

## 20.1 Security and cost limits

- **Text-to-speech, choose one:**
  - **(A) Recommended: a licensed service.** Move to Azure AI Speech, which has the same `en-PH-RosaNeural` voice and a free tier, or to Google Cloud Text-to-Speech. Keep the key server-side.
  - **(B) The browser's own voice.** Use `speechSynthesis` only. It's free with no server, but the voice quality varies by device.

  Either way, remove `msedge-tts`, which also removes the vulnerable `axios`.
- **Lock down the speech endpoint:** allow only Hapag's origins, rate-limit through the same Upstash limiter (per IP, for example 60 requests an hour), and cap text at about 500 characters (one step).
- **Cap signed-in AI use:** add a per-user limit (for example 20 an hour, configured with `AI_SIGNED_IN_LIMIT`), plus a daily project-wide ceiling as a circuit breaker. Set a monthly spend limit in the OpenAI dashboard.
- **Narrow CORS on the edge function** to the production domain, Vercel previews, and localhost.
- **Add security headers in `vercel.json`:** a Content-Security-Policy allowing self, Supabase, Wikimedia images, Google Fonts, and the Iconify API; plus `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy` that allows only what the app uses (microphone stays off).
- **Test row-level security** with a script: user B can't read or write user A's rows in every table.

**Exit:** `npm audit --omit=dev` is clean; the speech endpoint rejects other origins and over-limit callers; the signed-in AI limit triggers; the security headers score A on securityheaders.com.

## 20.2 Reliability and monitoring

- **Add a root error boundary** with a calm "Something went wrong" screen and "Back to home" and "Try again" actions, in the Phase 19 style. Add per-page boundaries so one broken page doesn't take down the shell.
- **Report errors:** add Sentry (free tier) or a similar service to the React app and the edge function, with source maps uploaded at build time. Never send ingredient text or user details beyond an anonymous id.
- **Monitor uptime:** add a health check for the site and the edge function (for example Better Stack or UptimeRobot, free tier) that alerts you by email.
- **Fall back gracefully:** confirm every failure path shows a message. This includes AI down, speech down, Supabase down, and being offline.

**Exit:** a thrown test error shows the friendly screen and appears in the dashboard; stopping the edge function sends an alert.

## 20.3 Automated checks and deploys

- **Add GitHub Actions** on every push to `main`: install, typecheck, lint, test, build, and `npm audit --omit=dev`.
- **Gate deploys:** Vercel deploys production only from `main` after the checks pass.
- **Separate environments:** a second Supabase project for preview deploys, so testing never touches real user data. Document every environment variable in `.env.example`.
- **Keep dependencies current:** Dependabot or Renovate opens weekly update pull requests.

**Exit:** a failing test blocks the deploy; preview deploys use the preview database.

## 20.4 Signed-in and AI QA

- **Add end-to-end tests** with Playwright against a local Supabase (`supabase start`), using test accounts created by the test setup itself:
  - Sign up, sign in, sign out, password reset.
  - Save and unsave a recipe; it appears in Saved after a reload.
  - Change Profile preferences; the next search uses them.
  - Add staples and pantry items; they sync after signing in on a fresh browser.
  - Recipe feedback is stored and shown.
  - AI results render with photos, cost, and shopping list (with a mocked OpenAI response, so tests are free and stable).
- **Test on real devices** (iOS Safari and Android Chrome): Cooking Mode screen wake lock, voice readout, timer, swipe, and the keyboard with the sticky bars.
- **Run Lighthouse** on Home, Ulam, Results, and Detail.

**Exit:** the end-to-end suite passes in CI; Lighthouse scores at least 90 for performance and accessibility and 100 for best practices on mobile.

## 20.5 Launch essentials

- **Legal pages:**
  - A plain-language privacy policy covering what's stored, why, and how to delete it. It also says that ingredient text is sent to OpenAI and step text to the speech provider.
  - Terms of use, including that recipes and prices are AI-generated estimates and to check allergens.
  - Both are linked from Profile and the sign-up form.
- **Account deletion:** a "Delete account" action in Profile. It needs a confirmation step and calls an edge function that removes the user and all their rows (required by the Philippine Data Privacy Act).
- **Share previews:** a meta description, Open Graph and Twitter tags with a 1200×630 preview image, `theme-color`, and canonical URL.
- **Install support:** a web app manifest with name, icons (192, 512, maskable), and Palayok colours, so the app can be added to the home screen. Offline support is out of scope.
- **Photo credits:** confirm each dish photo shows its author and licence wherever it appears.
- **Auth emails:** set the production site URL and redirect URLs in Supabase, and use a custom sender (Resend or similar) so emails don't hit Supabase's built-in limit of a few per hour.

**Exit:** a new user can sign up, read the privacy policy, and delete their account; a shared link shows a preview card.

## 20.6 Launch checklist

- [ ] Custom domain with HTTPS; Supabase site URL and CORS updated to it.
- [ ] Production secrets set, and none in the repository (`git log -p | grep -i key` is clean).
- [ ] OpenAI and speech spend limits set; Upstash limits verified.
- [ ] Database backups on (Supabase daily backups or a scheduled `pg_dump`).
- [ ] Error dashboard and uptime alerts reach your email.
- [ ] CI is green on `main`; the production deploy matches the latest commit.
- [ ] One full manual run on a real phone: sign up, search, open a recipe, cook, save, delete the account.
- [ ] README updated with setup, environments, and deploy steps.

**Exit:** every box checked; go/no-go decided.

---

## Out of scope

Kept for after launch: offline mode, push notifications, analytics beyond error reporting, recipe sharing between users, and a native app.
