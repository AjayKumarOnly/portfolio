import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { MenuIcon, CloseIcon } from './Icons'

/**
 * Sticky public navigation.
 * - Smooth-scrolls to sections
 * - Highlights the section currently in view (IntersectionObserver)
 * - Hidden admin route is intentionally NOT present here
 */
export default function Navbar() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const links = Array.from(document.querySelectorAll('section[id]'))
    if (!('IntersectionObserver' in window) || links.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    links.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const links = [
    ['Home', '#home'],
    ['About', '#about'],
    ['Skills', '#skills'],
    ['Experience', '#experience'],
    ['Projects', '#projects'],
    ['Contact', '#contact'],
  ]

  return (
    <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <nav className="container site-nav__inner" aria-label="Primary">
        <a
          className="site-nav__logo"
          href="#home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="site-nav__prompt" aria-hidden="true">
            ~/
          </span>
          {profile.name === '[YOUR NAME]' ? 'portfolio' : profile.name.toLowerCase().split(' ')[0]}
          <span className="site-nav__cursor" aria-hidden="true" />
        </a>

        <ul className={`site-nav__links ${menuOpen ? 'is-open' : ''}`}>
          {links.map(([label, href]) => {
            const id = href.slice(1)
            return (
              <li key={id}>
                <a
                  href={href}
                  className={active === id ? 'is-active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </nav>
    </header>
  )
}
