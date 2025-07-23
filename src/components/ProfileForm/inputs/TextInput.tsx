import type { TextInputProps } from '../../../types/inputs/TextInputProps'
import FormField from './FormField'

const TextInput = ({ label, name, autoComplete, ...rest }: TextInputProps) => (
  <FormField label={label} htmlFor={name}>
    <input
      id={name}
      name={name}
      autoComplete={autoComplete}
      type='text'
      {...rest}
    />
  </FormField>
)

export default TextInput
