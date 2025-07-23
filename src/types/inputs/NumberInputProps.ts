import type { BaseInputProps } from './BaseInputProps'

export interface NumberInputProps extends BaseInputProps<HTMLInputElement> {
  min?: number
  max?: number
}
