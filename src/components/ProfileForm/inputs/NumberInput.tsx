import React from 'react'
import type { NumberInputProps } from './NumberInputProps'

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, className = '', onChange, value, ...rest }, ref) => (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={rest.id}>{label}</label>}
      <input
        ref={ref}
        type='number'
        value={value === '' ? '' : Number(value)}
        onChange={(e) =>
          onChange?.(e.target.value === '' ? '' : Number(e.target.value), e)
        }
        {...rest}
      />
    </div>
  )
)

NumberInput.displayName = 'NumberInput'
export default NumberInput
