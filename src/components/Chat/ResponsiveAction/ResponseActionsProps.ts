export interface ResponseActionsProps {
  response: string
  setInput: (input: string) => void
  onDownloadClick: () => void
  onTranslate?: (text: string) => void
}
