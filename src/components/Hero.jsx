import Photo from './Photo'
import { WhatsAppButton, CallButton } from './Buttons'
import { messages } from '../data/business'
export default function Hero() {
  return (
    <section className="hero" id="top">
      <Photo name={['flower-field', 'yellow-banti', 'orange-banti']} eager className="hero__img" alt="Yellow and orange marigold flowers growing in the farm" />
      <div className="hero__shade" />
      <div className="container hero__in">
        <p className="hero__label">BATHUKAMMA • DASARA • DIWALI</p>
        <h1>
          <span className="hero__h1a">దసరా &amp; దీపావళి ప్రత్యేకం</span>
          <span className="hero__h1b">బంతి పూలు</span>
        </h1>
        <p className="hero__sub">ఎల్లో &amp; ఆరెంజ్ బంతి అందుబాటులో</p>
        <p className="hero__offer">మార్కెట్ కంటే తక్కువ ధరకే</p>
        <p className="hero__small">హోల్‌సేల్ &amp; రిటైల్ ఆర్డర్లు అందుబాటులో</p>
        <div className="hero__cta">
          <WhatsAppButton message={messages.general} />
          <CallButton variant="light" />
        </div>
      </div>
    </section>
  )
}
