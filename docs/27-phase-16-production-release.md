# Phase 16: Production Release and Verification

Phase 16 prepares Hapag for a controlled production release. It does not place
server secrets in the frontend and it does not deploy automatically.

## Release sequence

1. Run the local quality gates:

   ```powershell
   npm.cmd run typecheck
   npm.cmd run test
   npm.cmd run lint
   npm.cmd run build
   ```

2. Configure Supabase Edge Function secrets. These values belong in Supabase,
   not in `.env`, `.env.local`, or Vercel frontend variables:

   ```powershell
   npx supabase secrets set `
     OPENAI_API_KEY="..." `
     OPENAI_MODEL="..." `
     OPENAI_REASONING_EFFORT="low" `
     UPSTASH_REDIS_REST_URL="..." `
     UPSTASH_REDIS_REST_TOKEN="..." `
     AI_AUTHENTICATED_LIMIT="10" `
     AI_ANONYMOUS_LIMIT="3" `
     AI_RATE_WINDOW_SECONDS="3600" `
     AI_MAX_INGREDIENTS="20" `
     AI_MAX_INPUT_LENGTH="2000"
   ```

3. Deploy the Edge Function:

   ```powershell
   npx supabase functions deploy generate-recipes
   ```

4. In Vercel, configure only the public frontend variables:

   ```text
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```

   Do not add `OPENAI_API_KEY` or `UPSTASH_REDIS_REST_TOKEN` to Vercel.

5. Deploy the Vercel frontend and verify these flows:

   - Anonymous user: generate recipes, then confirm the anonymous quota is enforced.
   - Authenticated user: sign in, generate recipes, and confirm the session token is sent.
   - Catalog match: use familiar ingredients and confirm Filipino catalog dishes are preferred.
   - No catalog match: confirm results are labelled `Hapag adaptation` and remain grounded in the submitted ingredients.
   - Saved recipes, authentication, profile preferences, recipe detail, cooking mode, retry, and empty states.

6. Perform responsive and accessibility review at 320px, 390px, 768px, and
   1280px, including keyboard focus and reduced-motion settings.

## Security checks

- Keep `verify_jwt = true` in `supabase/config.toml`.
- Confirm RLS remains enabled for user-owned Supabase tables.
- Never commit `.env`, `.env.local`, or `supabase/functions/.env`.
- Rotate any secret that was pasted into a chat, issue, screenshot, or public repository.
- Treat AI output as generated guidance; users should verify ingredients, labels,
  allergies, and cooking safety before preparing food.
