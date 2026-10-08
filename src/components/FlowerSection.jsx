import Photo from './Photo'
import { WhatsAppButton } from './Buttons'
import { messages } from '../data/business'
const items = [
  { key: 'yellow', img: 'yellow-banti', en: 'Yellow Banti', te: 'పసుపు బంతి', sub: 'Fresh Yellow Marigolds', cta: 'Order Yellow Banti', alt: 'Fresh yellow marigold flowers' },
  { key: 'orange', img: 'orange-banti', en: 'Orange Banti', te: 'ఆరెంజ్ బంతి', sub: 'Fresh Orange Marigolds', cta: 'Order Orange Banti', alt: 'Fresh orange marigold flowers' },
]
export default function FlowerSection() {
  return (
    <section className="section" id="flowers">
      <div className="container">
        <div className="head reveal">
          <h2>మా బంతి పూలు</h2>
          <p>Fresh Farm Marigolds</p>
        </div>
      </div>
      {items.map((i, n) => (
        <article key={i.key} className={`flower container reveal ${n % 2 ? 'flower--flip' : ''}`}>
          <div className="flower__media"><Photo name={i.img} alt={i.alt} /></div>
          <div className="flower__body">
            <h3>{i.en}<span>{i.te}</span></h3>
            <p>{i.sub}</p>
            <WhatsAppButton message={messages[i.key]}>{i.cta}</WhatsAppButton>
          </div>
        </article>
      ))}
    </section>
  )
}
