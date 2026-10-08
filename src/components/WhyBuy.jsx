import { Flower2, Sprout, Package, BadgeIndianRupee } from 'lucide-react'
const perks = [
  [Flower2, 'Fresh Farm Harvest', 'తాజాగా పండించిన పూలు'],
  [Sprout, 'Direct From Farmer', 'రైతు దగ్గర నుంచే'],
  [Package, 'Wholesale & Retail', 'హోల్‌సేల్ & రిటైల్'],
  [BadgeIndianRupee, 'Better Price', 'మార్కెట్ కంటే తక్కువ ధరకే'],
]
export default function WhyBuy() {
  return (
    <section className="section why">
      <div className="container">
        <ul className="perks">
          {perks.map(([Icon, en, te]) => (
            <li key={en} className="reveal">
              <Icon size={24} aria-hidden="true" />
              <div><strong>{en}</strong><span>{te}</span></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
