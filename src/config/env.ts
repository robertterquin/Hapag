const runtimeEnv = import.meta.env

const normalizeSupabaseUrl = (value: string) => value
  .replace(/\/+$/, '')
  .replace(/\/(?:rest|functions)\/v1$/, '')

const supabaseUrl = normalizeSupabaseUrl(runtimeEnv.VITE_SUPABASE_URL ?? '')

export const appConfig = {
  appName: runtimeEnv.VITE_APP_NAME ?? 'Hapag',
  supabaseUrl,
  supabaseAnonKey: runtimeEnv.VITE_SUPABASE_ANON_KEY ?? '',
  supabaseFunctionUrl: runtimeEnv.VITE_SUPABASE_FUNCTION_URL ?? (supabaseUrl ? `${supabaseUrl}/functions/v1` : ''),
  environment: runtimeEnv.MODE,
}

export const hasSupabaseConfig = Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey)
export const hasRecipeGenerationConfig = Boolean(appConfig.supabaseFunctionUrl && appConfig.supabaseAnonKey)
