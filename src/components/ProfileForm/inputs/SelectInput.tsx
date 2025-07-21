import React from 'react'

interface Props {
  label: string
  name: string
  value: string
  options: string[]
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  required?: boolean
  id?: string
}

const SelectInput = ({
  label,
  name,
  value,
  options,
  onChange,
  required,
  id,
}: Props) => {
  const selectId = id || `select-${name}`
  return (
    <div className='form-group'>
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
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
    </div>
  )
}

export default SelectInput
