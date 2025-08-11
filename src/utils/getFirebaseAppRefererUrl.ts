export const getFirebaseAppRefererUrl = (): string => {
  // Use Vercel's specific environment variables if available, otherwise fall back.
  if (
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production'
  ) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  } else {
    // Fallback for local development or other environments
    return import.meta.env.VITE_APP_REFERER_URL || 'http://localhost:5174'
  }
}
