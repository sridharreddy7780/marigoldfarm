import Photo from './Photo'
import { WhatsAppButton } from './Buttons'
import { messages } from '../data/business'
const items = [
  { key: 'yellow', en: 'Yellow Banti', te: 'పసుపు బంతి', text: 'తాజాగా పండించిన పసుపు బంతి పూలు', cta: 'Order Yellow Banti', alt: 'Fresh yellow marigold (Banti) flowers' },
  { key: 'orange', en: 'Orange Banti', te: 'ఆరెంజ్ బంతి', text: 'తాజాగా పండించిన ఆరెంజ్ బంతి పూలు', cta: 'Order Orange Banti', alt: 'Fresh orange marigold (Banti) flowers' },
]
export default function FlowerVarieties() {
  return (
    <section className="section" id="flowers">
      <div className="container">
        <div className="head reveal">
          <h2>మా బంతి పూలు</h2>
          <p>Fresh Yellow &amp; Orange Marigolds</p>
        </div>
        <div className="varieties">
          {items.map((i) => (
            <article key={i.key} className="variety reveal">
              <div className="variety__media"><Photo name={i.key} alt={i.alt} /></div>
              <div className="variety__body">
                <h3>{i.en} <span>{i.te}</span></h3>
                <p>{i.text}</p>
                <WhatsAppButton message={messages[i.key]} variant="primary">{i.cta}</WhatsAppButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
