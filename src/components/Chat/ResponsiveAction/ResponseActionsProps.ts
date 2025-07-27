// ResponsiveAction/ResponseActionsProps.ts
export interface ResponseActionsProps {
  response: string
  setInput: (input: string) => void
  onDownloadClick: () => void
  onTranslate?: (text: string) => void // Now required to pass text
  isTranslating: boolean // Add this
  targetLanguage: string // Add this
  setTargetLanguage: (lang: string) => void // Add this
  translatedResponse: string // Add this
}
