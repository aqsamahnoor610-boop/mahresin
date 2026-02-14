import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0E3B34',
            color: '#D1FAE5',
            border: '1px solid rgba(244, 180, 0, 0.3)',
          },
        }}
      />
    </ErrorBoundary>
  </React.StrictMode>,
)
