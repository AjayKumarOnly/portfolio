import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldAlert, LogOut, Terminal } from 'lucide-react';

export default function Navbar({ isAdmin, onOpenAdmin, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple scroll spy logic
      const sections = ['home', 'about', 'projects', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollTo = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navStyle = {
    position: 'fixed',
    top: scrolled ? '1rem' : '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: scrolled ? 'calc(100% - 2rem)' : 'calc(100% - 3rem)',
    maxWidth: '1120px',
    height: '4.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    zIndex: 100,
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    background: scrolled ? 'rgba(18, 16, 26, 0.75)' : 'rgba(18, 16, 26, 0.45)',
    border: '1px solid',
    borderColor: scrolled ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
    borderRadius: scrolled ? '20px' : '16px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.4)' : 'none',
  };

  return (
    <motion.nav 
      style={navStyle}
      initial={{ y: -50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      {/* Brand logo */}
      <div 
        onClick={() => scrollTo('home')} 
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '1.25rem',
          letterSpacing: '-0.03em'
        }}
      >
        <span style={{ 
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 800
        }}>
          PORTFOLIO
        </span>
        {isAdmin && (
          <span className="badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: 'hsl(142, 71%, 65%)' }}>
            ADMIN
          </span>
        )}
      </div>

      {/* Desktop Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1.5rem', alignItems: 'center' }}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  position: 'relative',
                  padding: '0.5rem 0.25rem',
                  transition: 'color 0.2s'
                }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span 
                    layoutId="activeNavLine"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--gradient-accent)',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Admin Dashboard / Log Out controls */}
        {isAdmin ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={onOpenAdmin}>
              <Terminal size={14} />
              Admin
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onLogout}
              style={{ padding: '0.5rem', borderRadius: '8px' }}
              title="Logout Admin"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button 
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              marginLeft: '1rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}
            onClick={onOpenAdmin}
            title="Secret Login (or press Ctrl+Shift+A)"
            onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <Terminal size={16} />
          </button>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="mobile-nav-toggle" style={{ display: 'none' }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: block !important;
          }
        }
      `}</style>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: '5rem',
              left: 0,
              right: 0,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              zIndex: 99
            }}
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeSection === item.id ? 'var(--primary-light)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0'
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {isAdmin ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setIsOpen(false); onOpenAdmin(); }}>
                  <Terminal size={14} /> Admin Panel
                </button>
                <button className="btn btn-secondary btn-sm" style={{ flex: 0.3, justifyContent: 'center' }} onClick={() => { setIsOpen(false); onLogout(); }}>
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ marginTop: '0.5rem', justifyContent: 'center' }}
                onClick={() => { setIsOpen(false); onOpenAdmin(); }}
              >
                <Terminal size={14} /> Secret Admin Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
