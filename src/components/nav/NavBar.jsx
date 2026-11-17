import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './nav.css'

function NavBar() {
  const { itemCount, openCart } = useCart()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.state])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}${menuOpen ? ' nav--open' : ''}`}>
      <div className="nav__bar">
        <Link to="/" className="nav__logo" onClick={() => setMenuOpen(false)}>
          Bloomfield &amp; Co.
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <NavLink to="/" end className="nav__link" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className="nav__link" onClick={() => setMenuOpen(false)}>
            Shop All
          </NavLink>
          <Link
            to="/"
            state={{ scrollTo: 'contact' }}
            className="nav__link"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="nav__cart"
            onClick={openCart}
            aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="20.5" r="1.3" fill="currentColor" />
              <circle cx="17" cy="20.5" r="1.3" fill="currentColor" />
            </svg>
            {itemCount > 0 && <span className="nav__cart-badge">{itemCount}</span>}
          </button>

          <button
            type="button"
            className="nav__menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="nav__mobile-links" aria-label="Primary mobile">
          <NavLink to="/" end className="nav__link" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/shop" className="nav__link" onClick={() => setMenuOpen(false)}>
            Shop All
          </NavLink>
          <Link
            to="/"
            state={{ scrollTo: 'contact' }}
            className="nav__link"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  )
}

export default NavBar
