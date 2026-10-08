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
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import CartPage from './components/CartPage'
import CheckoutPage from './components/CheckoutPage'
import { OrderStatusPage, PaymentProblemPage } from './components/OrderStatusPage'

function HomePage() {
  useReveal()
  return (
    <>
      <main className="home-page">
        <Hero />
        <FlowerSection />
        <FarmStory />
        <WhyBuy />
        <FestivalSection />
        <WholesaleRetail />
        <Location />
        <FinalCTA />
      </main>
      <MobileActionBar />
    </>
  )
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderStatusPage />} />
        <Route path="/payment-failed" element={<PaymentProblemPage />} />
        <Route path="/payment-cancelled" element={<PaymentProblemPage cancelled />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}
