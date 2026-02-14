import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className={`${sizes[size]} border-2 border-accent-yellow/30 border-t-accent-yellow rounded-full`}
      />
      {text && (
        <p className="text-text-muted text-sm animate-pulse">{text}</p>
      )}
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading content..." />
    </div>
  )
}

export const ButtonLoader = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full"
    />
  )
}

export default LoadingSpinner
