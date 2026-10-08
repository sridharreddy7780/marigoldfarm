import Photo from './Photo'
export default function FestivalSection() {
  return (
    <section className="festival">
      <Photo name={['bathukamma', 'marigold-sacks', 'flower-field']} alt="Fresh flowers arranged for the Bathukamma festival" />
      <div className="festival__shade" />
      <div className="container festival__in reveal">
        <h2>బతుకమ్మ • దసరా • దీపావళి</h2>
        <p>పండుగల కోసం తాజా బంతి పూలు</p>
      </div>
    </section>
  )
}
