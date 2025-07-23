import React from 'react'

import FormField from './FormField'
import type { NumberInputProps } from '../../../types/inputs/NumberInputProps'

const NumberInput = ({
  label,
  value,
  name,
  onChange,
  ...rest
}: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert empty string to 0 or keep the number value
    const numericValue = e.target.value === '' ? 0 : Number(e.target.value)
    e.target.value = numericValue.toString()
    onChange(e)
  }

  // Convert value to string for input, handling NaN cases
  const inputValue =
    typeof value === 'number' ? (isNaN(value) ? '' : value.toString()) : value

  return (
    <FormField label={label} htmlFor={name}>
      <input
        id={name}
        name={name}
        type='number'
        value={inputValue}
        onChange={handleChange}
        {...rest}
      />
    </FormField>
  )
}

export default NumberInput
