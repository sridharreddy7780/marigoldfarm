import { WhatsAppButton, CallButton } from './Buttons'
import { messages, business } from '../data/business'
export default function WholesaleRetail() {
  return (
    <section className="band" id="wholesale">
      <div className="container band__in reveal">
        <h2>హోల్‌సేల్ &amp; రిటైల్ ఆర్డర్లు అందుబాటులో</h2>
        <p>పెద్ద మొత్తంలో కావాలన్నా, రిటైల్‌గా కావాలన్నా నేరుగా సంప్రదించండి.</p>
        <a className="band__phone" href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
        <div className="band__btns">
          <WhatsAppButton message={messages.wholesale} variant="gold" />
          <CallButton variant="light" />
        </div>
      </div>
    </section>
  )
}
