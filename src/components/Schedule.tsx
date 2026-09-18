import React, { useState } from 'react';
import { SCHEDULE_DAYS } from '../data/eventData';

const TRACK_COLORS: Record<string, string> = {
  tech: '#00e5ff',
  'non-tech': '#ffb703',
  all: '#9d4edd',
};

const TAG_COLORS: Record<string, string> = {
  'CHECK-IN': '#6ee7b7',
  'CEREMONY': '#c4b5fd',
  'KEYNOTE': '#ffb703',
  'COMPETITION': '#f87171',
  'TRIVIA': '#93c5fd',
  'LIVE SHOW': '#fb923c',
  'HACKATHON': '#34d399',
  'WORKSHOP': '#60a5fa',
  'CODING': '#00e5ff',
  'COSPLAY': '#f472b6',
  'CONCERT': '#a78bfa',
  'FINALS': '#fbbf24',
  'TRIBUTE': '#ff3344',
  'AWARDS': '#ffb703',
  'AFTERPARTY': '#9d4edd',
};

export const Schedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState(0);
  const day = SCHEDULE_DAYS[activeDay];

  return (
    <section id="schedule" style={{
      background: 'linear-gradient(180deg, #06080e 0%, #080b16 50%, #06080e 100%)',
      padding: '80px 0',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, transparent, #ffb703)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.25em', color: '#ffb703' }}>
              THE JOURNEY
            </span>
            <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #ffb703, transparent)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.08em',
            margin: '0 0 8px 0'
          }}>
            GRAND LINE <span style={{ color: '#ffb703' }}>SCHEDULE</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem' }}>
            One unforgettable expedition. Full schedule to be announced.
          </p>
        </div>

        {/* Day Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {SCHEDULE_DAYS.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              style={{
                padding: '12px 28px',
                borderRadius: '16px',
                border: `2px solid ${activeDay === idx ? '#ffb703' : 'rgba(255, 255, 255, 0.1)'}`,
                background: activeDay === idx
                  ? 'linear-gradient(135deg, rgba(255, 183, 3, 0.25) 0%, rgba(251, 133, 0, 0.2) 100%)'
                  : 'rgba(14, 20, 36, 0.7)',
                color: activeDay === idx ? '#ffb703' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                boxShadow: activeDay === idx ? '0 0 20px rgba(255, 183, 3, 0.25)' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 900,
                fontSize: '0.95rem',
                letterSpacing: '0.08em',
                marginBottom: '2px'
              }}>
                DAY {d.dayNumber}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                {d.date}
              </div>
            </button>
          ))}
        </div>

        {/* Active Day Info Banner */}
        <div style={{
          background: 'rgba(14, 20, 36, 0.8)',
          border: '1px solid rgba(255, 183, 3, 0.25)',
          borderRadius: '16px',
          padding: '20px 28px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #ffb703, #fb8500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 0 20px rgba(255, 183, 3, 0.4)',
            flexShrink: 0
          }}>
            {day.dayNumber === 1 ? '⛵' : day.dayNumber === 2 ? '⚔️' : '🏆'}
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.25rem',
              fontWeight: 900,
              color: '#ffb703',
              letterSpacing: '0.06em'
            }}>
              {day.title}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {day.subTitle}
            </div>
          </div>
        </div>

        {/* Sessions Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {day.sessions.map((session, idx) => {
            const trackColor = TRACK_COLORS[session.track] || '#ffffff';
            const tagColor = TAG_COLORS[session.tag] || '#a0aec0';

            return (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr',
                  gap: '16px',
                  alignItems: 'stretch'
                }}
              >
                {/* Time Column */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  paddingTop: '14px',
                  gap: '4px'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.04em'
                  }}>
                    {session.time}
                  </span>
                  <div style={{ width: '2px', flex: 1, background: `${trackColor}44`, marginTop: '4px' }} />
                </div>

                {/* Session Card */}
                <div style={{
                  background: 'rgba(14, 20, 36, 0.82)',
                  border: `1px solid ${trackColor}33`,
                  borderLeft: `3px solid ${trackColor}`,
                  borderRadius: '14px',
                  padding: '16px 20px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  flexWrap: 'wrap'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = trackColor;
                    e.currentTarget.style.background = 'rgba(22, 32, 58, 0.95)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${trackColor}33`;
                    e.currentTarget.style.borderLeftColor = trackColor;
                    e.currentTarget.style.background = 'rgba(14, 20, 36, 0.82)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        background: `${tagColor}22`,
                        color: tagColor,
                        border: `1px solid ${tagColor}55`
                      }}>
                        {session.tag}
                      </span>
                    </div>
                    <h4 style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: '0 0 4px 0'
                    }}>
                      {session.title}
                    </h4>
                    {session.speaker && (
                      <p style={{
                        fontSize: '0.78rem',
                        color: trackColor,
                        margin: 0,
                        fontWeight: 600
                      }}>
                        🎙️ {session.speaker}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '0.75rem' }}>📍</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {session.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
