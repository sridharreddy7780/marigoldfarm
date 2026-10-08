import { DirectionsButton } from './Buttons'
export default function Location() {
  return (
    <section className="section section--cream" id="location">
      <div className="container location reveal">
        <h2>మమ్మల్ని ఎక్కడ కలవాలి?</h2>
        <p className="location__te">కాలజ్యోతి సమీపంలో,<br />రవిర్యాల, తుక్కుగూడ</p>
        <p className="location__en">Near Kalajyothi,<br />Raviryala, Thukkuguda</p>
        <DirectionsButton variant="green" />
      </div>
    </section>
  )
}
