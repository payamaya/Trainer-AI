import React from 'react'
import type { FormFieldProps } from '../../../types/forms/FormFieldProps'
import '../inputs/TextAreaInput/TextArea.css'
const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  children,
  helpText,
  error,
  className = '',
}) => (
  <div className={`form-group ${className}`}>
    {label && <label htmlFor={htmlFor}>{label}</label>}
    {children}
    {helpText && <small className='help-text'>{helpText}</small>}
    {error && <div className='error-text'>{error}</div>}
  </div>
)

export default FormField
