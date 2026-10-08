import { Phone, MessageCircle } from 'lucide-react'
import { whatsappUrl, telUrl } from '../utils/whatsapp'
export default function MobileActionBar() {
  return (
    <div className="actionbar" role="group" aria-label="Quick contact">
      <a className="actionbar__call" href={telUrl}><Phone size={20} aria-hidden="true" /> Call Now</a>
      <a className="actionbar__wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true" /> WhatsApp Order</a>
    </div>
  )
}
