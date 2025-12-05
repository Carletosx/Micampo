import React, { useState, useRef, useEffect } from 'react'

const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 bg-transparent p-0 m-0 border-0 focus:outline-none ring-0 shadow-none appearance-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open && (
        <div className={`absolute mt-2 min-w-[12rem] rounded-xl border border-gray-100 bg-white shadow-xl z-50 ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <div className="py-2">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
