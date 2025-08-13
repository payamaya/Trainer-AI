export const getFirebaseAppRefererUrl = (): string => {
  // Use Vite's environment variables for all cases
  // VERCEL_ENV is a Vercel-specific variable, so you would need to expose it to Vite with VITE_
  if (
    import.meta.env.VITE_VERCEL_ENV === 'production' ||
    import.meta.env.VITE_VERCEL_ENV === 'preview'
  ) {
    // Return the Vercel URL, which should also be exposed to Vite with VITE_
    return `https://${import.meta.env.VITE_VERCEL_URL}`
  } else {
    // Fallback for local development
    return import.meta.env.VITE_APP_REFERER_URL || 'http://localhost:5174'
  }
}
