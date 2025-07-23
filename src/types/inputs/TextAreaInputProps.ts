import type { BaseInputProps } from './BaseInputProps'

export interface TextAreaInputProps
  extends BaseInputProps<HTMLTextAreaElement> {
  onClear?: () => void
  rows?: number
  className?: string
  disabled?: boolean
  showClearButton?: boolean
}
