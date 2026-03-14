/**
 * Backend API base URL. Resolved once from env with dev fallback.
 * Use getBackendUrl() in loaders when you need a guaranteed string (throws 503 if unset in prod).
 */
export const backendUrl: string | undefined =
  import.meta.env.VITE_BACKEND_URL ??
  (import.meta.env.DEV ? "http://localhost:3000" : undefined)

export function getBackendUrl(): string {
  if (!backendUrl) {
    throw new Response("Backend URL not configured", { status: 503 })
  }
  return backendUrl
}
