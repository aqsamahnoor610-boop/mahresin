import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-r from-primary-dark to-primary-deeper flex items-center justify-center p-8">
          <div className="bg-card rounded-2xl p-8 max-w-2xl w-full text-center">
            <h1 className="text-3xl font-bold text-accent-yellow mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-text-light mb-6">
              The application encountered an error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="bg-primary-deeper rounded-lg p-4 text-left mb-6 overflow-auto max-h-48">
                <p className="text-red-400 font-mono text-sm">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-accent-gold to-accent-teal text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
