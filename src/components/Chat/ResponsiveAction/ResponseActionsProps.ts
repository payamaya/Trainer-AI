export interface ResponseActionsProps {
  response: string
  setInput: (input: string) => void
  onDownloadClick: () => void
  onTranslate?: (text: string) => void
  isTranslating: boolean
  targetLanguage: string
  setTargetLanguage: (lang: string) => void
  translatedResponse: string
}
