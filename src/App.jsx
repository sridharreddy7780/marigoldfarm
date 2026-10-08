import Header from './components/Header'
import Hero from './components/Hero'
import FlowerSection from './components/FlowerSection'
import FarmStory from './components/FarmStory'
import WhyBuy from './components/WhyBuy'
import FestivalSection from './components/FestivalSection'
import WholesaleRetail from './components/WholesaleRetail'
import Location from './components/Location'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import MobileActionBar from './components/MobileActionBar'
import useReveal from './utils/useReveal'
export default function App() {
  useReveal()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FlowerSection />
        <FarmStory />
        <WhyBuy />
        <FestivalSection />
        <WholesaleRetail />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}
