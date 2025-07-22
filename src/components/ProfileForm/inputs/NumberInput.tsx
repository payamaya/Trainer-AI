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

const NumberInput = ({ label, ...rest }: Props) => (
  <div className='form-group'>
    <label>{label}</label>
    <input type='number' {...rest} />
  </div>
)

export default NumberInput
