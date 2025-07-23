import type { BaseInputProps } from './BaseInputProps'

export interface SelectInputProps extends BaseInputProps<HTMLSelectElement> {
  options: string[]
}
