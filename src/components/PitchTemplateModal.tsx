import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface SlideTemplate {
  slideNumber: number;
  title: string;
  subtitle: string;
  officialNote: string;
  checkpoints: string[];
  suggestedElements: string[];
}

const SLIDE_TEMPLATES: SlideTemplate[] = [
  {
    slideNumber: 1,
    title: 'TITLE SLIDE — YOUR TEAM NAME, YOUR IDEA TITLE',
    subtitle: 'FIRST IMPRESSION & INTRODUCTION',
    officialNote:
      'Keep the title short, clear, and impactful, and provide a brief introduction to your idea. Include your team name, team members, college or institution, and the relevant domain or theme. You may also add a short tagline or suitable visual to represent your idea. Keep the slide clean, creative, and easy to read so that it creates a strong first impression.',
    checkpoints: [
      'Catchy, concise project/idea title',
      'Team name and all members with roles/branches',
      'College/Institution: Sri Sai Ranganathan Engineering College (or participant college)',
      'Domain: AI / Healthcare / AgriTech / Cyber / FinTech / Social Impact',
      'Memorable one-line tagline & logo/graphic',
    ],
    suggestedElements: ['Team Logo', 'Hero Tagline', 'Presenter Names', 'Affiliation Badge'],
  },
  {
    slideNumber: 2,
    title: 'PROBLEM STATEMENT — THE PROBLEM WE AIM TO SOLVE',
    subtitle: 'PAIN POINT & MARKET VALIDATION',
    officialNote:
      'Clearly describe the specific problem you are tackling. Who is facing this challenge? What are the real-world consequences of leaving this problem unsolved? Provide statistics or evidence if available to show the magnitude of the issue.',
    checkpoints: [
      'Specific, well-defined problem (avoid generic broad statements)',
      'Target group affected by this problem',
      'Magnitude & real-world consequences (data/metrics)',
      'Why existing alternatives fail to solve this adequately',
    ],
    suggestedElements: ['Statistics / Numbers', 'User Quotes', 'Pain Point Icons', 'Current Gap Analysis'],
  },
  {
    slideNumber: 3,
    title: 'OUR SOLUTION & TARGET AUDIENCE — INTRODUCING OUR SOLUTION & WHO ARE WE SOLVING THIS FOR?',
    subtitle: 'CORE VALUE PROPOSITION & USER PERSONAS',
    officialNote:
      'Present your breakthrough solution clearly. How does your innovation solve the problem defined in Slide 2? Describe your primary target users and how their life or workflow improves with your solution.',
    checkpoints: [
      'Clear definition of the proposed solution / product',
      'Primary & secondary target audience segments',
      'Value proposition: Faster, cheaper, more accessible, or automated',
      'Direct mapping between problem statement and solution benefits',
    ],
    suggestedElements: ['Solution Snapshot', 'Target Persona Cards', 'Key Benefits Pill Row', 'Use-Case Scenario'],
  },
  {
    slideNumber: 4,
    title: 'UNIQUENESS — WHAT MAKES OUR IDEA DIFFERENT?',
    subtitle: 'COMPETITIVE ADVANTAGE & NOVELTY',
    officialNote:
      'Highlight what sets your idea or project apart from existing competitors or market alternatives. What is your unique differentiator, patentable concept, or proprietary advantage?',
    checkpoints: [
      'Novelty factor: What did you build or design that does not exist?',
      'Competitive comparison matrix vs existing market options',
      'Proprietary advantage (custom algorithm, design, hardware integration)',
      'Cost-effectiveness or efficiency benchmark',
    ],
    suggestedElements: ['Comparison Matrix Table', 'Unfair Advantage Badges', 'Feature Differentiation', 'Benchmark Stats'],
  },
  {
    slideNumber: 5,
    title: 'TECHNOLOGY & IMPLEMENTATION — TECHNOLOGY BEHIND OUR PROJECT',
    subtitle: 'TECH STACK, ARCHITECTURE & TOOLS',
    officialNote:
      'Break down the technical components powering your innovation. Detail programming languages, frameworks, cloud services, machine learning models, sensors, microcontrollers, or APIs utilized.',
    checkpoints: [
      'Full technology stack (Frontend, Backend, Database, Cloud/Hardware)',
      'AI/ML models, algorithms, or IoT sensors applied',
      'Security, reliability, and data privacy considerations',
      'Technical feasibility and implementation maturity',
    ],
    suggestedElements: ['Tech Stack Badges', 'System Architecture Diagram', 'API / Framework Flow', 'Hardware Specs'],
  },
  {
    slideNumber: 6,
    title: 'HOW IT WORKS — PRODUCT WORKFLOW',
    subtitle: 'END-TO-END OPERATIONAL PROCESS',
    officialNote:
      'Walk the jury through the exact workflow from start to finish. Illustrate how a user interacts with the system, how data is captured, processed, and what output or action is generated.',
    checkpoints: [
      'Step-by-step sequential workflow (Input → Processing → Output)',
      'User interface flow or operational flowchart',
      'Automation and feedback loop mechanism',
      'Simplicity and intuitive usability',
    ],
    suggestedElements: ['Step 1-2-3 Process Flow', 'Data Pipeline Diagram', 'Wireframes / Mockups', 'Interaction Loop'],
  },
  {
    slideNumber: 7,
    title: 'BUSINESS MODEL — HOW WILL WE CREATE VALUE?',
    subtitle: 'SUSTAINABILITY & FINANCIAL VIABILITY',
    officialNote:
      'Explain how the project creates sustainable long-term value. Detail revenue streams, pricing models, manufacturing costs, distribution channels, or community adoption strategies.',
    checkpoints: [
      'Revenue model: B2B, B2C, Freemium, Subscription, or One-time sale',
      'Estimated unit economics / production cost vs selling price',
      'Go-to-market plan and distribution channels',
      'Sustainability & social impact roadmap',
    ],
    suggestedElements: ['Revenue Streams Breakdown', 'Cost vs Price Chart', 'Go-To-Market Pillars', 'Scalability Milestones'],
  },
  {
    slideNumber: 8,
    title: 'PROTOTYPE / DEMO',
    subtitle: 'LIVE DEMONSTRATION & CURRENT PROGRESS',
    officialNote:
      'Demonstrate your working prototype, live software application, physical device, or proof-of-concept tests. Present actual screenshots, testing data, user feedback, and future roadmap.',
    checkpoints: [
      'Live demonstration or high-resolution prototype photographs/screens',
      'Key test results, accuracy metrics, or user trials conducted',
      'Current development status: MVP, Alpha, or Production-Ready',
      'Future roadmap: Next 6-12 months execution goals',
    ],
    suggestedElements: ['Live Demo Window', 'Prototype Photo Gallery', 'Test Metrics / Accuracy', 'Future Milestones Timeline'],
  },
];

interface PitchTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
  onToast?: (msg: string) => void;
}

export const PitchTemplateModal: React.FC<PitchTemplateModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  onToast,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSlide = SLIDE_TEMPLATES[currentSlideIndex];

  const handleCopyOutline = () => {
    const text = SLIDE_TEMPLATES.map(
      (s) =>
        `SLIDE ${s.slideNumber}: ${s.title}\n` +
        `• Note: ${s.officialNote}\n` +
        `• Checkpoints:\n  - ${s.checkpoints.join('\n  - ')}\n`
    ).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onToast) onToast('📋 Pitch Template Outline copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadOutline = () => {
    const content =
      `PITCH PERFECT '26 - OFFICIAL PRESENTATION SLIDE TEMPLATE\n` +
      `Sri Sai Ranganathan Engineering College & Innovrise Foundation\n` +
      `===============================================================\n\n` +
      SLIDE_TEMPLATES.map(
        (s) =>
          `SLIDE ${s.slideNumber}: ${s.title}\n` +
          `SUBTITLE: ${s.subtitle}\n` +
          `OFFICIAL INSTRUCTION: ${s.officialNote}\n` +
          `KEY INCLUSIONS:\n  - ${s.checkpoints.join('\n  - ')}\n` +
          `SUGGESTED VISUAL ELEMENTS: ${s.suggestedElements.join(', ')}\n` +
          `---------------------------------------------------------------\n`
      ).join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PITCH_PERFECT_26_OFFICIAL_SLIDE_TEMPLATE.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onToast) onToast('📥 Slide template outline downloaded!');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(6, 9, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.4), 0 0 40px rgba(37, 99, 235, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1.5px solid rgba(226, 232, 240, 0.9)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── MODAL HEADER ─── */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/images/ssrec_seal.jpg"
              alt="SSREC Seal"
              style={{
                width: '44px',
                height: '44px',
                objectFit: 'contain',
                borderRadius: '50%',
                border: '1.5px solid #e2e8f0',
              }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 950,
                    color: '#0f172a',
                  }}
                >
                  OFFICIAL PITCH TEMPLATE
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                  }}
                >
                  8 SLIDES
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Sri Sai Ranganathan Engineering College • PITCH PERFECT ’26
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleCopyOutline}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Copy template outline"
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Outline'}</span>
            </button>

            <button
              onClick={handleDownloadOutline}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              <Download size={14} />
              <span>Download Template</span>
            </button>

            <button
              onClick={onClose}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ─── MAIN SLIDE VIEWER (16:9 Canvas) ─── */}
        <div
          style={{
            flex: 1,
            padding: '24px 32px',
            backgroundColor: '#f8fafc',
            overflowY: 'auto',
          }}
        >
          {/* Visual Slide Frame */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 15px 35px -10px rgba(0,0,0,0.08)',
              padding: '36px 40px',
              minHeight: '340px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Slide Header with College Seal & Slide Number */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src="/images/ssrec_seal.jpg"
                  alt="SSREC Seal"
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                    borderRadius: '50%',
                  }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#2563eb', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    SLIDE 0{currentSlide.slideNumber} OF 08
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                    {currentSlide.subtitle}
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#94a3b8',
                }}
              >
                PITCH PERFECT ’26
              </div>
            </div>

            {/* Slide Title (Exact match from PDF) */}
            <h2
              style={{
                fontFamily: 'Outfit, Inter, sans-serif',
                fontWeight: 950,
                fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
                color: '#0a0f24',
                lineHeight: 1.15,
                margin: '0 0 20px 0',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              {currentSlide.title}
            </h2>

            {/* Official Guidance Note Box */}
            <div
              style={{
                padding: '18px 22px',
                borderRadius: '16px',
                backgroundColor: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                color: '#1e3a8a',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              <strong style={{ display: 'block', color: '#1d4ed8', marginBottom: '4px', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                📌 Official Organizer Guidance:
              </strong>
              {currentSlide.officialNote}
            </div>

            {/* Checkpoints & Suggested Elements Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#059669', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  ✓ Key Checkpoints to Include
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                  {currentSlide.checkpoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#7c3aed', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  💡 Suggested Visual Elements
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentSlide.suggestedElements.map((el) => (
                    <span
                      key={el}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#f5f3ff',
                        color: '#6d28d9',
                        border: '1px solid #ddd6fe',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SLIDE NAVIGATION CAROUSEL (Thumbnails 1–8) ─── */}
        <div
          style={{
            padding: '16px 28px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          {/* Prev / Next Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: currentSlideIndex === 0 ? '#f1f5f9' : '#ffffff',
                color: currentSlideIndex === 0 ? '#94a3b8' : '#0f172a',
                cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ChevronLeft size={16} /> Prev Slide
            </button>

            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(SLIDE_TEMPLATES.length - 1, prev + 1))}
              disabled={currentSlideIndex === SLIDE_TEMPLATES.length - 1}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                backgroundColor: currentSlideIndex === SLIDE_TEMPLATES.length - 1 ? '#f1f5f9' : '#ffffff',
                color: currentSlideIndex === SLIDE_TEMPLATES.length - 1 ? '#94a3b8' : '#0f172a',
                cursor: currentSlideIndex === SLIDE_TEMPLATES.length - 1 ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Next Slide <ChevronRight size={16} />
            </button>
          </div>

          {/* Numbered Slide Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {SLIDE_TEMPLATES.map((slide, idx) => (
              <button
                key={slide.slideNumber}
                onClick={() => setCurrentSlideIndex(idx)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: currentSlideIndex === idx ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: currentSlideIndex === idx ? '#2563eb' : '#f8fafc',
                  color: currentSlideIndex === idx ? '#ffffff' : '#334155',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                0{slide.slideNumber}
              </button>
            ))}
          </div>

          {/* Quick Register Trigger */}
          {onOpenRegister && (
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              style={{
                padding: '9px 20px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              Ready to Pitch? Register →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
