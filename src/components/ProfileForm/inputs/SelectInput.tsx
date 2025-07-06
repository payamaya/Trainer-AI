import React from 'react'

interface Props {
  label: string
  name: string
  value: string
  options: string[]
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  required?: boolean
}

const SelectInput = ({
  label,
  name,
  value,
  options,
  onChange,
  required,
}: Props) => (
  <div className='form-group'>
    <label>{label}</label>
    <select name={name} value={value} onChange={onChange} required={required}>
      <option value=''>Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt[0].toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
)

export default SelectInput
