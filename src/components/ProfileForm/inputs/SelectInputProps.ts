import type { ChangeEventHandler } from 'react'
import type { InputBaseProps } from './InputBaseProps'

export interface SelectInputProps extends InputBaseProps {
  value: string
  options: string[]
  onChange: ChangeEventHandler<HTMLSelectElement>
  placeholder?: string
  renderOption?: (option: string) => React.ReactNode
}
