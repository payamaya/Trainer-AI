'use client'
import React, { forwardRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import './TextArea.css'
interface Props {
  label?: string
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  onClear?: () => void
  placeholder?: string
  required?: boolean
  rows?: number
  className?: string
  disabled?: boolean
  showClearButton?: boolean
}

const TextAreaInput = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      label,
      rows = 3,
      className = '',
      value,
      onChange,
      onClear,
      showClearButton = true,
      ...rest
    },
    ref
  ) => {
    const handleClear = () => {
      // Create a synthetic event to clear the value
      const event = {
        target: {
          value: '',
          name: rest.name || 'textarea',
        },
      } as React.ChangeEvent<HTMLTextAreaElement>

      onChange(event)
      onClear?.()
    }

    return (
      <div className={`form-group ${className}`}>
        {label && <label>{label}</label>}
        <div className='textarea-wrapper'>
          <textarea
            ref={ref}
            rows={rows}
            value={value}
            onChange={onChange}
            {...rest}
            className='text-area-input'
          />
          {showClearButton && value && (
            <button
              type='button'
              onClick={handleClear}
              className='clear-button'
              aria-label='Clear text'
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>
    )
  }
)

TextAreaInput.displayName = 'TextAreaInput'

export default TextAreaInput
