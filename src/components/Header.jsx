import { Phone } from 'lucide-react'
import { business } from '../data/business'
import { telUrl } from '../utils/whatsapp'
const links = [['#flowers', 'Flowers'], ['#about', 'About'], ['#location', 'Location'], ['#contact', 'Contact']]
export default function Header() {
  return (
    <header className="header">
      <div className="container header__in">
        <a href="#top" className="brand" aria-label={business.name}>
          <span className="brand__name">{business.name}</span>
          <span className="brand__sub">{business.tagline}</span>
        </a>
        <nav className="nav" aria-label="Main">
          {links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}
        </nav>
        <a className="header__call" href={telUrl} aria-label="Call Now">
          <Phone size={18} aria-hidden="true" /><span>Call Now</span>
        </a>
      </div>
    </header>
  )
}
