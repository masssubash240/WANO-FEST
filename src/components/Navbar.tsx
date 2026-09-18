import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: isScrolled ? '10px 0' : '18px 0',
      transition: 'all 0.3s ease',
      background: isScrolled ? 'rgba(6, 8, 14, 0.92)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(0, 229, 255, 0.2)' : 'none',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Overall Event Logo */}
        <a href="#home" aria-label="CybiTradic Wano Fest home" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          width: 'clamp(118px, 13vw, 165px)',
        }}>
          <img
            src="/images/wano_fest_overall_logo.png"
            alt="CybiTradic Wano Fest"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'normal',
              filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.28))',
            }}
          />
        </a>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          <a href="#home" data-cursor="button" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>HOME</a>
          <a href="#events" data-cursor="button" style={{ color: '#8e9bb4', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>EVENTS</a>
          <a href="#portals" data-cursor="button" style={{ color: '#00e5ff', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>TECHNICAL</a>
          <a href="#portals" data-cursor="button" style={{ color: '#ffb703', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>NON-TECHNICAL</a>
          <a href="#template" data-cursor="button" style={{ color: '#9d4edd', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>TEMPLATE</a>
          <a href="#story" data-cursor="button" style={{ color: '#8e9bb4', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>ABOUT</a>
          <a href="#crew" data-cursor="button" style={{ color: '#ffb703', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 800, letterSpacing: '0.08em' }}>CREW</a>
        </nav>

        {/* Action Button & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onOpenRegister}
            data-cursor="register"
            data-cursor-text="JOIN"
            className="btn-samurai-primary"
            style={{ padding: '9px 24px', fontSize: '0.84rem' }}
          >
            REGISTER ➔
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00e5ff',
              fontSize: '1.6rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            className="mobile-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(6, 8, 14, 0.98)',
            borderBottom: '1px solid rgba(0, 229, 255, 0.3)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <a href="#home" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}>HOME</a>
          <a href="#events" onClick={() => setMobileMenuOpen(false)} style={{ color: '#8e9bb4', textDecoration: 'none', fontWeight: 700 }}>EVENTS</a>
          <a href="#portals" onClick={() => setMobileMenuOpen(false)} style={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 700 }}>TECHNICAL</a>
          <a href="#portals" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffb703', textDecoration: 'none', fontWeight: 700 }}>NON-TECHNICAL</a>
          <a href="#template" onClick={() => setMobileMenuOpen(false)} style={{ color: '#9d4edd', textDecoration: 'none', fontWeight: 700 }}>TEMPLATE</a>
          <a href="#story" onClick={() => setMobileMenuOpen(false)} style={{ color: '#8e9bb4', textDecoration: 'none', fontWeight: 700 }}>ABOUT</a>
          <a href="#crew" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffb703', textDecoration: 'none', fontWeight: 800 }}>THE CREW</a>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
