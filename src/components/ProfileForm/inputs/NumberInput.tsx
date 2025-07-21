import React from 'react'

interface Props {
  label: string
  name: string
  value: number | ''
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  min?: number
  max?: number
  required?: boolean
  id?: string
  autoComplete?: boolean
}

const NumberInput = ({ label, name, id, ...rest }: Props) => {
  const inputId = id || `input-${name}`
  return (
    <div className='form-group'>
      <label htmlFor={inputId}>{label}</label>
      <input
        type='number'
        id={inputId}
        name={name}
        {...rest}
        autoComplete='true'
      />
    </div>
  )
}

export default NumberInput
