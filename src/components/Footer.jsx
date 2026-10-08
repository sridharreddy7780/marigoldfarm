import { business } from '../data/business'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <strong>{business.name}</strong>
        <span>{business.tagline} · Yellow &amp; Orange Banti</span>
        <a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a>
        <span>Near Kalajyothi, Raviryala, Thukkuguda</span>
      </div>
    </footer>
  )
}
