import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('ErrorBoundary:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[120px] p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 text-sm">Ha ocurrido un error inesperado.</p>
          <button className="mt-2 px-3 py-1.5 text-xs rounded bg-red-600 text-white" onClick={() => this.setState({ hasError: false })}>Reintentar</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
