import Header from '../components/Header'
import FeatureCard from '../components/FeatureCard'

const features = [
  { title: 'Report with confidence', description: 'Make it easy for residents to flag local sanitation concerns.' },
  { title: 'Connect communities', description: 'Bring citizens and civic teams together around cleaner neighbourhoods.' },
  { title: 'Track local action', description: 'Build a clearer view of the work that helps a city thrive.' },
]

function HomePage() {
  return (
    <main className="home-page">
      <Header />
      <section className="hero">
        <div>
          <span className="eyebrow">A cleaner city starts together</span>
          <h1>Small reports. Stronger communities.</h1>
          <p className="hero-copy">CivicBridge helps citizens take meaningful action for a cleaner, healthier neighbourhood.</p>
          <div className="hero-actions">
            <button className="button button-primary">Get started</button>
            <button className="button button-secondary">Learn more</button>
          </div>
        </div>
        <aside className="impact-card">
          <p>One shared space for people who care about their community.</p>
          <strong>Better, together.</strong>
          <p>CivicBridge is ready to connect citizens with positive local action.</p>
        </aside>
      </section>
      <section className="feature-section">
        <h2>Built for civic participation</h2>
        <div className="feature-grid">{features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}</div>
      </section>
    </main>
  )
}

export default HomePage