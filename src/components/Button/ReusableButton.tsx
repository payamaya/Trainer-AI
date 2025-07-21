import React from 'react'
import './Button.css'
import type { ButtonProps } from './ButtonInterface'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      children,
      fullWidth = false,
      isLoading = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: 'bg-accent hover:bg-btnHover text-btnText',
      secondary: 'bg-section-bg hover:bg-opacity-90 text-text-color',
      submit: 'submitBtn', // Using your existing submit-profile class
      logout: 'bg-accent hover:bg-btnHover text-section-bg',
    }

    const sizeClasses = {
      sm: 'py-2 px-3 text-sm',
      md: 'py-2.5 px-4 text-base',
      lg: 'py-3 px-6 text-lg',
    }

    return (
      <button
        ref={ref}
        className={`
          rounded-[var(--borderRaduis)]
          transition-all duration-300 ease-in-out
          flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : 'w-auto'}
          ${className}
        `}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className='animate-spin'>↻</span>
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
