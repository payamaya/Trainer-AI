import React from 'react'

interface Props {
  label: string
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  required?: boolean
}

const TextInput = ({ label, ...rest }: Props) => (
  <div className='form-group'>
    <label>{label}</label>
    <input type='text' {...rest} />
  </div>
)

export default TextInput
