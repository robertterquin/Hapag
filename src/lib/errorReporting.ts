// Sends crashes to Sentry when VITE_SENTRY_DSN is set. The SDK loads on demand, so
// builds without a DSN ship none of it. No personal data or ingredient text is sent.
type Sentry = typeof import('@sentry/react')

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined
let sentry: Promise<Sentry | undefined> | undefined

function loadSentry() {
  if (!dsn) return Promise.resolve(undefined)
  sentry ??= import('@sentry/react')
    .then((module) => {
      module.init({
        dsn,
        environment: import.meta.env.MODE,
        release: import.meta.env.VITE_APP_RELEASE as string | undefined,
        // Error and stack only: no user info, cookies, headers, request bodies, or query params.
        dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
        tracesSampleRate: 0,
        beforeBreadcrumb: (breadcrumb) => (breadcrumb.category === 'console' ? null : breadcrumb),
      })
      return module
    })
    .catch(() => undefined)
  return sentry
}

export function initErrorReporting() {
  void loadSentry()
}

export function reportError(error: unknown, context?: Record<string, string>) {
  console.error(error)
  void loadSentry().then((module) => module?.captureException(error, context ? { tags: context } : undefined))
}
