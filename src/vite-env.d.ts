/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_OPENROUTER_API_URL: string
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_REFERER_URL: string
  readonly VITE_MODEL: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
