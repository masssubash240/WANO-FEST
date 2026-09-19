import React, { useState } from 'react';
import {
  Send,
  CheckCircle,
  Phone,
  MessageCircle,
  Mail,
  Shield,
} from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';
import { ContactCard } from './ContactCard';
import { VideoModal } from './VideoModal';
import { FindOurHarborSection } from './FindOurHarborSection';

interface ContactPageProps {
  onBackToHome?: () => void;
  onToast?: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome, onToast }) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Kinetic Heading letters
  const headingText = 'Send a Message in a Bottle';

  const validateForm = () => {
    const errors: { name?: string; email?: string; message?: string } = {};
    if (!formName.trim()) {
      errors.name = 'Please provide your pirate moniker or name.';
    }
    if (!formEmail.trim()) {
      errors.email = 'Carrier raven needs your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      errors.email = 'Please enter a valid transmission email.';
    }
    if (!formMessage.trim()) {
      errors.message = 'Please scribe your scroll message.';
    } else if (formMessage.trim().length < 6) {
      errors.message = 'Message must be at least 6 characters.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate paper plane dispatch animation and completion
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      if (onToast) onToast('Bottle sealed & dispatched across the Grand Line! 🍾✨');
      setTimeout(() => {
        setFormName('');
        setFormEmail('');
        setFormMessage('');
      }, 500);
    }, 1200);
  };

  const isMobileDevice =
    typeof navigator !== 'undefined' &&
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof window !== 'undefined' && window.innerWidth < 768));

  return (
    <div
      className="contact-page-root"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#03050a',
        color: '#ffffff',
        padding: '120px 0 0 0',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambience: Navy, Sunset Glow, and Ocean Waves */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(0, 229, 255, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(217, 4, 41, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 183, 3, 0.05) 0%, transparent 60%),
            linear-gradient(180deg, #03050a 0%, #060913 50%, #030408 100%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 60px 20px', position: 'relative', zIndex: 2 }}>
        {/* Navigation Breadcrumb / Back Button */}
        {onBackToHome && (
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={onBackToHome}
              aria-label="Return to Festival Deck"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '25px',
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#ffd166',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                e.currentTarget.style.transform = 'translateX(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>⚓</span>
              <span>BACK TO FESTIVAL DECK</span>
            </button>
          </div>
        )}

        {/* ─── 1. HEADING: KINETIC LETTER REVEAL & FLOATING BOTTLE ─── */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 20px',
              borderRadius: '30px',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '1rem' }}>📜</span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.25em',
                color: '#ffb703',
                textTransform: 'uppercase',
              }}
            >
              GRAND LINE COMMUNICATOR
            </span>
            <span style={{ fontSize: '1rem' }}>🌊</span>
          </div>

          {/* Kinetic Letter-by-Letter Heading with Floating Bottle Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              margin: '0 auto',
            }}
          >
            {/* Floating Bottle Icon */}
            <div className="floating-bottle-icon" style={{ display: 'inline-block' }}>
              <span
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
                  display: 'inline-block',
                  filter: 'drop-shadow(0 0 16px rgba(0, 229, 255, 0.6))',
                }}
              >
                🍾
              </span>
            </div>

            <h1
              className="kinetic-title"
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                margin: 0,
                display: 'inline-flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                lineHeight: 1.1,
              }}
            >
              {headingText.split('').map((char, index) => (
                <span
                  key={index}
                  className="kinetic-letter"
                  style={{
                    display: 'inline-block',
                    animationDelay: `${index * 0.035}s`,
                    background:
                      char === ' '
                        ? 'transparent'
                        : 'linear-gradient(135deg, #ffffff 0%, #ffd166 60%, #ff5400 100%)',
                    WebkitBackgroundClip: char === ' ' ? 'none' : 'text',
                    WebkitTextFillColor: char === ' ' ? 'inherit' : 'transparent',
                    filter: char === ' ' ? 'none' : 'drop-shadow(0 2px 14px rgba(255, 183, 3, 0.35))',
                    minWidth: char === ' ' ? '0.3em' : 'auto',
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>

          <p
            style={{
              maxWidth: '680px',
              margin: '20px auto 0 auto',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              color: '#94a3b8',
              lineHeight: 1.6,
            }}
          >
            Connect directly with Sri Sai Ranganathan Engineering College and the Wano Fest
            quartermasters. Signals, maps, coordinates, and direct transmissions await below.
          </p>
        </div>

        {/* ─── 2. CONTACT CARDS (WANTED POSTER / TREASURE MAP STYLE) ─── */}
        <section style={{ marginBottom: '90px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#d4af37',
                textTransform: 'uppercase',
              }}
            >
              SIX CHANNELS ACROSS THE OCEAN
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
                fontWeight: 900,
                color: '#ffffff',
                margin: '6px 0 0 0',
                letterSpacing: '0.04em',
              }}
            >
              OFFICIAL SANCTUARY FREQUENCIES
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {SITE_CONFIG.contactCards.map((card, idx) => (
              <ContactCard
                key={card.id}
                data={card}
                index={idx}
                onToast={onToast}
                onVideoClick={() => setIsVideoModalOpen(true)}
              />
            ))}
          </div>
        </section>

        {/* ─── 6. MEET YOUR QUARTERMASTERS: GROUPED BY EVENT ─── */}
        <section style={{ marginBottom: '90px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#00e5ff',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              <Shield size={16} />
              <span>THE GRAND LINE COMMAND</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.04em',
                margin: '0 0 10px 0',
              }}
            >
              MEET YOUR QUARTERMASTERS
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto' }}>
              Direct access to event coordinators for rules, schedules, challenge criteria, and squad confirmations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {SITE_CONFIG.quartermasters.map((group, gIdx) => (
              <div
                key={group.eventName}
                className="quartermaster-group-card"
                style={{
                  borderRadius: '24px',
                  padding: '28px 24px',
                  backgroundColor: '#070b16',
                  border: '1.5px solid rgba(212, 175, 55, 0.35)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 25px rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  animation: `harborFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${gIdx * 0.1}s both`,
                }}
              >
                <div>
                  {/* Division Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.15em',
                        color: '#00e5ff',
                        textTransform: 'uppercase',
                      }}
                    >
                      {group.eventCategory}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#ffd166',
                        backgroundColor: 'rgba(212, 175, 55, 0.12)',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        padding: '3px 10px',
                        borderRadius: '12px',
                      }}
                    >
                      {group.bounty}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '0.03em',
                      margin: '0 0 20px 0',
                    }}
                  >
                    {group.eventName}
                  </h3>

                  {/* Coordinators in this event */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {group.coordinators.map((c, cIdx) => {
                      const gmailHref = isMobileDevice
                        ? `mailto:${c.email}`
                        : `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(c.email || '')}`;

                      return (
                        <div
                          key={`${c.name}-${cIdx}`}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '16px',
                            backgroundColor: 'rgba(12, 18, 34, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '6px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.92rem',
                                fontWeight: 800,
                                color: '#f8fafc',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {c.name}
                            </span>
                            {c.role && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  color: '#ffb703',
                                  fontWeight: 700,
                                  letterSpacing: '0.05em',
                                }}
                              >
                                {c.role}
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: '#94a3b8',
                              marginBottom: '12px',
                              fontFamily: 'monospace',
                            }}
                          >
                            {c.phone}
                          </div>

                          {/* Actions: Call, WhatsApp, Gmail */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {/* Call */}
                            <a
                              href={`tel:${c.tel}`}
                              aria-label={`Call ${c.name} at ${c.phone}`}
                              style={{
                                flex: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px',
                                minHeight: '44px',
                                padding: '6px 12px',
                                borderRadius: '10px',
                                backgroundColor: 'rgba(0, 230, 118, 0.14)',
                                border: '1px solid rgba(0, 230, 118, 0.45)',
                                color: '#00e676',
                                textDecoration: 'none',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 230, 118, 0.28)';
                                e.currentTarget.style.transform = 'scale(1.03)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 230, 118, 0.14)';
                                e.currentTarget.style.transform = 'none';
                              }}
                            >
                              <Phone size={14} />
                              <span>CALL</span>
                            </a>

                            {/* WhatsApp */}
                            {c.wa && (
                              <a
                                href={c.wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`WhatsApp chat with ${c.name}`}
                                style={{
                                  flex: 1,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '5px',
                                  minHeight: '44px',
                                  padding: '6px 12px',
                                  borderRadius: '10px',
                                  backgroundColor: 'rgba(37, 211, 102, 0.14)',
                                  border: '1px solid rgba(37, 211, 102, 0.45)',
                                  color: '#25d366',
                                  textDecoration: 'none',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.28)';
                                  e.currentTarget.style.transform = 'scale(1.03)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.14)';
                                  e.currentTarget.style.transform = 'none';
                                }}
                              >
                                <MessageCircle size={14} />
                                <span>WHATSAPP</span>
                              </a>
                            )}

                            {/* Gmail */}
                            {c.email && (
                              <a
                                href={gmailHref}
                                target={isMobileDevice ? '_self' : '_blank'}
                                rel="noopener noreferrer"
                                aria-label={`Send Gmail to ${c.name}`}
                                style={{
                                  flex: 1,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '5px',
                                  minHeight: '44px',
                                  padding: '6px 12px',
                                  borderRadius: '10px',
                                  backgroundColor: 'rgba(217, 4, 41, 0.15)',
                                  border: '1px solid rgba(217, 4, 41, 0.45)',
                                  color: '#ff4d6d',
                                  textDecoration: 'none',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(217, 4, 41, 0.3)';
                                  e.currentTarget.style.transform = 'scale(1.03)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(217, 4, 41, 0.15)';
                                  e.currentTarget.style.transform = 'none';
                                }}
                              >
                                <Mail size={14} />
                                <span>GMAIL</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. YOUTUBE FEST TRAILER SHOWCASE ─── */}
        <section style={{ maxWidth: '960px', margin: '0 auto 90px auto' }}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#d90429',
                fontSize: '0.76rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              <span>🎬</span>
              <span>CINEMATIC ARCHIVE</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.04em',
                margin: '6px 0 0 0',
              }}
            >
              Official Fest Trailer
            </h2>
          </div>
          <VideoModal videoId={SITE_CONFIG.college.youtubeVideoId} />
        </section>

        {/* ─── 7. OPTIONAL CONTACT FORM WITH PAPER-PLANE FLY-AWAY ─── */}
        <section style={{ maxWidth: '820px', margin: '0 auto 80px auto' }}>
          <div
            className="contact-form-parchment"
            style={{
              position: 'relative',
              borderRadius: '28px',
              padding: 'clamp(28px, 5vw, 48px)',
              backgroundColor: '#090d1a',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.85), 0 0 40px rgba(212, 175, 55, 0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Corner Decorative Kanji */}
            <span
              style={{
                position: 'absolute',
                top: '16px',
                left: '20px',
                fontSize: '1.4rem',
                color: 'rgba(212, 175, 55, 0.3)',
                fontFamily: 'serif',
                pointerEvents: 'none',
              }}
            >
              書
            </span>
            <span
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                fontSize: '1.4rem',
                color: 'rgba(217, 4, 41, 0.3)',
                fontFamily: 'serif',
                pointerEvents: 'none',
              }}
            >
              信
            </span>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  color: '#ffd166',
                  textTransform: 'uppercase',
                }}
              >
                DISPATCH SCROLL TO HEADQUARTERS
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                  margin: '8px 0 8px 0',
                }}
              >
                Send Your Message
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Got queries regarding events, accommodations, rules or partnership? Scribe your scroll below.
              </p>
            </div>

            {isSent ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  animation: 'fadeIn 0.4s ease',
                }}
              >
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 230, 118, 0.15)',
                    border: '2px solid #00e676',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto',
                    boxShadow: '0 0 30px rgba(0, 230, 118, 0.4)',
                  }}
                >
                  <CheckCircle size={40} className="text-emerald-400" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.6rem',
                    color: '#ffd166',
                    marginBottom: '10px',
                  }}
                >
                  Scroll Dispatched Across The Grand Line!
                </h3>
                <p style={{ color: '#cbd5e1', maxWidth: '480px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
                  Your message has been sealed in an enchanted bottle and dispatched to our event quartermasters.
                  We will reply via email shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  style={{
                    minHeight: '44px',
                    padding: '10px 28px',
                    borderRadius: '25px',
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    border: '1.5px solid #d4af37',
                    color: '#ffd166',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                  }}
                >
                  DISPATCH ANOTHER SCROLL ➔
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="contact-name"
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: '#ffd166',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Your Name / Pirate Moniker *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Captain Monkey D. Luffy"
                    className="parchment-input"
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      padding: '12px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(6, 9, 18, 0.85)',
                      border: formErrors.name
                        ? '1.5px solid #ff4d6d'
                        : '1.5px solid rgba(212, 175, 55, 0.35)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                      boxSizing: 'border-box',
                    }}
                  />
                  {formErrors.name && (
                    <div style={{ color: '#ff4d6d', fontSize: '0.76rem', marginTop: '6px' }}>
                      {formErrors.name}
                    </div>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="contact-email"
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: '#ffd166',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Transmission Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="nakama@grandline.org"
                    className="parchment-input"
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      padding: '12px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(6, 9, 18, 0.85)',
                      border: formErrors.email
                        ? '1.5px solid #ff4d6d'
                        : '1.5px solid rgba(212, 175, 55, 0.35)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                      boxSizing: 'border-box',
                    }}
                  />
                  {formErrors.email && (
                    <div style={{ color: '#ff4d6d', fontSize: '0.76rem', marginTop: '6px' }}>
                      {formErrors.email}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div>
                  <label
                    htmlFor="contact-message"
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: '#ffd166',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Scroll Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Tell us about your team, event query, or accommodation request..."
                    className="parchment-input"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(6, 9, 18, 0.85)',
                      border: formErrors.message
                        ? '1.5px solid #ff4d6d'
                        : '1.5px solid rgba(212, 175, 55, 0.35)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                      boxSizing: 'border-box',
                    }}
                  />
                  {formErrors.message && (
                    <div style={{ color: '#ff4d6d', fontSize: '0.76rem', marginTop: '6px' }}>
                      {formErrors.message}
                    </div>
                  )}
                </div>

                {/* Submit Button with Paper Plane Animation */}
                <div style={{ marginTop: '12px' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Launch paper plane message"
                    className={`dispatch-btn ${isSubmitting ? 'fly-away' : ''}`}
                    style={{
                      width: '100%',
                      minHeight: '52px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '14px 28px',
                      borderRadius: '16px',
                      background:
                        'linear-gradient(135deg, #ff5400 0%, #d90429 50%, #ffd166 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontFamily: 'var(--font-title)',
                      fontSize: '0.95rem',
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: isSubmitting ? 'default' : 'pointer',
                      boxShadow: '0 8px 30px rgba(217, 4, 41, 0.45)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(217, 4, 41, 0.65)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(217, 4, 41, 0.45)';
                      }
                    }}
                  >
                    <Send
                      size={20}
                      className={`paper-plane-icon ${isSubmitting ? 'plane-flying' : ''}`}
                    />
                    <span>{isSubmitting ? 'DISPATCHING SCROLL...' : 'LAUNCH BOTTLE TRANSMISSION ➔'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* ─── 8. FIND OUR HARBOR: SANCTUARY BEACONS & DIRECTIONS & MAP PREVIEW (LAST PAGE BOTTOM) ─── */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <FindOurHarborSection />
      </div>

      {/* Embedded Video Modal Triggered from Card if needed */}
      {isVideoModalOpen && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.9)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '900px', aspectRatio: '16/9' }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${SITE_CONFIG.college.youtubeVideoId}?autoplay=1`}
              title="WANO FEST Trailer"
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
