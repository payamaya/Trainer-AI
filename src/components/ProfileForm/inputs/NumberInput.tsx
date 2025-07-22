import React from 'react'

interface Props {
  label: string
  name: string
  value: number | string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  min?: number
  max?: number
  required?: boolean
}

const NumberInput = ({ label, value, onChange, ...rest }: Props) => {
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
    <div className='form-group'>
      <label>{label}</label>
      <input
        type='number'
        value={inputValue}
        onChange={handleChange}
        {...rest}
      />
    </div>
  )
}

export default NumberInput
