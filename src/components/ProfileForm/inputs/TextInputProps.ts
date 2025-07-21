import type { InputBaseProps } from './InputBaseProps'

export interface TextInputProps extends InputBaseProps {
  onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  pattern?: string
  autoComplete?: string
  maxLength?: number
}
