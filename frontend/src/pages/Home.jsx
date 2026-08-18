import { Link } from 'react-router-dom'

function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-copy-block">
          <p className="eyebrow">A clearer way to see local waste</p>
          <h1>Turn a community concern into a place to start.</h1>
          <p className="lead">CivicBridge gives people a simple way to inspect an image for visible garbage, understand what is in view, and begin a more informed local conversation.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/garbage-detection">Detect garbage <span aria-hidden="true">→</span></Link>
            <a className="button button-quiet" href="#how-it-works">How it works</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-card">
            <span>Image insight</span>
            <strong>See what needs attention.</strong>
            <i>↗</i>
          </div>
          <div className="visual-note"><span className="visual-note-dot" />Built for a first look</div>
        </div>
      </section>
      <section className="platform-section" id="how-it-works">
        <div className="section-intro"><p className="eyebrow">A bridge between insight and action</p><h2>Practical technology for people who care where they live.</h2></div>
        <div className="platform-copy"><p>CivicBridge is a focused starting point for exploring visible waste in an image. It connects a straightforward upload experience with a computer-vision model, so the result is easy to review and discuss.</p><p>It does not replace local knowledge or civic decision-making. It helps make the first observation clearer.</p></div>
      </section>
      <section className="home-value feature-section" aria-labelledby="features-title">
        <p className="eyebrow">What you can do</p>
        <h2 id="features-title">A small workflow with a useful purpose.</h2>
        <div className="value-grid">
          <article><span>01</span><h3>Observe</h3><p>Upload a clear photo of the place or area you want to examine.</p></article>
          <article><span>02</span><h3>Understand</h3><p>Review the objects the detection model identifies in the image.</p></article>
          <article><span>03</span><h3>Act together</h3><p>Use a shared visual starting point for a more grounded community conversation.</p></article>
        </div>
      </section>
      <section className="impact-section">
        <div className="impact-panel">
          <div><p className="eyebrow">Community impact</p><h2>Better local action starts with shared context.</h2></div>
          <p>Civic work is collaborative. When residents and teams can look at the same information, it becomes easier to ask useful questions, notice patterns, and decide what deserves attention next.</p>
          <Link className="button button-secondary" to="/garbage-detection">Start with an image <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  )
}

export default Home
