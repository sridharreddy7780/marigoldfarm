import { getImage } from '../utils/images'
export default function Photo({ name, alt, className = '', eager = false, position }) {
  const src = getImage(name)
  if (!src) return <div className={`photo photo--empty ${className}`} role="img" aria-label={alt} />
  return (
    <img className={`photo ${className}`} src={src} alt={alt}
      loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : undefined}
      decoding="async" style={position ? { objectPosition: position } : undefined} />
  )
}
