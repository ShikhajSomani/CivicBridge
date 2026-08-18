import { NavLink } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <nav className="nav-content" aria-label="Main navigation">
        <NavLink className="brand" to="/" aria-label="CivicBridge home">
          <span className="brand-mark" aria-hidden="true">CB</span>
          <span>CivicBridge</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/garbage-detection">Garbage Detection</NavLink>
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button className="nav-logout" type="button" onClick={onLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <NavLink className="nav-cta" to="/signup">Get started</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
