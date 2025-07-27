import type { ReactNode } from 'react'

export interface ResponseActionsProps {
  children: ReactNode
  response: string
  setInput: (input: string) => void
  onDownloadClick: () => void
}
