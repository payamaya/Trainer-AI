import React from 'react'

export interface FormFieldProps {
  label?: string
  htmlFor: string
  children: React.ReactNode
  className?: string
  error?: string
  helpText?: string
}
