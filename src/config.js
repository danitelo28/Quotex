// Backend API base URL.
// Resolution order:
//   1. window.__API_BASE__            runtime override (set in a script tag before the bundle)
//   2. import.meta.env.VITE_API_BASE  build-time override
//   3. auto-detect from the page URL — works from the Vite dev server,
//      from the project root, and from the built dist/ folder (API is one level up).
function detectApiBase() {
  if (typeof window === 'undefined') return '/api'
  const path = window.location.pathname
  const dir = path.replace(/\/[^/]*$/, '/')
  const segments = dir.split('/').filter(Boolean)
  if (segments[segments.length - 1] === 'dist') segments.pop()
  return segments.length ? '/' + segments.join('/') + '/api' : '/api'
}

export const API_BASE =
  (typeof window !== 'undefined' && window.__API_BASE__) ||
  import.meta.env.VITE_API_BASE ||
  detectApiBase()
