import type { TextInputProps } from '../../../types/inputs/TextInputProps'
import FormField from './FormField'

const TextInput = ({ label, name, ...rest }: TextInputProps) => (
  <FormField label={label} htmlFor={name}>
    <input id={name} name={name} type='text' {...rest} />
  </FormField>
)

export default TextInput
