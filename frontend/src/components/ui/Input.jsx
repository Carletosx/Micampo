import React from 'react'

const Input = ({ id, name, label, type = 'text', value, onChange, placeholder, disabled, error, required=false, className = '' }) => {
  const base = `w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md`
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        className={base}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Input
