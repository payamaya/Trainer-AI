export interface BaseInputProps<
  T = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
> {
  label?: string
  type?: string
  name: string
  value: string | number
  onChange: React.ChangeEventHandler<T>
  placeholder?: string
  required?: boolean
  autoComplete?: string
}
