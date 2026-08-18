import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div><Link className="brand" to="/" aria-label="CivicBridge home"><span className="brand-mark" aria-hidden="true">CB</span><span>CivicBridge</span></Link><p>Technology for clearer community action.</p></div>
        <nav className="footer-links" aria-label="Footer navigation"><Link to="/">Home</Link><Link to="/garbage-detection">Garbage Detection</Link></nav>
        <p className="footer-note">A focused tool for a better first look.</p>
      </div>
    </footer>
  )
}

export default Footer
