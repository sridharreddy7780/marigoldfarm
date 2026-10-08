import Photo from './Photo'
export default function FarmStory() {
  return (
    <section className="section section--cream" id="about">
      <div className="container story">
        <div className="story__media reveal">
          <Photo name={['farmer', 'flower-field', 'marigold-sacks']} position="center 30%" alt="Farmer Manohar Reddy at the marigold farm" />
        </div>
        <div className="story__text reveal">
          <h2>రైతు దగ్గర నుంచే తాజా బంతి పూలు</h2>
          <p>తాజాగా పండించిన బంతి పూలను హోల్‌సేల్ మరియు రిటైల్ కస్టమర్లకు అందిస్తున్నాము.</p>
          <p className="story__en">Fresh marigolds directly from the farm.</p>
        </div>
      </div>
    </section>
  )
}
