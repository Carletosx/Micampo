import React from 'react'

const Card = ({ title, actions, className = '', children }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {(title || actions) && (
        <div className="p-5 border-b flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

export default Card
