import React from 'react'
import type { SelectInputProps } from './SelectInputProps'

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, options, className = '', renderOption, ...rest }, ref) => (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={rest.id}>{label}</label>}
      <select ref={ref} {...rest}>
        <option value=''>{rest.placeholder || 'Select'}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {renderOption
              ? renderOption(opt)
              : opt[0].toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
)

SelectInput.displayName = 'SelectInput'
export default SelectInput
