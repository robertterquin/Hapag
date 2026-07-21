export function getErrorMessage(reason: unknown, fallback: string) {
  if (reason instanceof Error) return reason.message
  if (typeof reason === 'object' && reason !== null && 'message' in reason && typeof reason.message === 'string') return reason.message
  return fallback
}
