'use client'

import React, { forwardRef } from 'react'
import { FaTimes } from 'react-icons/fa'

import FormField from '../FormField'
import type { TextAreaInputProps } from '../../../../types/inputs/TextAreaInputProps'
import './TextArea.css'

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  (
    {
      label,
      name = 'textarea',
      rows = 3,
      className = '',
      value,
      onChange,
      onClear,
      showClearButton = true,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const handleClear = () => {
      const event = {
        target: {
          value: '',
          name,
        },
      } as React.ChangeEvent<HTMLTextAreaElement>

      onChange(event)
      onClear?.()
    }

    return (
      <FormField label={label} htmlFor={name} className={className}>
        <div className='textarea-wrapper'>
          <textarea
            className={`text-area-input ${disabled ? 'disabled' : ''}`}
            ref={ref}
            id={name}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            disabled={disabled}
            {...rest}
          />
          {showClearButton && value && !disabled && (
            <button
              type='button'
              onClick={handleClear}
              className='clear-button'
              aria-label='Clear text'
              disabled={disabled}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </FormField>
    )
  }
)

TextAreaInput.displayName = 'TextAreaInput'

export default TextAreaInput
