import { motion } from 'framer-motion'

// Using slider image as hero from public folder
const heroImage = '/assets/slider/sliderimage2.jpeg'

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
                Our Story
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mt-2 mb-6 font-['Playfair_Display'] text-text-light">
                About <span className="gradient-text">MahResin World</span>
              </h1>
              
              <div className="space-y-6 text-text-light/70 leading-relaxed">
                <p>
                  Welcome to MahResin World, where passion meets artistry. Founded with a love 
                  for creating unique, handcrafted resin art pieces, we've dedicated ourselves 
                  to transforming ordinary moments into extraordinary keepsakes.
                </p>
                <p>
                  Every piece in our collection tells a story. From the swirling galaxies 
                  captured in our jewelry to the ocean waves frozen in our coasters, each 
                  creation is meticulously crafted with premium materials and boundless creativity.
                </p>
                <p>
                  Our journey began in a small home studio, driven by the dream of sharing 
                  the magic of resin art with the world. Today, we've grown into a beloved 
                  brand, trusted by thousands of customers who share our appreciation for 
                  unique, handmade beauty.
                </p>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="MahResin World Workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent" />
              </div>
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-card"
              >
                <div className="text-3xl font-bold gradient-text">5+ Years</div>
                <p className="text-text-muted text-sm">of Crafting Excellence</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
              What We Stand For
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 font-['Playfair_Display'] text-text-light">
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Creativity',
                description: 'Each piece is a unique expression of artistic vision, combining colors, textures, and elements in ways that inspire wonder.'
              },
              {
                icon: '✨',
                title: 'Quality',
                description: 'We use only premium materials and meticulous techniques to ensure every creation meets our exacting standards.'
              },
              {
                icon: '💚',
                title: 'Sustainability',
                description: "We're committed to eco-friendly practices, using sustainable materials and minimizing waste in our creative process."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-card rounded-2xl p-8 text-center card-hover"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-text-light mb-3">{value.title}</h3>
                <p className="text-text-muted">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent-yellow text-sm tracking-[0.3em] uppercase">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-8 font-['Playfair_Display'] text-text-light">
              Bringing Art to Life
            </h2>
            <p className="text-text-light/70 text-lg leading-relaxed">
              Our mission is to create beautiful, meaningful pieces that bring joy to everyday 
              moments. We believe that art should be accessible to everyone, and that each 
              handcrafted piece has the power to transform spaces and touch hearts. Through 
              our work, we aim to preserve memories, celebrate beauty, and inspire creativity 
              in all who encounter our creations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '1000+', label: 'Happy Customers' },
              { number: '500+', label: 'Unique Creations' },
              { number: '50+', label: 'Collections' },
              { number: '100%', label: 'Handcrafted' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <p className="text-text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
