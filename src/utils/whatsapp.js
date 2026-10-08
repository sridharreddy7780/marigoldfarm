import { business, messages } from '../data/business'
export const whatsappUrl = (message = messages.general) =>
  `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`
export const openWhatsApp = (message = messages.general) =>
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
export const telUrl = `tel:${business.phoneTel}`
export const mapsUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapsQuery)}`
export const openMaps = () => window.open(mapsUrl(), '_blank', 'noopener,noreferrer')
