import React, { useState, useRef } from 'react';
import { TICKET_TIERS } from '../data/eventData';

interface WantedPassModalProps {
  isOpen: boolean;
  selectedTierId: string;
  onClose: () => void;
}

interface FormData {
  name: string;
  pirateName: string;
  college: string;
  role: string;
  tierId: string;
}

const ROLES = [
  'Developer / Coder',
  'Designer / Creative',
  'Hacker / CTF Player',
  'Startup Founder',
  'Anime Cosplayer',
  'Event Organizer',
  'Manga Artist',
  'Music Performer',
];

const BOUNTY_AMOUNTS: Record<string, string> = {
  rookie: '฿ 32,000,000',
  supernova: '฿ 320,000,000',
  yonko: '฿ 1,500,000,000',
};

export const WantedPassModal: React.FC<WantedPassModalProps> = ({ isOpen, selectedTierId, onClose }) => {
  const [step, setStep] = useState<'form' | 'badge'>('form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    pirateName: '',
    college: '',
    role: ROLES[0],
    tierId: selectedTierId || 'supernova',
  });
  const badgeRef = useRef<HTMLDivElement>(null);

  const selectedTier = TICKET_TIERS.find(t => t.id === formData.tierId) || TICKET_TIERS[1];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.pirateName) return;
    setStep('badge');
  };

  const handleDownload = () => {
    // Visual feedback for download
    alert('✅ Your WANTED Bounty Pass has been saved! Present this at the registration desk or share it on social media with #WanoFest2026');
  };

  if (!isOpen) return null;

  const tierLabel = selectedTier.id === 'rookie' ? '#00b4d8' : selectedTier.id === 'supernova' ? '#9d4edd' : '#ffb703';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'linear-gradient(160deg, #0a0e1a 0%, #06080e 100%)',
        border: '1px solid rgba(0, 229, 255, 0.25)',
        borderRadius: '28px',
        width: '100%',
        maxWidth: '620px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(0, 229, 255, 0.15)',
        position: 'relative',
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 28px 20px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '0.05em'
            }}>
              📜 GENERATE YOUR WANTED PASS
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Marine Bureau of Wano Fest 2026 — Official Bounty Registry
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '28px' }}>
          {/* Step Indicator */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '28px',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: step === 'form' ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${step === 'form' ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}>
              <span style={{ color: '#00e5ff', fontWeight: 800, fontSize: '0.82rem' }}>① CREW INFO</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: step === 'badge' ? '#00e5ff' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: step === 'badge' ? 'rgba(255, 183, 3, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${step === 'badge' ? 'rgba(255, 183, 3, 0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}>
              <span style={{ color: step === 'badge' ? '#ffb703' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.82rem' }}>② BOUNTY PASS</span>
            </div>
          </div>

          {/* ---- STEP 1: FORM ---- */}
          {step === 'form' && (
            <form onSubmit={handleGenerate}>
              {/* Ticket Tier Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  SELECT YOUR RANK
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {TICKET_TIERS.map((tier) => (
                    <button
                      type="button"
                      key={tier.id}
                      onClick={() => setFormData({ ...formData, tierId: tier.id })}
                      style={{
                        flex: '1',
                        minWidth: '120px',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: `2px solid ${formData.tierId === tier.id ? tierLabel : 'rgba(255,255,255,0.1)'}`,
                        background: formData.tierId === tier.id ? `${tierLabel}22` : 'rgba(14, 20, 36, 0.7)',
                        color: formData.tierId === tier.id ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <div>{tier.id === 'rookie' ? '⚓' : tier.id === 'supernova' ? '☠️' : '👑'}</div>
                      <div style={{ fontSize: '0.7rem', marginTop: '3px' }}>{tier.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              {[
                { label: 'FULL NAME', key: 'name' as const, placeholder: 'e.g. Monkey D. Subash' },
                { label: 'PIRATE NAME / ALIAS', key: 'pirateName' as const, placeholder: 'e.g. The Code Slayer' },
                { label: 'COLLEGE / INSTITUTION', key: 'college' as const, placeholder: 'e.g. IT University, Madras' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    marginBottom: '6px',
                    textTransform: 'uppercase'
                  }}>
                    {label}
                  </label>
                  <input
                    type="text"
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    required={key === 'name' || key === 'pirateName'}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(6, 8, 14, 0.8)',
                      border: '1px solid rgba(0, 229, 255, 0.2)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.92rem',
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#00e5ff'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.2)'; }}
                  />
                </div>
              ))}

              {/* Role Select */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  CREW ROLE
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(6, 8, 14, 0.8)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '0.92rem',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r} style={{ background: '#06080e' }}>{r}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-cyber-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              >
                <span>📜</span> GENERATE MY WANTED PASS
              </button>
            </form>
          )}

          {/* ---- STEP 2: BADGE ---- */}
          {step === 'badge' && (
            <div>
              {/* WANTED POSTER */}
              <div
                ref={badgeRef}
                className="wanted-poster"
                style={{
                  maxWidth: '400px',
                  margin: '0 auto 28px auto',
                  padding: '24px 28px',
                  position: 'relative'
                }}
              >
                {/* Top Decorative Border */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '1.1rem',
                  marginBottom: '10px',
                  opacity: 0.6
                }}>
                  {'✦ — ✦ — ✦ — ✦'.split('').map((c, i) => <span key={i}>{c}</span>)}
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.5rem',
                  letterSpacing: '0.15em',
                  fontWeight: 900,
                  margin: '0 0 3px 0',
                  color: '#1a0a00',
                  lineHeight: 1
                }}>
                  WANTED!
                </h1>
                <p className="dead-or-alive" style={{
                  fontSize: '0.8rem',
                  letterSpacing: '0.3em',
                  fontWeight: 800,
                  color: '#4a3214',
                  fontFamily: 'var(--font-heading)'
                }}>
                  DEAD OR ALIVE
                </p>

                {/* Photo Frame / Avatar */}
                <div className="photo-frame" style={{
                  width: '160px',
                  height: '160px',
                  margin: '16px auto',
                  borderRadius: '8px',
                  border: '3px solid #7a5528',
                  background: 'linear-gradient(135deg, #d4a96a, #ecd9b3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.25)'
                }}>
                  {formData.role.includes('Hacker') ? '🎭' :
                    formData.role.includes('Cosplay') ? '🎪' :
                    formData.role.includes('Music') ? '🎵' :
                    formData.role.includes('Design') ? '🎨' :
                    formData.role.includes('Startup') ? '🚀' :
                    formData.role.includes('Artist') ? '✒️' :
                    '☠️'}
                </div>

                {/* Pirate Name */}
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: '#1a0a00',
                  marginBottom: '2px',
                  letterSpacing: '0.04em',
                  lineHeight: 1.2
                }}>
                  {formData.pirateName || 'THE UNNAMED PIRATE'}
                </div>

                <div style={{
                  fontSize: '0.78rem',
                  color: '#5c4020',
                  fontWeight: 700,
                  marginBottom: '12px',
                  letterSpacing: '0.06em'
                }}>
                  {formData.name.toUpperCase() || 'UNKNOWN CREW MEMBER'}
                </div>

                {/* Divider */}
                <div style={{ height: '2px', background: '#8d6728', margin: '12px 0', opacity: 0.5 }} />

                {/* Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  textAlign: 'left',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.15em', color: '#7a5528', marginBottom: '2px' }}>
                      RANK
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#1a0a00' }}>
                      {selectedTier.name}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.15em', color: '#7a5528', marginBottom: '2px' }}>
                      CREW ROLE
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2a1800' }}>
                      {formData.role}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.15em', color: '#7a5528', marginBottom: '2px' }}>
                      CREW / COLLEGE
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2a1800' }}>
                      {formData.college || 'Grand Line Academy'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.15em', color: '#7a5528', marginBottom: '2px' }}>
                      FESTIVAL
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2a1800' }}>
                      Wano Fest 2026
                    </div>
                  </div>
                </div>

                <div style={{ height: '2px', background: '#8d6728', margin: '10px 0', opacity: 0.4 }} />

                {/* Bounty Reward */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.2em', color: '#7a5528', marginBottom: '4px' }}>
                    BOUNTY REWARD
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: '#1a0a00',
                    textShadow: '0 1px 2px rgba(255,200,100,0.4)'
                  }}>
                    {BOUNTY_AMOUNTS[formData.tierId] || BOUNTY_AMOUNTS['supernova']}
                  </div>
                </div>

                {/* Marine Seal Watermark */}
                <div className="marine-seal" style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  opacity: 0.18,
                  fontSize: '3rem',
                  transform: 'rotate(-15deg)',
                  pointerEvents: 'none'
                }}>
                  ⚓
                </div>

                {/* Bottom Decorative */}
                <div style={{
                  marginTop: '14px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.9rem',
                  opacity: 0.45
                }}>
                  {'✦ ✦ ✦ ✦ ✦'.split(' ').map((c, i) => <span key={i}>{c}</span>)}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleDownload}
                  className="btn-cyber-gold"
                  style={{ flex: 1, justifyContent: 'center', padding: '13px' }}
                >
                  <span>⬇️</span> DOWNLOAD PASS
                </button>

                <button
                  onClick={() => setStep('form')}
                  className="btn-cyber-outline"
                  style={{ flex: 1, justifyContent: 'center', padding: '13px' }}
                >
                  ← EDIT DETAILS
                </button>
              </div>

              <p style={{
                textAlign: 'center',
                marginTop: '16px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <span>📲</span> Share with <strong style={{ color: '#00e5ff' }}>#WanoFest2026</strong> and tag us for a crew shoutout!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
