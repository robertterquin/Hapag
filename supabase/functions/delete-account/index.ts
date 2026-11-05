// Deletes the signed-in user's account. Every Hapag table references auth.users with
// "on delete cascade", so saved recipes, cooking history, preferences, staples and feedback go with it.
const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
}

const json = (body: unknown, status: number) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Only POST is supported.' }, 405)

  const url = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !anonKey || !serviceKey) return json({ error: 'Account deletion is not configured.' }, 503)

  // Who is asking: the caller's own session token, checked by Supabase Auth (the anon key alone is rejected).
  const authorization = request.headers.get('Authorization') ?? ''
  const userResponse = await fetch(`${url}/auth/v1/user`, { headers: { Authorization: authorization, apikey: anonKey } })
  if (!userResponse.ok) return json({ error: 'Sign in again to delete your account.' }, 401)
  const user: unknown = await userResponse.json()
  const userId = typeof user === 'object' && user !== null && 'id' in user && typeof user.id === 'string' ? user.id : null
  if (!userId) return json({ error: 'Sign in again to delete your account.' }, 401)

  const deleteResponse = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
  })
  if (!deleteResponse.ok) {
    console.error('Account deletion failed with status', deleteResponse.status)
    return json({ error: 'Could not delete the account. Please try again.' }, 502)
  }
  return json({ deleted: true }, 200)
})
