import { Phone, ShoppingBag } from 'lucide-react'
import { business } from '../data/business'
import { telUrl } from '../utils/whatsapp'
import { useCart } from '../context/useCart'
import { Link } from 'react-router-dom'
const links = [['/#top', 'Home'], ['/#flowers', 'Flowers'], ['/#about', 'About Farm'], ['/#location', 'Location']]
export default function Header() {
  const { itemCount } = useCart()
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
        <div className="header__actions">
          <a className="header__call" href={telUrl} aria-label="Call Now">
            <Phone size={18} aria-hidden="true" /><span>Call Now</span>
          </a>
          <Link className="header__cart" to="/cart" aria-label={itemCount ? `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : 'Cart'}>
            <ShoppingBag size={20} aria-hidden="true" />
            {itemCount > 0 && <span className="header__cart-count">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
