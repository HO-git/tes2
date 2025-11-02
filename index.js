// Helper to safely call potential CSRF token providers
function tryGetCSRFTokenFromHelpers() {
  const helperCandidates = [
    () => (typeof window.getCSRFToken === "function" ? window.getCSRFToken() : null),
    () => (typeof window.getCsrfToken === "function" ? window.getCsrfToken() : null),
    () =>
      typeof window.SillyTavern?.getCSRFToken === "function"
        ? window.SillyTavern.getCSRFToken()
        : null,
    () =>
      typeof window.SillyTavern?.getCsrfToken === "function"
        ? window.SillyTavern.getCsrfToken()
        : null,
    () =>
      typeof window.SillyTavern?.extensions?.webui?.getCSRFToken === "function"
        ? window.SillyTavern.extensions.webui.getCSRFToken()
        : null,
    () =>
      typeof window.SillyTavern?.extensions?.webui?.getCsrfToken === "function"
        ? window.SillyTavern.extensions.webui.getCsrfToken()
        : null,
    // Try accessing token from localStorage as some ST versions store it there
    () => localStorage.getItem('csrf_token'),
    () => localStorage.getItem('csrfToken'),
    () => sessionStorage.getItem('csrf_token'),
    () => sessionStorage.getItem('csrfToken'),
  ]

  for (const helper of helperCandidates) {
    try {
      const token = helper()
      if (typeof token === "string" && token.trim().length > 0) {
        return token.trim()
      }
    } catch (error) {
      console.warn("[Qdrant Memory] Failed to read CSRF token from helper:", error)
    }
  }

  return null
}
