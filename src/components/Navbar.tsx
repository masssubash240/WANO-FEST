import React, { useState, useEffect } from 'react';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  onOpenRegister: () => void;
  onNavigateContact?: () => void;
  onNavigateHome?: () => void;
  currentView?: 'home' | 'contact' | 'event-detail' | 'pitch-perfect';
  onOpenAuth?: (tab: 'login' | 'signup') => void;
  onNavigatePitch?: () => void;
  onOpenTemplate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onNavigateContact,
  onNavigateHome,
  currentView = 'home',
  onOpenAuth,
  onNavigatePitch,
  onOpenTemplate,
}) => {
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
        <a
          href="#home"
          onClick={(e) => {
            if (currentView !== 'home' && onNavigateHome) {
              e.preventDefault();
              onNavigateHome();
            }
          }}
          aria-label="CybiTradic Wano Fest home"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            width: 'clamp(118px, 13vw, 165px)',
          }}
        >
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
          <a
            href="#home"
            onClick={(e) => {
              if (currentView !== 'home' && onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            data-cursor="button"
            style={{ color: currentView === 'home' ? '#ffd166' : '#fff', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}
          >
            HOME
          </a>
          <a
            href="#events"
            onClick={(e) => {
              if (currentView !== 'home' && onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
                setTimeout(() => {
                  document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            data-cursor="button"
            style={{ color: '#8e9bb4', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}
          >
            EVENTS
          </a>
          <a href="#portals" data-cursor="button" style={{ color: '#00e5ff', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>TECHNICAL</a>
          <a href="#portals" data-cursor="button" style={{ color: '#ffb703', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>NON-TECHNICAL</a>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onOpenTemplate) onOpenTemplate();
            }}
            data-cursor="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#c084fc',
              textDecoration: 'none',
              fontSize: '0.84rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f472b6';
              e.currentTarget.style.textShadow = '0 0 10px rgba(244, 114, 182, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#c084fc';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            TEMPLATE
          </button>
          <a href="#story" data-cursor="button" style={{ color: '#8e9bb4', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em' }}>ABOUT</a>
          <a href="#crew" data-cursor="button" style={{ color: '#ffb703', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 800, letterSpacing: '0.08em' }}>CREW</a>
          <a
            href="#contact"
            onClick={(e) => {
              if (onNavigateContact) {
                e.preventDefault();
                onNavigateContact();
              }
            }}
            data-cursor="button"
            style={{
              color: currentView === 'contact' ? '#00e5ff' : '#00e5ff',
              textDecoration: 'none',
              fontSize: '0.84rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '4px 12px',
              borderRadius: '16px',
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid rgba(0, 229, 255, 0.35)',
            }}
          >
            CONTACT
          </a>

          {/* PITCH PERFECT '26 SPECIAL PILL */}
          <button
            onClick={onNavigatePitch}
            data-cursor="button"
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              borderRadius: '20px',
              padding: '5px 12px',
              color: '#60a5fa',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #7c3aed)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(37, 99, 235, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)';
              e.currentTarget.style.color = '#60a5fa';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>🚀</span>
            <span>PITCH ’26</span>
          </button>
        </nav>

        {/* Action Button & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserMenu onOpenAuth={onOpenAuth} />
          <button
            onClick={onOpenRegister}
            data-cursor="register"
            data-cursor-text="JOIN"
            className="btn-samurai-primary desktop-nav"
            style={{ padding: '9px 20px', fontSize: '0.82rem' }}
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
          <a
            href="#home"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onNavigateHome) onNavigateHome();
            }}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}
          >
            HOME
          </a>
          <a
            href="#events"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onNavigateHome) {
                onNavigateHome();
                setTimeout(() => {
                  document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            style={{ color: '#8e9bb4', textDecoration: 'none', fontWeight: 700 }}
          >
            EVENTS
          </a>
          <a href="#portals" onClick={() => setMobileMenuOpen(false)} style={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 700 }}>TECHNICAL</a>
          <a href="#portals" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffb703', textDecoration: 'none', fontWeight: 700 }}>NON-TECHNICAL</a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenTemplate) onOpenTemplate();
            }}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              color: '#c084fc',
              fontWeight: 800,
              fontSize: '1rem',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            📋 PITCH TEMPLATE (8 SLIDES)
          </button>
          <a href="#story" onClick={() => setMobileMenuOpen(false)} style={{ color: '#8e9bb4', textDecoration: 'none', fontWeight: 700 }}>ABOUT</a>
          <a href="#crew" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffb703', textDecoration: 'none', fontWeight: 800 }}>THE CREW</a>
          <a
            href="#contact"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onNavigateContact) onNavigateContact();
            }}
            style={{ color: '#00e5ff', textDecoration: 'none', fontWeight: 800 }}
          >
            CONTACT
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onNavigatePitch) onNavigatePitch();
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            🚀 PITCH PERFECT ’26 (₹200)
          </button>
          {onOpenAuth && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('login');
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '20px',
                background: 'rgba(0, 229, 255, 0.12)',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                color: '#00e5ff',
                fontWeight: 800,
                fontSize: '0.9rem',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>👤</span>
              <span>LOGIN / ACCOUNT</span>
            </button>
          )}
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
