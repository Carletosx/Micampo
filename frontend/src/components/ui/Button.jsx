import React from 'react'

const variants = {
  primary: 'bg-green-600 hover:bg-green-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
  dangerGhost: 'bg-transparent text-red-600 hover:bg-red-50'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base'
}

const Button = ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md transition focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed'
  const cn = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  return (
    <button className={cn} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
