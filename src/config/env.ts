const runtimeEnv = import.meta.env

export const appConfig = {
  appName: runtimeEnv.VITE_APP_NAME ?? 'Hapag',
  supabaseUrl: runtimeEnv.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: runtimeEnv.VITE_SUPABASE_ANON_KEY ?? '',
  environment: runtimeEnv.MODE,
}

export const hasSupabaseConfig = Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey)
