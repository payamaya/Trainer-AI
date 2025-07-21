import React from 'react'
import type { TextInputProps } from './TextInputProps'

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, className = '', onChange, ...rest }, ref) => (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={rest.id}>{label}</label>}
      <input
        ref={ref}
        type='text'
        onChange={(e) => onChange?.(e.target.value, e)}
        {...rest}
      />
    </div>
  )
)

TextInput.displayName = 'TextInput'
export default TextInput
