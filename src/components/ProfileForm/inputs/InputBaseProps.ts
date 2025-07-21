export interface InputBaseProps {
  label: string
  name: string
  required?: boolean
  className?: string
  disabled?: boolean
  id?: string
  'aria-label'?: string
  'data-testid'?: string
}
export interface InputChangeProps<T = string> {
  onChange: (
    value: T,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  value: T
}
