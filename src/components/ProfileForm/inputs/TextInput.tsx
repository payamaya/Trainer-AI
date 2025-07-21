import React from 'react'

interface Props {
  label: string
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  required?: boolean
  id?: string
  autoComplete?: boolean
}

const TextInput = ({ label, name, id, ...rest }: Props) => {
  const inputId = id || `input-${name}` // Generate fallback ID if not provided

  return (
    <div className='form-group'>
      <label htmlFor={inputId}>{label}</label>
      <input
        type='text'
        id={inputId}
        name={name}
        {...rest}
        autoComplete='true'
      />
    </div>
  )
}

export default TextInput
