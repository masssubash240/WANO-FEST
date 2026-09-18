import React from 'react';
import { EVENT_METRICS } from '../data/eventData';

export const TreasureStats: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'flag':
        return '🚩';
      case 'jollyRoger':
        return '☠️';
      case 'college':
        return '🏛️';
      case 'trophy':
        return '🏆';
      case 'mentor':
        return '🤝';
      case 'wheel':
        return '☸️';
      default:
        return '✨';
    }
  };

  return (
    <section style={{
      maxWidth: '1240px',
      margin: '0 auto 40px auto',
      padding: '0 24px',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="treasure-scroll" style={{
        padding: '24px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        {EVENT_METRICS.map((metric, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '150px',
              justifyContent: 'center',
              borderRight: idx !== EVENT_METRICS.length - 1 ? '1px dashed rgba(141, 103, 40, 0.4)' : 'none',
              paddingRight: idx !== EVENT_METRICS.length - 1 ? '16px' : '0'
            }}
          >
            <div style={{
              fontSize: '1.8rem',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}>
              {getIcon(metric.icon)}
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.65rem',
                fontWeight: 900,
                color: '#241604',
                lineHeight: 1
              }}>
                {metric.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#654817',
                letterSpacing: '0.12em',
                marginTop: '3px'
              }}>
                {metric.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
