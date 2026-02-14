import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    { image: '/assets/slider/sliderimage1.jpeg', id: 1 },
    { image: '/assets/slider/sliderimage2.jpeg', id: 2 },
    { image: '/assets/slider/sliderimage3.jpeg', id: 3 },
    { image: '/assets/slider/sliderimage4.jpeg', id: 4 },
  ]

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary-dark/50 to-primary-dark/90" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-accent-yellow text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Welcome to
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-['Playfair_Display']"
          >
            <span className="gradient-text glow-text">MahResin</span>
            <span className="text-text-light"> World</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-text-light/80 text-lg md:text-xl lg:text-2xl mb-8 font-light"
          >
            Premium Handmade Resin Art
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/collections">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-button text-white px-8 py-4 rounded-full font-semibold text-lg btn-glow transition-all duration-300 shadow-glow"
              >
                Explore Collections
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/50 backdrop-blur-sm rounded-full flex items-center justify-center text-text-light hover:bg-accent-yellow hover:text-primary-dark transition-all duration-300 group"
      >
        <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/50 backdrop-blur-sm rounded-full flex items-center justify-center text-text-light hover:bg-accent-yellow hover:text-primary-dark transition-all duration-300 group"
      >
        <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-accent-yellow w-8'
                : 'bg-text-light/30 hover:bg-text-light/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-text-light/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-accent-yellow rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSlider
