import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const WelcomeSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
            Our Story
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8 font-['Playfair_Display'] text-text-light">
            Crafting Beauty from{' '}
            <span className="gradient-text">Resin & Imagination</span>
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="text-text-light/70 text-lg leading-relaxed">
            Welcome to MahResin World, where artistry meets craftsmanship. 
            Each piece in our collection is meticulously handcrafted, transforming 
            ordinary resin into extraordinary works of art that capture light, 
            color, and imagination.
          </p>
          <p className="text-text-light/70 text-lg leading-relaxed">
            From stunning coasters and elegant jewelry to bespoke home décor, 
            our creations are designed to bring a touch of luxury and uniqueness 
            to your everyday life. Every swirl of color, every embedded element 
            tells a story of patience, passion, and artistic vision.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center space-x-12"
        >
          {[
            { number: '500+', label: 'Products Created' },
            { number: '1000+', label: 'Happy Customers' },
            { number: '50+', label: 'Unique Designs' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                {stat.number}
              </div>
              <div className="text-text-muted text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default WelcomeSection
