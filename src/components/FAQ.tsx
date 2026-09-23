import React, { useState } from 'react';
import { FAQS } from '../data/eventData';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" style={{
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* ── VIDEO BACKGROUND ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/video3.mp4" type="video/mp4" />
      </video>

      {/* ── DARK GRADIENT OVERLAY ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(180deg,
            rgba(4, 6, 14, 0.92) 0%,
            rgba(4, 6, 14, 0.75) 40%,
            rgba(4, 6, 14, 0.85) 80%,
            rgba(4, 6, 14, 0.97) 100%
          )
        `,
        zIndex: 1,
      }} />

      {/* ── CONTENT WRAPPER ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '860px',
        margin: '0 auto',
        padding: '80px 24px',
      }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #9d4edd)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.25em', color: '#9d4edd' }}>
              NAVIGATOR'S NOTES
            </span>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #9d4edd, transparent)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.08em',
            margin: '0 0 10px 0'
          }}>
            FREQUENTLY ASKED <span style={{ color: '#9d4edd' }}>QUESTIONS</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            All you need to know before setting sail.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(14, 20, 36, 0.85)',
                border: `1px solid ${openIdx === idx ? 'rgba(157, 78, 221, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'border-color 0.25s ease',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Question / Toggle */}
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '20px 24px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: openIdx === idx
                      ? 'linear-gradient(135deg, #9d4edd, #7b2cbf)'
                      : 'rgba(157, 78, 221, 0.12)',
                    border: `1px solid ${openIdx === idx ? '#9d4edd' : 'rgba(157, 78, 221, 0.25)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.25s ease',
                    boxShadow: openIdx === idx ? '0 0 12px rgba(157, 78, 221, 0.5)' : 'none'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      color: openIdx === idx ? '#fff' : '#9d4edd'
                    }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: openIdx === idx ? '#ffffff' : '#c4cfe4',
                    lineHeight: 1.4
                  }}>
                    {faq.question}
                  </span>
                </div>

                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'transform 0.3s ease',
                  transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  <span style={{ color: '#9d4edd', fontSize: '0.75rem', fontWeight: 900 }}>▼</span>
                </div>
              </button>

              {/* Answer */}
              <div style={{
                maxHeight: openIdx === idx ? '300px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                <div style={{
                  padding: '0 24px 20px 70px',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  borderTop: openIdx === idx ? '1px solid rgba(157, 78, 221, 0.15)' : 'none',
                  paddingTop: openIdx === idx ? '16px' : '0',
                }}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          padding: '32px',
          background: 'rgba(14, 20, 36, 0.6)',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          borderRadius: '20px',
          backdropFilter: 'blur(12px)'
        }}>
          <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
            Still have questions? Join the Wano Nakama Discord!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px' }}>
            Our crew is always ready to help. DM us anytime on Discord or Instagram.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" className="btn-cyber-primary" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
              💬 Join Discord
            </a>
            <a href="#" className="btn-cyber-outline" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
              📧 Email Us
            </a>
          </div>
        </div>

      </div>{/* ── end content wrapper ── */}
    </section>
  );
};
