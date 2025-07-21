import type { InputBaseProps } from './InputBaseProps'

export interface NumberInputProps extends InputBaseProps {
  value: number | ''
  onChange: (
    value: number | '',
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
}
