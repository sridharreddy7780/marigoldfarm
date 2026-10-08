import { Phone, MessageCircle, MapPin } from 'lucide-react'
import { whatsappUrl, telUrl, mapsUrl } from '../utils/whatsapp'
import { messages } from '../data/business'
export const WhatsAppButton = ({ children = 'WhatsApp Order', message = messages.general, variant = 'primary', className = '' }) => (
  <a className={`btn btn--${variant} ${className}`} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
    <MessageCircle size={20} aria-hidden="true" /> {children}
  </a>
)
export const CallButton = ({ children = 'Call Now', variant = 'outline', className = '' }) => (
  <a className={`btn btn--${variant} ${className}`} href={telUrl}>
    <Phone size={19} aria-hidden="true" /> {children}
  </a>
)
export const DirectionsButton = ({ children = 'Get Directions', variant = 'outline', className = '' }) => (
  <a className={`btn btn--${variant} ${className}`} href={mapsUrl()} target="_blank" rel="noopener noreferrer">
    <MapPin size={19} aria-hidden="true" /> {children}
  </a>
)
