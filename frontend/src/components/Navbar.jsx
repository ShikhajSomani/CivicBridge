import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)
  return (
    <header className="navbar">
      <nav className="nav-content" aria-label="Main navigation">
        <NavLink className="brand" to="/" aria-label="CivicBridge home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">CB</span>
          <span>CivicBridge</span>
        </NavLink>
        <button className="nav-menu-toggle" type="button" aria-expanded={isMenuOpen} aria-controls="primary-navigation" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="visually-hidden">{isMenuOpen ? 'Close' : 'Open'} navigation menu</span>
          <span /><span /><span />
        </button>
        <div id="primary-navigation" className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/garbage-detection" onClick={closeMenu}>Garbage Detection</NavLink>
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="nav-logout" type="button" onClick={() => { onLogout(); closeMenu() }}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>Sign in</NavLink>
              <NavLink className="nav-cta" to="/signup" onClick={closeMenu}>Get started</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
