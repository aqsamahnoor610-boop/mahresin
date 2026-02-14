import HeroSlider from '../components/Home/HeroSlider'
import WelcomeSection from '../components/Home/WelcomeSection'
import FeaturedProducts from '../components/Home/FeaturedProducts'
import AISection from '../components/Home/AISection'

const Home = () => {
  return (
    <div className="-mt-20">
      <HeroSlider />
      <WelcomeSection />
      <FeaturedProducts />
      <AISection />
    </div>
  )
}

export default Home
