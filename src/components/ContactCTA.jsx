import { WhatsAppButton, CallButton, DirectionsButton } from './Buttons'
import { business } from '../data/business'
export default function ContactCTA() {
  return (
    <section className="contact" id="contact">
      <div className="container contact__in reveal">
        <h2>ఆర్డర్ చేయడానికి ఇప్పుడే సంప్రదించండి</h2>
        <p className="contact__en">Order Fresh Marigolds</p>
        <p className="contact__name">{business.name}</p>
        <a className="contact__phone" href={`tel:${business.phoneTel}`} aria-label={`Call ${business.phoneDisplay}`}>{business.phoneDisplay}</a>
        <div className="contact__btns">
          <WhatsAppButton>WhatsApp Order</WhatsAppButton>
          <CallButton variant="light" />
          <DirectionsButton variant="light" />
        </div>
      </div>
    </section>
  )
}
