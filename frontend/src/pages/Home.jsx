import { Link } from 'react-router-dom'

function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-copy-block">
          <p className="eyebrow">Civic technology for cleaner neighbourhoods</p>
          <h1>See a cleaner future. Help make it happen.</h1>
          <p className="lead">CivicBridge brings practical technology and community action together to help identify waste concerns and build healthier public spaces.</p>
          <Link className="button button-primary" to="/garbage-detection">Try garbage detection <span aria-hidden="true">?</span></Link>
        </div>
        <div className="hero-visual" aria-hidden="true"><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-card"><span>Community signal</span><strong>Cleaner spaces</strong><i>?</i></div></div>
      </section>
      <section className="home-value"><p className="eyebrow">A bridge between insight and action</p><h2>Designed for people who care about where they live.</h2><div className="value-grid"><article><span>01</span><h3>Observe</h3><p>Bring local environmental concerns into focus.</p></article><article><span>02</span><h3>Understand</h3><p>Use clear visual information to support better decisions.</p></article><article><span>03</span><h3>Act together</h3><p>Turn shared awareness into positive civic action.</p></article></div></section>
    </main>
  )
}

export default Home