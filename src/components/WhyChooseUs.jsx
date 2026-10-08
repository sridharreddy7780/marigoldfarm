import { Flower2, Sprout, Package, BadgeIndianRupee } from 'lucide-react'
import Photo from './Photo'
import { WhatsAppButton } from './Buttons'
import { messages, business } from '../data/business'
const perks = [
  [Flower2, 'Fresh Farm Harvest', 'తాజాగా పండించిన పూలు'],
  [Sprout, 'Direct From Farmer', 'రైతు దగ్గర నుంచే'],
  [Package, 'Wholesale & Retail', 'హోల్‌సేల్ & రిటైల్ ఆర్డర్లు'],
  [BadgeIndianRupee, 'Competitive Price', 'మార్కెట్ కంటే తక్కువ ధరకే'],
]
export default function WhyChooseUs() {
  return (
    <>
      <section className="section section--cream" id="why">
        <div className="container why">
          <div className="why__photo reveal"><Photo name="farmer" position="center top" alt="Farmer Manohar Reddy with fresh marigold flowers" /></div>
          <div className="why__text">
            <h2 className="reveal">రైతు దగ్గర నుంచే తాజా బంతి పూలు</h2>
            <ul className="perks">
              {perks.map(([Icon, en, te]) => (
                <li key={en} className="reveal">
                  <Icon size={26} aria-hidden="true" />
                  <div><strong>{en}</strong><span>{te}</span></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="band" id="wholesale">
        <div className="container band__in reveal">
          <h2>హోల్‌సేల్ &amp; రిటైల్ ఆర్డర్లు అందుబాటులో</h2>
          <p>పెద్ద మొత్తంలో కావాలన్నా, రిటైల్‌గా కావాలన్నా ఆర్డర్ చేయండి.</p>
          <p className="band__en">Wholesale &amp; Retail Orders Available</p>
          <p className="band__phone"><a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a></p>
          <p className="band__note">Contact the farmer directly</p>
          <div className="band__cta">
            <WhatsAppButton message={messages.wholesale} variant="gold">WhatsApp for Orders</WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  )
}
