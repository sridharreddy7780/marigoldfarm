import Photo from './Photo'
import { WhatsAppButton, CallButton } from './Buttons'
import { business } from '../data/business'
export default function FinalCTA() {
  return (
    <section className="contact" id="contact">
      <Photo name={['orange-banti', 'yellow-banti', 'flower-field']} alt="Fresh orange marigold flowers" />
      <div className="contact__shade" />
      <div className="container contact__in reveal">
        <h2>తాజా బంతి పూల కోసం సంప్రదించండి</h2>
        <p className="contact__name">{business.name}</p>
        <a className="contact__phone" href={`tel:${business.phoneTel}`} aria-label={`Call ${business.phoneDisplay}`}>{business.phoneDisplay}</a>
        <div className="contact__btns">
          <WhatsAppButton />
          <CallButton variant="light" />
        </div>
        <p className="contact__small">Wholesale &amp; Retail Available</p>
      </div>
    </section>
  )
}
