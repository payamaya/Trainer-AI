'use client'

import React, { forwardRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import './TextArea.css'
import FormField from './FormField'
import type { TextAreaInputProps } from '../../../types/inputs/TextAreaInputProps'

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
            ref={ref}
            id={name}
            name={name}
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
      </FormField>
    )
  }
)

TextAreaInput.displayName = 'TextAreaInput'

export default TextAreaInput
