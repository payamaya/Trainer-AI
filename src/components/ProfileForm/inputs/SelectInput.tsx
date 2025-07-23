import type { SelectInputProps } from '../../../types/inputs/SelectInputProps'
import FormField from './FormField'

const SelectInput = ({
  label,
  name,
  value,
  options,
  onChange,
  required,
}: SelectInputProps) => (
  <FormField label={label} htmlFor={name}>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value=''>Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt[0].toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </FormField>
)

export default SelectInput
