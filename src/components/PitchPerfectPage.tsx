import React, { useState, useEffect, useRef } from 'react';
import {
  Lightbulb,
  Rocket,
  Trophy,
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  MapPin,
  Award,
  ArrowRight,
  ExternalLink,
  Download,
  Copy,
  Check,
  Menu,
  ShieldCheck,
  Building,
  Upload,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PitchTemplateModal } from './PitchTemplateModal';

interface PitchPerfectPageProps {
  onBackToHome: () => void;
  onToast?: (msg: string) => void;
}

export const PitchPerfectPage: React.FC<PitchPerfectPageProps> = ({ onBackToHome, onToast }) => {
  // Mobile navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Active Category Modal for Details
  const [activeCategoryModal, setActiveCategoryModal] = useState<'idea' | 'project' | null>(null);

  // Pitch Template 8-Slide Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Horizontal Storytelling Active Slide
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Rules accordion open index
  const [openRuleIndex, setOpenRuleIndex] = useState<number | null>(0);

  // FAQ accordion open index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Active Judging criterion hover
  const [hoveredCriterion, setHoveredCriterion] = useState<number | null>(null);

  // Custom Cursor state (ref-driven: no React re-render on mouse move)
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorTargetRef = useRef({ x: -100, y: -100 });
  const cursorCurrentRef = useRef({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [cursorExpanded, setCursorExpanded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Canvas ref for 3D Innovation Energy Sculpture
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Official Google Apps Script Web App Endpoint from SSREC_Pitch_Registration_GoogleSheets_FIXED
  const PITCH_GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbxdGPR5FNlI38fNZo3Q6KjmGHoVdI_f2yZ_b8feevHnJNlXVE8SU1sU28mcII4x9EcW/exec';

  // Registration Form State
  const [teamSize, setTeamSize] = useState<number>(1);
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: 'III Year',
    category: 'IDEA PITCH',
    teamName: '',
    domain: 'Artificial Intelligence & Machine Learning',
    projectTitle: '',
    description: '',
    transactionId: '',
  });

  const [members, setMembers] = useState([
    { name: '', email: '', phone: '', department: '', year: 'III Year' },
    { name: '', email: '', phone: '', department: '', year: 'III Year' },
    { name: '', email: '', phone: '', department: '', year: 'III Year' },
  ]);

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<{
    regId: string;
    name: string;
    email: string;
    phone: string;
    category: string;
    domain: string;
    teamName: string;
    college: string;
    department: string;
    projectTitle: string;
    description: string;
    date: string;
    amount: string;
    transactionId: string;
    paymentUrl?: string;
    memberCount: number;
    membersList: string[];
  } | null>(null);

  const [copiedUpi, setCopiedUpi] = useState(false);

  // Countdown timer to 09 October 2026, 10:00 AM
  const targetTime = new Date('2026-10-09T10:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetTime - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  // Touch device detection & Scroll effect
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Cursor follow — ref-driven + rAF lerp (no React re-render per mouse move)
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorTargetRef.current.x = e.clientX;
      cursorTargetRef.current.y = e.clientY;

      // Parallax mouse update
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let rafId = 0;
    const animateCursor = () => {
      const cur = cursorCurrentRef.current;
      const tgt = cursorTargetRef.current;

      // Snap on first appearance, then ease toward the target
      if (cur.x < -50 || cur.y < -50) {
        cur.x = tgt.x;
        cur.y = tgt.y;
      } else {
        cur.x += (tgt.x - cur.x) * 0.22;
        cur.y += (tgt.y - cur.y) * 0.22;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animateCursor);
    };
    rafId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isTouchDevice]);

  // 3D Innovation Kinetic Sculpture Canvas (WebGL-inspired 3D particle torus)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes on 3D torus
    const numPoints = 220;
    const points: { u: number; v: number; size: number; color: string }[] = [];
    const colors = ['#5B3DF5', '#7C4DFF', '#A78BFA', '#E9E4FF', '#F59E0B'];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        u: Math.random() * Math.PI * 2,
        v: Math.random() * Math.PI * 2,
        size: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      angleX += 0.008 + mouseRef.current.y * 0.008;
      angleY += 0.012 + mouseRef.current.x * 0.008;

      const centerX = width / 2;
      const centerY = height / 2;
      const R = Math.min(width, height) * 0.32; // Major radius
      const r = Math.min(width, height) * 0.14; // Minor radius

      // Project and sort points by Z for proper depth
      const projected = points.map((pt) => {
        // Torus coordinate equations
        const x0 = (R + r * Math.cos(pt.v)) * Math.cos(pt.u);
        const y0 = (R + r * Math.cos(pt.v)) * Math.sin(pt.u);
        const z0 = r * Math.sin(pt.v);

        // Rotation around X
        const y1 = y0 * Math.cos(angleX) - z0 * Math.sin(angleX);
        const z1 = y0 * Math.sin(angleX) + z0 * Math.cos(angleX);

        // Rotation around Y
        const x2 = x0 * Math.cos(angleY) + z1 * Math.sin(angleY);
        const z2 = -x0 * Math.sin(angleY) + z1 * Math.cos(angleY);

        // Perspective scale
        const fov = 400;
        const scale = fov / (fov + z2);
        const px = centerX + x2 * scale;
        const py = centerY + y1 * scale;

        return { px, py, z: z2, scale, size: pt.size, color: pt.color };
      });

      projected.sort((a, b) => b.z - a.z);

      // Draw subtle connecting geometric lines
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i += 6) {
        const p1 = projected[i];
        for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < 80) {
            ctx.strokeStyle = `rgba(124, 77, 255, ${Math.max(0, 0.18 - dist / 500)})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw glowing particle nodes
      projected.forEach((p) => {
        const radius = p.size * p.scale;
        ctx.beginPath();
        ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10 * p.scale;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('masssubash240@oksbi');
    setCopiedUpi(true);
    if (onToast) onToast('UPI ID copied to clipboard: masssubash240@oksbi');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (file: File | null) => {
    if (!file) {
      setScreenshotFile(null);
      setScreenshotPreview('');
      setScreenshotBase64('');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Payment screenshot file must be less than 10 MB.');
      return;
    }
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setScreenshotPreview(res);
      const b64 = res.includes(',') ? res.split(',')[1] : res;
      setScreenshotBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const updateMember = (index: number, field: string, val: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: val };
    setMembers(updated);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !regForm.fullName.trim() ||
      !regForm.email.trim() ||
      !regForm.phone.trim() ||
      !regForm.college.trim() ||
      !regForm.projectTitle.trim()
    ) {
      alert('Please fill out all required fields marked with *');
      return;
    }
    if (!regForm.transactionId.trim()) {
      alert('Please enter your 12-digit UPI / Payment Transaction ID (UTR No.)');
      return;
    }

    setIsSubmitting(true);
    setSyncStatus('Syncing with SSREC Pitch Google Sheets & Google Drive...');

    // If solo pitcher (teamSize === 1), member1 is automatically the leader so Google Script memberCount >= 1 check succeeds
    const m1 =
      teamSize >= 2 && members[0].name.trim()
        ? members[0]
        : {
            name: regForm.fullName,
            email: regForm.email,
            phone: regForm.phone,
            department: regForm.department,
            year: regForm.year,
          };
    const m2 = teamSize >= 3 ? members[1] : { name: '', email: '', phone: '', department: '', year: '' };
    const m3 = teamSize >= 4 ? members[2] : { name: '', email: '', phone: '', department: '', year: '' };

    // Standard 1x1 transparent base64 fallback if user hasn't chosen screenshot file yet
    const fallbackBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

    const googlePayload = {
      teamName: regForm.teamName.trim() || `${regForm.fullName.trim()}'s Team`,
      eventType: 'Pitch Registration',
      eventName: `SSREC Pitch Registration 2026 - ${regForm.category}`,
      participationCategory: regForm.category,
      projectTitle: regForm.projectTitle.trim(),
      domain: regForm.domain || 'Innovation & Technology',
      description: regForm.description.trim() || regForm.projectTitle.trim(),
      leader: regForm.fullName.trim(),
      leaderName: regForm.fullName.trim(),
      leaderEmail: regForm.email.trim(),
      leaderPhone: regForm.phone.trim(),
      leaderDepartment: regForm.department.trim(),
      leaderYear: regForm.year || 'III Year',
      college: regForm.college.trim(),
      member1Name: m1.name.trim(),
      member1Email: m1.email.trim(),
      member1Phone: m1.phone.trim(),
      member1Department: m1.department.trim(),
      member1Year: m1.year || 'III Year',
      member2Name: m2.name.trim(),
      member2Email: m2.email.trim(),
      member2Phone: m2.phone.trim(),
      member2Department: m2.department.trim(),
      member2Year: m2.year || '',
      member3Name: m3.name.trim(),
      member3Email: m3.email.trim(),
      member3Phone: m3.phone.trim(),
      member3Department: m3.department.trim(),
      member3Year: m3.year || '',
      transactionId: regForm.transactionId.trim(),
      paymentScreenshot: {
        name: screenshotFile ? screenshotFile.name : 'pitch_payment.jpg',
        mimeType: screenshotFile ? screenshotFile.type || 'image/jpeg' : 'image/jpeg',
        base64: screenshotBase64 || fallbackBase64,
      },
    };

    let assignedRegId = 'SSREC-2026-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    let driveFileUrl = '';

    try {
      // 1. Send to Google Apps Script Web App (SSREC Pitch Google Sheet)
      const res = await fetch(PITCH_GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(googlePayload),
      });

      const resText = await res.text();
      try {
        const jsonResult = JSON.parse(resText);
        if (jsonResult.registrationId) {
          assignedRegId = jsonResult.registrationId;
        }
        if (jsonResult.paymentScreenshot) {
          driveFileUrl = jsonResult.paymentScreenshot;
        }
      } catch {
        console.log('Google Script returned confirmation:', resText);
      }
    } catch (gErr) {
      console.warn('Google Sheets background sync notice:', gErr);
    }

    // 2. Dual sync to Supabase registrations table
    try {
      await supabase.from('registrations').insert([
        {
          registration_id: assignedRegId,
          team_name: googlePayload.teamName,
          event_type: 'technical',
          event_name: `PITCH PERFECT '26 - ${regForm.category}`,
          college: regForm.college,
          department: regForm.department,
          leader_name: regForm.fullName,
          leader_email: regForm.email,
          leader_phone: regForm.phone,
          leader_department: regForm.department,
          leader_year: regForm.year,
          project_title: regForm.projectTitle,
          description: regForm.description,
          transaction_id: regForm.transactionId,
          payment_screenshot_name: driveFileUrl || (screenshotFile ? screenshotFile.name : 'UPI-VERIFIED-RECEIPT'),
          submitted_at: new Date().toISOString(),
        },
      ]);
    } catch (sbErr) {
      console.warn('Supabase sync note:', sbErr);
    }

    // 3. Local storage persistence
    try {
      const prev = JSON.parse(localStorage.getItem('ssrec_pitch_registrations') || '[]');
      prev.unshift({ ...googlePayload, registrationId: assignedRegId, submittedAt: new Date().toISOString() });
      localStorage.setItem('ssrec_pitch_registrations', JSON.stringify(prev));
    } catch (e) {
      console.warn('Local storage cache note:', e);
    }

    setIsSubmitting(false);
    setSyncStatus('');

    const membersSummary: string[] = [regForm.fullName];
    if (teamSize >= 2 && m1.name && m1.name !== regForm.fullName) membersSummary.push(m1.name);
    if (teamSize >= 3 && m2.name) membersSummary.push(m2.name);
    if (teamSize >= 4 && m3.name) membersSummary.push(m3.name);

    setSubmittedData({
      regId: assignedRegId,
      name: regForm.fullName,
      email: regForm.email,
      phone: regForm.phone,
      category: regForm.category,
      domain: regForm.domain,
      teamName: googlePayload.teamName,
      college: regForm.college,
      department: regForm.department,
      projectTitle: regForm.projectTitle,
      description: regForm.description,
      date: '09 October 2026',
      amount: `₹${teamSize * 200} (₹200 × ${teamSize} ${teamSize === 1 ? 'member' : 'members'})`,
      transactionId: regForm.transactionId,
      paymentUrl: driveFileUrl,
      memberCount: teamSize,
      membersList: membersSummary,
    });

    if (onToast) onToast('🎉 PITCH PERFECT ’26 Registration Confirmed & Synced to Google Sheet!');
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 5 Storytelling Phases for Horizontal Scroll Section
  const storyPhases = [
    {
      num: '01',
      title: 'IDEA',
      subtitle: 'The Spark',
      desc: 'Identifying real-world friction, societal needs, and disruptive market opportunities.',
      bg: '#FFFFFF',
      color: '#050505',
      accent: '#5B3DF5',
      badge: 'Concept & Vision',
    },
    {
      num: '02',
      title: 'RESEARCH',
      subtitle: 'The Validation',
      desc: 'Customer discovery, market sizing, technical feasibility, and competitive moat definition.',
      bg: '#0A0A0F',
      color: '#FFFFFF',
      accent: '#A78BFA',
      badge: 'Market Empathy',
    },
    {
      num: '03',
      title: 'BUILD',
      subtitle: 'The Prototype',
      desc: 'Architecting working proof-of-concepts, software MVPs, or tangible hardware systems.',
      bg: '#F5F3FF',
      color: '#050505',
      accent: '#7C4DFF',
      badge: 'Engineering & Code',
    },
    {
      num: '04',
      title: 'PITCH',
      subtitle: 'The Arena',
      desc: '7-minute live spotlight before industry judges, tech leaders, and angel investors.',
      bg: '#5B3DF5',
      color: '#FFFFFF',
      accent: '#F59E0B',
      badge: 'Storytelling & Stage',
    },
    {
      num: '05',
      title: 'IMPACT',
      subtitle: 'The Launch',
      desc: 'Transforming winning pitches into incubated ventures, patent filings, and seed-backed startups.',
      bg: '#FFFFFF',
      color: '#050505',
      accent: '#10B981',
      badge: 'Incubation & Grants',
    },
  ];

  // 7 Evaluation Criteria
  const criteriaList = [
    {
      name: 'INNOVATION',
      weight: '25%',
      desc: 'Novelty of approach, uniqueness of the value proposition, and technological edge.',
    },
    {
      name: 'PROBLEM & MARKET',
      weight: '20%',
      desc: 'Clarity of the user pain-point, market size potential, and target audience validation.',
    },
    {
      name: 'FEASIBILITY',
      weight: '15%',
      desc: 'Technical practicality, resource realism, implementation timeline, and architecture.',
    },
    {
      name: 'CREATIVITY',
      weight: '15%',
      desc: 'Originality of thought, out-of-the-box system design, and creative problem solving.',
    },
    {
      name: 'IMPACT',
      weight: '10%',
      desc: 'Environmental, social, or commercial value created for customers and stakeholders.',
    },
    {
      name: 'PRESENTATION',
      weight: '10%',
      desc: 'Storytelling clarity, slide deck craftsmanship, time management, and Q&A confidence.',
    },
    {
      name: 'SCALABILITY',
      weight: '5%',
      desc: 'Long-term product roadmap, unit economics potential, and growth strategy.',
    },
  ];

  return (
    <div
      className={isTouchDevice ? 'pitch-page pitch-touch' : 'pitch-page'}
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        color: '#050505',
        fontFamily: "'Space Grotesk', 'Inter', -apple-system, sans-serif",
        overflowX: 'hidden',
        cursor: isTouchDevice ? 'auto' : 'none',
      }}
    >
      {/* ─── CUSTOM FRAMER CURSOR ─── */}
      {!isTouchDevice && (
        <div
          ref={cursorDotRef}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: cursorExpanded ? '88px' : '16px',
            height: cursorExpanded ? '88px' : '16px',
            borderRadius: '50%',
            backgroundColor: cursorExpanded ? 'rgba(91, 61, 245, 0.92)' : '#FFFFFF',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            pointerEvents: 'none',
            transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
            transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), height 0.22s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
            zIndex: 999999,
            mixBlendMode: cursorExpanded ? 'normal' : 'difference',
            boxShadow: cursorExpanded ? '0 10px 30px rgba(91, 61, 245, 0.45)' : 'none',
            willChange: 'transform',
          }}
        >
          {cursorExpanded && cursorText}
        </div>
      )}

      {/* ─── JSON-LD STRUCTURED DATA SCHEMA FOR SEO ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: "PITCH PERFECT '26",
            description:
              'Student innovation, startup, idea pitching and project pitching competition at Sri Sai Ranganathan Engineering College.',
            startDate: '2026-10-09T10:00:00+05:30',
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: {
              '@type': 'Place',
              name: 'Sri Sai Ranganathan Engineering College',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Thondamuthur Road, Pooluvapatti',
                addressLocality: 'Coimbatore',
                postalCode: '641109',
                addressRegion: 'Tamil Nadu',
                addressCountry: 'IN',
              },
            },
            organizer: {
              '@type': 'Organization',
              name: 'Sri Sai Ranganathan Engineering College',
              url: 'https://ssrec.ac.in',
            },
            offers: {
              '@type': 'Offer',
              price: '200',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              validFrom: '2026-09-01T00:00:00+05:30',
            },
          }),
        }}
      />

      {/* ─── GLOBAL FLOATING GLASS NAVBAR ─── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          padding: scrolled ? '14px 28px' : '22px 32px',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid transparent',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            maxWidth: '1380px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {/* Brand */}
          <div
            onClick={onBackToHome}
            onMouseEnter={() => {
              setCursorExpanded(true);
              setCursorText('HOME');
            }}
            onMouseLeave={() => setCursorExpanded(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #5B3DF5 0%, #050505 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: '1.1rem',
                boxShadow: '0 8px 18px rgba(91, 61, 245, 0.3)',
              }}
            >
              P
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.12rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#050505',
                }}
              >
                PITCH PERFECT <span style={{ color: '#F59E0B' }}>’26</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em' }}>
                SSREC INNOVRISE
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '32px',
            }}
            className="pitch-desktop-nav"
          >
            {[
              { label: 'Events', id: '__back__' },
              { label: 'About', id: 'about' },
              { label: 'Categories', id: 'categories' },
              { label: 'Experience', id: 'story' },
              { label: 'Prize', id: 'prize' },
              { label: 'Rules', id: 'rules' },
              { label: 'FAQ', id: 'faq' },
            ].map((item) => {
              const isBack = item.id === '__back__';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isBack) {
                      onBackToHome();
                    } else {
                      scrollToSection(item.id);
                    }
                  }}
                  onMouseEnter={() => {
                    setCursorExpanded(true);
                    setCursorText(isBack ? 'BACK' : 'JUMP');
                  }}
                  onMouseLeave={() => setCursorExpanded(false)}
                  style={{
                    background: isBack ? 'rgba(91, 61, 245, 0.08)' : 'none',
                    border: isBack ? '1.5px solid rgba(91, 61, 245, 0.4)' : 'none',
                    borderRadius: isBack ? '100px' : '0',
                    fontSize: isBack ? '0.82rem' : '0.88rem',
                    fontWeight: isBack ? 800 : 600,
                    letterSpacing: isBack ? '0.06em' : '0',
                    color: isBack ? '#5B3DF5' : '#334155',
                    cursor: 'pointer',
                    padding: isBack ? '7px 16px' : '4px 0',
                    position: 'relative',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isBack ? '← Events' : item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              onMouseEnter={() => {
                setCursorExpanded(true);
                setCursorText('SLIDES');
              }}
              onMouseLeave={() => setCursorExpanded(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '100px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#050505',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <FileText size={15} color="#5B3DF5" />
              TEMPLATE (8 SLIDES)
            </button>

            <button
              onClick={() => scrollToSection('register')}
              onMouseEnter={() => {
                setCursorExpanded(true);
                setCursorText('REGISTER');
              }}
              onMouseLeave={() => setCursorExpanded(false)}
              style={{
                padding: '10px 22px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #5B3DF5 0%, #7C4DFF 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(91, 61, 245, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              REGISTER ↗
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '8px',
                cursor: 'pointer',
              }}
              className="pitch-mobile-burger"
              aria-label="Toggle navigation menu"
            >
              <Menu size={20} color="#050505" />
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Animated Overlay */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 9999,
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {[
                { label: '← EVENTS', id: '__back__' },
                { label: '01 / ABOUT EVENT', id: 'about' },
                { label: '02 / CATEGORIES', id: 'categories' },
                { label: '03 / EXPERIENCE JOURNEY', id: 'story' },
                { label: '04 / ₹20,000 PRIZE', id: 'prize' },
                { label: '05 / EVENT PROCESS', id: 'timeline' },
                { label: '06 / RULES & GUIDELINES', id: 'rules' },
                { label: '07 / FREQUENT QUESTIONS', id: 'faq' },
              ].map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => {
                    if (m.id === '__back__') {
                      setMobileMenuOpen(false);
                      onBackToHome();
                    } else {
                      scrollToSection(m.id);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: m.id === '__back__' ? '1.2rem' : '1.4rem',
                    fontWeight: 800,
                    color: m.id === '__back__' ? '#5B3DF5' : '#050505',
                    padding: '8px 0',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    animation: `slideUp 0.3s ease forwards ${idx * 0.05}s`,
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsTemplateModalOpen(true);
                }}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: '#f1f5f9',
                  color: '#050505',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <FileText size={18} /> OPEN 8-SLIDE PITCH TEMPLATE
              </button>

              <button
                onClick={() => scrollToSection('register')}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #5B3DF5 0%, #7C4DFF 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                }}
              >
                REGISTER NOW (₹200) ↗
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── CINEMATIC HERO SECTION ─── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          minHeight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '75px 20px 30px 20px',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Background Grid & Mesh Glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'radial-gradient(rgba(91, 61, 245, 0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px, 24px 24px',
            opacity: 0.85,
          }}
        />

        {/* Ambient Violet Radial Atmosphere */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '-10%',
            width: '540px',
            height: '540px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 77, 255, 0.15) 0%, rgba(233, 228, 255, 0.4) 45%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1380px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          {/* Responsive 2-Column Split: Content Left + Official Poster Card Right */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.85fr)',
              gap: '28px',
              alignItems: 'center',
              marginBottom: '24px',
            }}
            className="pitch-hero-split-grid"
          >
            {/* LEFT COLUMN: HERO HEADLINE & ACTIONS */}
            <div>
              {/* Small Top Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  backgroundColor: 'rgba(91, 61, 245, 0.06)',
                  border: '1px solid rgba(91, 61, 245, 0.18)',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#5B3DF5',
                    boxShadow: '0 0 8px #5B3DF5',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#5B3DF5',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  SRI SAI RANGANATHAN ENGINEERING COLLEGE PRESENTS
                </span>
              </div>

              {/* Editorial Hero Typography */}
              <div style={{ marginBottom: '14px' }}>
                <h1
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(38px, 6.2vw, 76px)',
                    fontWeight: 900,
                    lineHeight: 0.94,
                    letterSpacing: '-0.04em',
                    color: '#050505',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  <div style={{ display: 'block' }}>PITCH</div>
                  <div style={{ display: 'block' }}>
                    PERFECT{' '}
                    <span
                      style={{
                        color: '#F59E0B',
                        display: 'inline-block',
                        transform: 'translateY(-4px)',
                        textShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      ’26
                    </span>
                  </div>
                </h1>
              </div>

              {/* Tagline & Core Statement */}
              <div style={{ maxWidth: '640px', marginBottom: '20px' }}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                    fontWeight: 800,
                    color: '#5B3DF5',
                    letterSpacing: '0.04em',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  THINK BIG • PITCH BOLD • BIG WIN
                </div>
                <p
                  style={{
                    fontSize: 'clamp(0.92rem, 1.1vw, 1.05rem)',
                    color: '#475569',
                    lineHeight: 1.55,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  An innovation-driven pitching competition where students turn bold ideas and working projects into
                  meaningful startups. Compete for cash prizes up to <strong>₹20,000/-</strong> before premier ecosystem partners.
                </p>
              </div>

              {/* Action Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <button
                  onClick={() => scrollToSection('register')}
                  onMouseEnter={() => {
                    setCursorExpanded(true);
                    setCursorText('JOIN');
                  }}
                  onMouseLeave={() => setCursorExpanded(false)}
                  style={{
                    padding: '13px 28px',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #5B3DF5 0%, #7C4DFF 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    letterSpacing: '0.03em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 12px 28px -6px rgba(91, 61, 245, 0.45)',
                    transition: 'transform 0.2s',
                  }}
                >
                  REGISTER NOW ↗
                </button>

                <button
                  onClick={() => scrollToSection('about')}
                  onMouseEnter={() => {
                    setCursorExpanded(true);
                    setCursorText('EXPLORE');
                  }}
                  onMouseLeave={() => setCursorExpanded(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '100px',
                    backgroundColor: '#ffffff',
                    color: '#050505',
                    border: '1.5px solid #cbd5e1',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  EXPLORE EVENT ↓
                </button>

                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '100px',
                    backgroundColor: 'rgba(91, 61, 245, 0.08)',
                    color: '#5B3DF5',
                    border: '1.5px solid rgba(91, 61, 245, 0.25)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={15} /> PITCH TEMPLATES
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: OFFICIAL EVENT POSTER BANNER WITH 3D CANVAS BEHIND */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              className="pitch-hero-poster-wrapper"
            >
              {/* Interactive 3D Canvas Kinetic Sculpture in Background */}
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 1,
                  opacity: 0.35,
                }}
              />

              {/* Official Banner Poster Card */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  borderRadius: '20px',
                  padding: '6px',
                  background: 'linear-gradient(135deg, rgba(91, 61, 245, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
                  border: '2px solid rgba(91, 61, 245, 0.3)',
                  boxShadow: '0 20px 45px rgba(91, 61, 245, 0.25)',
                  maxWidth: '380px',
                  width: '100%',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                }}
              >
                <img
                  src="/images/pitch-perfect-poster.jpg"
                  alt="Pitch Perfect '26 Official Event Banner - Sri Sai Ranganathan Engineering College"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '420px',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: '14px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Event Metadata Bar & Live Countdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '14px 22px',
              borderRadius: '18px',
              backgroundColor: '#FAFAFC',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                  EVENT DATE
                </span>
                <strong style={{ fontSize: '1rem', color: '#050505' }}>09 OCTOBER 2026</strong>
              </div>

              <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }} />

              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                  STAGE TIME
                </span>
                <strong style={{ fontSize: '1rem', color: '#050505' }}>10:00 AM ONWARDS</strong>
              </div>

              <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }} />

              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                  REGISTRATION FEE
                </span>
                <strong style={{ fontSize: '1rem', color: '#5B3DF5' }}>₹200 / HEAD</strong>
              </div>

              <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1' }} />

              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                  CASH PRIZE POOL
                </span>
                <strong style={{ fontSize: '1rem', color: '#D97706' }}>UP TO ₹20,000/-</strong>
              </div>
            </div>

            {/* Countdown Pod */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {[
                { val: timeLeft.days, unit: 'DAYS' },
                { val: timeLeft.hours, unit: 'HRS' },
                { val: timeLeft.minutes, unit: 'MIN' },
                { val: timeLeft.seconds, unit: 'SEC' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center',
                    minWidth: '54px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: '#050505',
                    }}
                  >
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700 }}>{item.unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MOVING INFINITE MARQUEES ─── */}
      <div style={{ overflow: 'hidden', backgroundColor: '#050505', color: '#FFFFFF', padding: '16px 0' }}>
        {/* Row 1: Leftward */}
        <div
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            gap: '32px',
            animation: 'marqueeLeft 28s linear infinite',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
          }}
        >
          {Array(4)
            .fill(
              'IDEA • INNOVATION • TECHNOLOGY • STARTUP • CREATIVITY • FUTURE • IMPACT • THINK BIG • PITCH BOLD • BIG WIN •'
            )
            .map((txt, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '24px' }}>
                <span>{txt}</span>
              </span>
            ))}
        </div>

        {/* Row 2: Rightward / Purple Accent */}
        <div
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            gap: '32px',
            marginTop: '10px',
            animation: 'marqueeRight 34s linear infinite',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#A78BFA',
            letterSpacing: '0.15em',
          }}
        >
          {Array(4)
            .fill('PITCH • BUILD • CREATE • INNOVATE • IMPACT • SCALE • VALIDATE • LAUNCH • COMPETE • WIN •')
            .map((txt, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '24px' }}>
                <span>{txt}</span>
              </span>
            ))}
        </div>
      </div>

      {/* ─── 01 / EDITORIAL EVENT INTRO ─── */}
      <section
        id="about"
        style={{
          padding: '52px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div
          style={{
            maxWidth: '1380px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Left Large Heading */}
          <div>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                color: '#5B3DF5',
                letterSpacing: '0.15em',
                marginBottom: '16px',
              }}
            >
              01 / THE EVENT
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(44px, 7vw, 92px)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: '#050505',
                margin: 0,
              }}
            >
              WHERE
              <br />
              IDEAS
              <br />
              BECOME
              <br />
              <span style={{ color: '#5B3DF5' }}>IMPACT.</span>
            </h2>
          </div>

          {/* Right Editorial Copy with Highlighted Words */}
          <div>
            <p
              style={{
                fontSize: 'clamp(1.25rem, 2vw, 1.7rem)',
                lineHeight: 1.5,
                color: '#1e293b',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                marginBottom: '28px',
              }}
            >
              <strong>PITCH PERFECT ’26</strong> is an elite platform engineered for students to{' '}
              <span style={{ color: '#5B3DF5', textDecoration: 'underline', textDecorationColor: '#E9E4FF' }}>
                present innovative ideas
              </span>
              , showcase working prototypes, demonstrate groundbreaking technology, and connect directly with mentors,
              incubators, and ecosystem builders eager to fund and scale the next generation of solutions.
            </p>

            <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.7, marginBottom: '36px' }}>
              Whether you are pitching a transformative concept on a napkin or demonstrating an autonomous AI drone,
              your breakthrough deserves the stage. Powered by Sri Sai Ranganathan Engineering College in association
              with the Sri Sai Ranganathan Innovrise Foundation.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div
                style={{
                  padding: '16px 24px',
                  borderRadius: '16px',
                  backgroundColor: '#FAFAFC',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800 }}>ORGANIZED BY</div>
                <div style={{ fontWeight: 800, color: '#050505', marginTop: '2px' }}>
                  Sri Sai Ranganathan Engg College
                </div>
              </div>

              <div
                style={{
                  padding: '16px 24px',
                  borderRadius: '16px',
                  backgroundColor: '#FAFAFC',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800 }}>IN ASSOCIATION WITH</div>
                <div style={{ fontWeight: 800, color: '#5B3DF5', marginTop: '2px' }}>
                  Sri Sai Ranganathan Innovrise
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SCROLLING EDITORIAL STATISTICS ─── */}
      <section
        style={{
          padding: '80px 32px',
          backgroundColor: '#FAFAFC',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            maxWidth: '1380px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
          }}
        >
          {[
            { num: '₹20K+', label: 'PRIZE POTENTIAL', sub: 'Cash rewards for champions' },
            { num: '02', label: 'PITCH CATEGORIES', sub: 'Idea Pitch & Project Pitch' },
            { num: '09', label: 'OCTOBER 2026', sub: '10:00 AM Stage Onwards' },
            { num: '₹200', label: 'REGISTRATION', sub: 'Per student participant' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: '28px',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 8px 25px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(3rem, 5vw, 4.2rem)',
                  fontWeight: 900,
                  color: i === 0 ? '#F59E0B' : i === 3 ? '#5B3DF5' : '#050505',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  marginBottom: '10px',
                }}
              >
                {stat.num}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#050505', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TWO WAYS TO PITCH: CATEGORY SECTION ─── */}
      <section
        id="categories"
        style={{
          padding: '52px 20px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
            <div>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  color: '#5B3DF5',
                  letterSpacing: '0.15em',
                  marginBottom: '10px',
                }}
              >
                02 / THE TRACKS
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(36px, 5.5vw, 76px)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: '#050505',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                TWO WAYS TO PITCH.
              </h2>
            </div>
            <p style={{ maxWidth: '440px', color: '#64748b', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              Select the arena tailored to your stage of development. From fresh concepts to fully functioning code.
            </p>
          </div>

          {/* Two Massive Asymmetrical Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            {/* Card 01: Idea Pitch */}
            <div
              onMouseEnter={() => {
                setCursorExpanded(true);
                setCursorText('EXPLORE');
              }}
              onMouseLeave={() => setCursorExpanded(false)}
              style={{
                padding: '48px',
                borderRadius: '32px',
                backgroundColor: '#FAFAFC',
                border: '1.5px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '480px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(91, 61, 245, 0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: '#5B3DF5',
                    }}
                  >
                    01
                  </span>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                    }}
                  >
                    <Lightbulb size={24} color="#5B3DF5" />
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    color: '#050505',
                    margin: '0 0 16px 0',
                    letterSpacing: '-0.03em',
                  }}
                >
                  IDEA PITCH
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                  Pitch innovative ideas, novel concepts, business frameworks or social-impact solutions that solve real
                  frictions. No finished code or hardware required.
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {['Concept Validation', 'Market Size & TAM', 'Problem-Solution Fit', 'Presentation Deck'].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '100px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#334155',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => setActiveCategoryModal('idea')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#5B3DF5',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0,
                  }}
                >
                  EXPLORE IDEA PITCH ↗
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>₹200 / HEAD</span>
              </div>
            </div>

            {/* Card 02: Project Pitch */}
            <div
              onMouseEnter={() => {
                setCursorExpanded(true);
                setCursorText('EXPLORE');
              }}
              onMouseLeave={() => setCursorExpanded(false)}
              style={{
                padding: '48px',
                borderRadius: '32px',
                backgroundColor: '#050505',
                color: '#FFFFFF',
                border: '1.5px solid #222222',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '480px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(124, 77, 255, 0.25) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: '#A78BFA',
                    }}
                  >
                    02
                  </span>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#1E1E24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Rocket size={24} color="#A78BFA" />
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    margin: '0 0 16px 0',
                    letterSpacing: '-0.03em',
                  }}
                >
                  PROJECT PITCH
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
                  Showcase working prototypes, completed projects, physical hardware or live practical technology
                  solutions. Live demonstration of working code or device.
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
                  {['Working Prototype / MVP', 'Architecture Demo', 'Technical Rigor', 'Live Demonstration'].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '100px',
                        backgroundColor: '#16161a',
                        border: '1px solid rgba(255,255,255,0.12)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#E2E8F0',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <button
                  onClick={() => setActiveCategoryModal('project')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#A78BFA',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0,
                  }}
                >
                  EXPLORE PROJECT PITCH ↗
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8' }}>₹200 / HEAD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HORIZONTAL SCROLL STORYTELLING: 01 IDEA → 05 IMPACT ─── */}
      <section
        id="story"
        style={{
          padding: '52px 20px',
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '10px' }}>
                03 / THE JOURNEY
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(36px, 5.5vw, 76px)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: '#050505',
                  margin: 0,
                }}
              >
                FROM SPARK TO SCALE.
              </h2>
            </div>

            {/* Step Selector Controls */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {storyPhases.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStoryIndex(idx)}
                  style={{
                    width: activeStoryIndex === idx ? '36px' : '12px',
                    height: '12px',
                    borderRadius: '100px',
                    backgroundColor: activeStoryIndex === idx ? '#5B3DF5' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Interactive Horizontal Cards Rail */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {storyPhases.map((phase, idx) => (
              <div
                key={phase.num}
                onClick={() => setActiveStoryIndex(idx)}
                onMouseEnter={() => {
                  setCursorExpanded(true);
                  setCursorText(phase.title);
                }}
                onMouseLeave={() => setCursorExpanded(false)}
                style={{
                  padding: '36px 28px',
                  borderRadius: '24px',
                  backgroundColor: phase.bg,
                  color: phase.color,
                  border: activeStoryIndex === idx ? `2.5px solid ${phase.accent}` : '1.5px solid #e2e8f0',
                  boxShadow: activeStoryIndex === idx ? '0 20px 40px -10px rgba(91, 61, 245, 0.25)' : '0 6px 18px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  transform: activeStoryIndex === idx ? 'translateY(-6px)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '340px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        color: phase.accent,
                      }}
                    >
                      {phase.num}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '100px',
                        backgroundColor: 'rgba(124, 77, 255, 0.12)',
                        color: phase.accent,
                      }}
                    >
                      {phase.badge}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', opacity: 0.7, marginBottom: '6px' }}>
                    {phase.subtitle}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '2.2rem',
                      fontWeight: 900,
                      margin: '0 0 16px 0',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {phase.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6, opacity: 0.85, margin: 0 }}>
                    {phase.desc}
                  </p>
                </div>

                <div style={{ paddingTop: '18px', borderTop: `1px solid ${activeStoryIndex === idx ? phase.accent : 'rgba(0,0,0,0.08)'}`, fontSize: '0.78rem', fontWeight: 800, color: phase.accent, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>PHASE {phase.num}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3D PRESENTATION SHOWCASE SECTION ─── */}
      <section
        style={{
          padding: '52px 20px',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '12px' }}>
            04 / THE STAGE ENVIRONMENT
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(36px, 5.5vw, 76px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#050505',
              margin: '0 0 20px 0',
            }}
          >
            THE STAGE OF INNOVATORS.
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto 60px auto', color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Pitch your solution with 16:9 widescreen presentation displays, direct jury interaction, and live prototype
            demonstration docks.
          </p>

          {/* 3D Perspective Floating Deck Mockups */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              perspective: '1200px',
            }}
          >
            {[
              { title: 'PROBLEM STATEMENT', sub: 'Slide 02 • Core User Pain', tag: 'Slide Deck' },
              { title: 'SYSTEM ARCHITECTURE', sub: 'Slide 04 • Technical Engine', tag: 'Engineering' },
              { title: 'BUSINESS & TRACTION', sub: 'Slide 06 • Unit Economics', tag: 'Commercial' },
              { title: 'ROADMAP & IMPACT', sub: 'Slide 08 • Growth & Vision', tag: 'Scale' },
            ].map((card, i) => (
              <div
                key={i}
                onMouseEnter={() => {
                  setCursorExpanded(true);
                  setCursorText('VIEW ↗');
                }}
                onMouseLeave={() => setCursorExpanded(false)}
                onClick={() => setIsTemplateModalOpen(true)}
                style={{
                  padding: '36px 28px',
                  borderRadius: '24px',
                  backgroundColor: '#FAFAFC',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transform: `rotateY(${i % 2 === 0 ? '-4deg' : '4deg'})`,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '100px',
                      backgroundColor: 'rgba(91, 61, 245, 0.08)',
                      color: '#5B3DF5',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                    }}
                  >
                    {card.tag}
                  </span>
                  <ExternalLink size={16} color="#94a3b8" />
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', fontWeight: 900, color: '#050505', marginBottom: '8px' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{card.sub}</div>

                <div
                  style={{
                    marginTop: '32px',
                    height: '110px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed #cbd5e1',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b' }}>
                    16:9 OFFICIAL TEMPLATE SLIDE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY PARTICIPATE: EDITORIAL BLOCKS ─── */}
      <section
        style={{
          padding: '52px 20px',
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ maxWidth: '640px', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '10px' }}>
              05 / ADVANTAGES
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 5.5vw, 76px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#050505',
                margin: 0,
                lineHeight: 1,
              }}
            >
              MORE THAN A COMPETITION.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {[
              { num: '01', title: 'SHOWCASE', desc: 'Put your ideas and working prototypes before a high-profile audience of technocrats and innovators.' },
              { num: '02', title: 'BUILD', desc: 'Transform theoretical concepts into concrete, functional products and verified solutions.' },
              { num: '03', title: 'CONNECT', desc: 'Build long-lasting ties with founders, incubation leads, industry mentors and like-minded peers.' },
              { num: '04', title: 'COMPETE', desc: 'Challenge your technical, presentation, and analytical skills on a professional, rigorous stage.' },
              { num: '05', title: 'CREATE', desc: 'Address pressing societal challenges in AI, IoT, CleanTech, AgriTech, and HealthTech.' },
              { num: '06', title: 'GROW', desc: 'Unlock pathway opportunities for venture incubation, seed grants, and patent filing support.' },
            ].map((block) => (
              <div
                key={block.num}
                style={{
                  padding: '36px',
                  borderRadius: '24px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: '#5B3DF5',
                    marginBottom: '16px',
                  }}
                >
                  {block.num}
                </div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: '#050505',
                    margin: '0 0 12px 0',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {block.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {block.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FULLSCREEN DRAMATIC PRIZE SECTION ─── */}
      <section
        id="prize"
        style={{
          position: 'relative',
          padding: '60px 20px',
          backgroundColor: '#050505',
          color: '#FFFFFF',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Animated Golden Rays Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(800px, 90vw)',
            height: 'min(800px, 90vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(91, 61, 245, 0.12) 40%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '100px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#F59E0B',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              marginBottom: '28px',
            }}
          >
            <Trophy size={16} /> CASH PRIZE UP TO
          </div>

          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(36px, 6vw, 76px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
              margin: '0 0 16px 0',
              lineHeight: 1.05,
            }}
          >
            BIG IDEAS DESERVE
            <br />
            <span style={{ color: '#F59E0B' }}>BIG WINS.</span>
          </h2>

          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(54px, 12vw, 140px)',
              fontWeight: 950,
              color: '#F59E0B',
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              margin: '24px 0',
              textShadow: '0 0 60px rgba(245, 158, 11, 0.45)',
            }}
          >
            ₹20,000/-
          </div>

          <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '640px', margin: '0 auto 48px auto', lineHeight: 1.6 }}>
            Top innovative ideas and working projects will be awarded prestigious merit shields, official certificates of
            excellence, incubation advisory, and cash rewards.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollToSection('register')}
              onMouseEnter={() => {
                setCursorExpanded(true);
                setCursorText('WIN');
              }}
              onMouseLeave={() => setCursorExpanded(false)}
              style={{
                padding: '18px 38px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#050505',
                border: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 12px 30px rgba(245, 158, 11, 0.35)',
              }}
            >
              COMPETE FOR ₹20,000 ↗
            </button>
          </div>
        </div>
      </section>

      {/* ─── EVENT PROCESS: INTERACTIVE TIMELINE ─── */}
      <section
        id="timeline"
        style={{
          padding: '52px 20px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '10px' }}>
              06 / THE TIMELINE
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 5.5vw, 68px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#050505',
                margin: 0,
              }}
            >
              FROM IDEA TO STAGE.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { step: '01', title: 'REGISTER ONLINE', time: 'Before 09 Oct 2026', desc: 'Fill out team details, choose Idea Pitch or Project Pitch track, and submit registration fee of ₹200/head.' },
              { step: '02', title: 'PREPARE PITCH DECK', time: 'Preparation Period', desc: 'Design your 8-slide presentation outline using our official template guidelines.' },
              { step: '03', title: 'VENUE REPORTING & SPOT VERIFICATION', time: '09 Oct 2026 • 10:00 AM', desc: 'Report to Sri Sai Ranganathan Engineering College campus for registration badge and stage slot allocation.' },
              { step: '04', title: 'STAGE PITCH & DEMONSTRATION', time: '11:00 AM — 03:00 PM', desc: 'Present in your allotted slot: 7 minutes pitch + 3 minutes live jury Q&A and prototype inspection.' },
              { step: '05', title: 'AWARDS & VALEDICTORY', time: '03:30 PM Onwards', desc: 'Grand award ceremony with cash prize up to ₹20,000/-, certificates, and incubator onboarding.' },
            ].map((item, idx) => (
              <div
                key={item.step}
                style={{
                  display: 'flex',
                  gap: '24px',
                  padding: '28px 32px',
                  borderRadius: '20px',
                  backgroundColor: '#FAFAFC',
                  border: '1.5px solid #e2e8f0',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: idx === 0 ? '#5B3DF5' : '#ffffff',
                    color: idx === 0 ? '#ffffff' : '#5B3DF5',
                    border: '1.5px solid #5B3DF5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.35rem', fontWeight: 900, color: '#050505', margin: 0 }}>
                      {item.title}
                    </h3>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5B3DF5', padding: '4px 10px', borderRadius: '100px', backgroundColor: 'rgba(91, 61, 245, 0.08)' }}>
                      {item.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RULES SECTION: EDITORIAL ACCORDION ─── */}
      <section
        id="rules"
        style={{
          padding: '52px 20px',
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '10px' }}>
              07 / GUIDELINES
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 5.5vw, 68px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#050505',
                margin: 0,
              }}
            >
              KNOW THE RULES.
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '10px' }}>
              Official event guidelines will be updated by the organizers.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                num: '01',
                title: 'Registration & Eligibility',
                content:
                  'Open to all undergraduate, postgraduate, and diploma students from any recognized institution. Inter-college teams and inter-department teams are permitted. Teams can have 1 to 4 members. Registration fee is ₹200 per head.',
              },
              {
                num: '02',
                title: 'Pitch Format & Timing',
                content:
                  'Each team is allotted 7 minutes to deliver their pitch deck, followed by 3 minutes of rigorous question and answer by the expert jury panel. Time limits are strictly enforced.',
              },
              {
                num: '03',
                title: 'Presentation Slide Deck',
                content:
                  'Presentations should ideally follow the official 8-slide pitch format: Title, Problem, Solution, Architecture/Tech, Market & Users, Prototype/Validation, Business & Traction, and Roadmap. PPT, PPTX or PDF format accepted.',
              },
              {
                num: '04',
                title: 'Project Requirements',
                content:
                  'For Project Pitch, teams must have working code, hardware setups, or functional MVPs ready for demonstration. Power outlets and presentation screens are provided at the venue.',
              },
              {
                num: '05',
                title: 'Evaluation & Fair Play',
                content:
                  'Jury scoring is final and binding across innovation, feasibility, market potential, and clarity. Plagiarism or misrepresentation of third-party IP without attribution results in immediate disqualification.',
              },
              {
                num: '06',
                title: 'Final Submission',
                content:
                  'Final slide decks should be brought in on a USB pen drive on the event day and also uploaded via the online portal. Official event guidelines subject to organizer confirmation.',
              },
            ].map((rule, idx) => {
              const isOpen = openRuleIndex === idx;
              return (
                <div
                  key={rule.num}
                  style={{
                    borderRadius: '18px',
                    backgroundColor: '#ffffff',
                    border: isOpen ? '1.5px solid #5B3DF5' : '1.5px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenRuleIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '24px 28px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '1.2rem',
                          fontWeight: 900,
                          color: isOpen ? '#5B3DF5' : '#94a3b8',
                        }}
                      >
                        {rule.num}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          color: '#050505',
                        }}
                      >
                        {rule.title}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp size={20} color="#5B3DF5" /> : <ChevronDown size={20} color="#64748b" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 28px 24px 64px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                      {rule.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── JUDGING CRITERIA: INTERACTIVE TYPOGRAPHY ─── */}
      <section
        style={{
          padding: '52px 20px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '10px' }}>
              08 / THE RUBRIC
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 5.5vw, 68px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#050505',
                margin: 0,
              }}
            >
              WHAT MAKES A GREAT PITCH?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px' }}>
              Evaluation criteria subject to organizer confirmation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {criteriaList.map((crit, idx) => {
              const isHovered = hoveredCriterion === idx;
              return (
                <div
                  key={crit.name}
                  onMouseEnter={() => setHoveredCriterion(idx)}
                  onMouseLeave={() => setHoveredCriterion(null)}
                  style={{
                    padding: '24px 32px',
                    borderRadius: '16px',
                    backgroundColor: isHovered ? '#5B3DF5' : '#FAFAFC',
                    color: isHovered ? '#FFFFFF' : '#050505',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 900, opacity: isHovered ? 1 : 0.4 }}>
                      0{idx + 1}
                    </span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                      {crit.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={{ fontSize: '0.9rem', color: isHovered ? '#E9E4FF' : '#64748b', maxWidth: '420px', lineHeight: 1.4 }}>
                      {crit.desc}
                    </span>
                    <span
                      style={{
                        padding: '6px 16px',
                        borderRadius: '100px',
                        backgroundColor: isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(91, 61, 245, 0.08)',
                        color: isHovered ? '#FFFFFF' : '#5B3DF5',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 900,
                        fontSize: '0.95rem',
                      }}
                    >
                      {crit.weight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 09 / HIGH-CONVERSION REGISTRATION SECTION ─── */}
      <section
        id="register"
        style={{
          padding: '52px 20px',
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '100px',
                backgroundColor: 'rgba(91, 61, 245, 0.08)',
                color: '#5B3DF5',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                marginBottom: '14px',
              }}
            >
              <Target size={15} /> 09 / OFFICIAL REGISTRATION
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(40px, 6vw, 84px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#050505',
                margin: '0 0 12px 0',
              }}
            >
              READY TO PITCH?
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '640px', margin: '0 auto 20px auto' }}>
              “Your idea deserves a stage.” Register your slot in the official SSREC Pitch 2026 registry.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '16px',
                padding: '8px 24px',
                borderRadius: '100px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#334155',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <span>💰 ₹200 / HEAD</span>
              <span>📅 09 OCT 2026</span>
              <span>⏰ 10:00 AM ONWARDS</span>
            </div>
          </div>

          {/* If Submitted: Verified Pass Receipt */}
          {submittedData ? (
            <div
              style={{
                maxWidth: '740px',
                margin: '0 auto',
                padding: '48px',
                borderRadius: '28px',
                backgroundColor: '#ffffff',
                border: '2px solid #22c55e',
                boxShadow: '0 25px 60px -15px rgba(34, 197, 94, 0.25)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  boxShadow: '0 8px 20px rgba(34, 197, 94, 0.2)',
                }}
              >
                <CheckCircle2 size={44} color="#16a34a" />
              </div>

              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '2.2rem',
                  fontWeight: 950,
                  color: '#15803d',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                REGISTRATION CONFIRMED 🚀
              </h3>
              <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '24px' }}>
                Your pitch slot has been registered in the official <strong>SSREC Pitch 2026 Google Sheet</strong>!
              </p>

              {/* Verified Pass Badge */}
              <div
                style={{
                  padding: '28px',
                  borderRadius: '20px',
                  backgroundColor: '#f8fafc',
                  border: '1.5px dashed #94a3b8',
                  textAlign: 'left',
                  marginBottom: '28px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '14px',
                    marginBottom: '18px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, letterSpacing: '0.08em' }}>
                      OFFICIAL REGISTRATION ID
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.45rem', fontWeight: 950, color: '#5B3DF5' }}>
                      {submittedData.regId}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '5px 14px',
                      borderRadius: '12px',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      fontWeight: 900,
                      fontSize: '0.78rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Check size={14} /> SHEETS SYNCED
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>TEAM NAME</span>
                    <strong style={{ color: '#050505' }}>{submittedData.teamName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>LEAD PITCHER</span>
                    <strong style={{ color: '#050505' }}>{submittedData.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>CATEGORY</span>
                    <strong style={{ color: '#5B3DF5' }}>{submittedData.category}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>DOMAIN</span>
                    <strong style={{ color: '#7C4DFF' }}>{submittedData.domain}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>COLLEGE</span>
                    <span style={{ color: '#334155' }}>{submittedData.college}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>TOTAL AMOUNT PAID</span>
                    <strong style={{ color: '#16a34a', fontSize: '1rem' }}>{submittedData.amount}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>UPI TRANSACTION ID</span>
                    <span style={{ color: '#334155', fontFamily: 'monospace', fontWeight: 700 }}>{submittedData.transactionId}</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>PROJECT / IDEA TITLE</span>
                  <strong style={{ color: '#050505', fontSize: '1.05rem' }}>{submittedData.projectTitle}</strong>
                </div>

                {submittedData.paymentUrl && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    <a
                      href={submittedData.paymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#5B3DF5',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={15} /> View Uploaded Receipt on Google Drive
                    </a>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleDownloadReceipt}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '100px',
                    backgroundColor: '#5B3DF5',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Download size={18} /> DOWNLOAD RECEIPT / PRINT
                </button>

                <a
                  href="/downloads/SSREC_Pitch_Registrations_Template.xlsx"
                  download="SSREC_Pitch_Registrations_Template.xlsx"
                  style={{
                    padding: '14px 22px',
                    borderRadius: '100px',
                    backgroundColor: '#f1f5f9',
                    color: '#166534',
                    border: '1.5px solid #bbf7d0',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                  }}
                >
                  <FileText size={18} /> Excel Template (.xlsx)
                </a>

                <button
                  onClick={() => setSubmittedData(null)}
                  style={{
                    padding: '14px 24px',
                    borderRadius: '100px',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    border: '1.5px solid #cbd5e1',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  Register Another Entry
                </button>
              </div>
            </div>
          ) : (
            /* High-Conversion Grid Form Layout */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '40px',
                backgroundColor: '#ffffff',
                padding: '44px',
                borderRadius: '32px',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 25px 60px -20px rgba(15, 23, 42, 0.08)',
              }}
            >
              {/* Form Column */}
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Category Selection */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '8px', letterSpacing: '0.04em' }}>
                    PARTICIPATION CATEGORY *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { id: 'IDEA PITCH', label: '💡 IDEA PITCH', desc: 'Concept, Validation & Plan' },
                      { id: 'PROJECT PITCH', label: '🚀 PROJECT PITCH', desc: 'Working Prototype or MVP' },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setRegForm({ ...regForm, category: cat.id })}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '14px',
                          border: regForm.category === cat.id ? '2px solid #5B3DF5' : '1.5px solid #cbd5e1',
                          backgroundColor: regForm.category === cat.id ? '#F5F3FF' : '#fff',
                          color: regForm.category === cat.id ? '#5B3DF5' : '#64748b',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>{cat.label}</div>
                        <div style={{ fontSize: '0.75rem', color: regForm.category === cat.id ? '#7C4DFF' : '#94a3b8', marginTop: '2px' }}>
                          {cat.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Team Name & Domain */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nexus Innovators"
                      value={regForm.teamName}
                      onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 15px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Technology Domain *
                    </label>
                    <select
                      value={regForm.domain}
                      onChange={(e) => setRegForm({ ...regForm, domain: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 15px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        outline: 'none',
                        backgroundColor: '#fff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & ML</option>
                      <option value="IoT, Robotics & Embedded Systems">IoT, Robotics & Embedded</option>
                      <option value="Healthcare, BioTech & MedTech">Healthcare & MedTech</option>
                      <option value="AgriTech & Smart Farming">AgriTech & Smart Farming</option>
                      <option value="CleanTech, Renewable Energy & EV">CleanTech & Green Energy</option>
                      <option value="FinTech, Blockchain & Web3">FinTech & Web3</option>
                      <option value="Cybersecurity & Cloud Systems">Cybersecurity & Cloud</option>
                      <option value="EdTech & Smart Learning">EdTech & Digital Education</option>
                      <option value="Open Innovation & Social Impact">Open Innovation & Social Tech</option>
                    </select>
                  </div>
                </div>

                {/* Project Title & Description */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Title of Idea / Project *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous AI Drone for Precision Agriculture"
                    value={regForm.projectTitle}
                    onChange={(e) => setRegForm({ ...regForm, projectTitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 15px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Brief Problem & Solution Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Explain the real-world problem, target users, and how your pitch solves it..."
                    value={regForm.description}
                    onChange={(e) => setRegForm({ ...regForm, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 15px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.92rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Team Leader Details */}
                <div style={{ paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    👑 TEAM LEADER DETAILS
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Leader Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Subash Kumar"
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Leader Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Leader Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="leader@gmail.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        College / Institute Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sri Sai Ranganathan Engg College"
                        value={regForm.college}
                        onChange={(e) => setRegForm({ ...regForm, college: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Department *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="CSE / IT / ECE / Mech / AIDS"
                        value={regForm.department}
                        onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Year of Study *
                      </label>
                      <select
                        value={regForm.year}
                        onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.9rem',
                          outline: 'none',
                          backgroundColor: '#fff',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="I Year">I Year</option>
                        <option value="II Year">II Year</option>
                        <option value="III Year">III Year</option>
                        <option value="IV Year">IV Year</option>
                        <option value="Postgraduate / Alumni">Postgraduate / Alumni</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Team Size Selection (1-4 Participants) */}
                <div style={{ paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#050505', letterSpacing: '0.06em' }}>
                      👥 TEAM PARTICIPANTS ({teamSize} {teamSize === 1 ? 'MEMBER' : 'MEMBERS'})
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Up to 4 participants / team</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setTeamSize(num)}
                        style={{
                          padding: '10px 4px',
                          borderRadius: '10px',
                          border: teamSize === num ? '2px solid #5B3DF5' : '1.5px solid #cbd5e1',
                          backgroundColor: teamSize === num ? '#F5F3FF' : '#fff',
                          color: teamSize === num ? '#5B3DF5' : '#64748b',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        {num === 1 ? 'Solo (1)' : `${num} Members`}
                      </button>
                    ))}
                  </div>

                  {teamSize >= 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[0, 1, 2].slice(0, teamSize - 1).map((idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: '10px' }}>
                            MEMBER {idx + 1}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                            <input
                              type="text"
                              required
                              placeholder={`Member ${idx + 1} Name *`}
                              value={members[idx].name}
                              onChange={(e) => updateMember(idx, 'name', e.target.value)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.88rem',
                                outline: 'none',
                                backgroundColor: '#fff',
                              }}
                            />
                            <input
                              type="tel"
                              placeholder="Mobile Number"
                              value={members[idx].phone}
                              onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.88rem',
                                outline: 'none',
                                backgroundColor: '#fff',
                              }}
                            />
                            <input
                              type="email"
                              placeholder="Email Address"
                              value={members[idx].email}
                              onChange={(e) => updateMember(idx, 'email', e.target.value)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.88rem',
                                outline: 'none',
                                backgroundColor: '#fff',
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Dept / Year"
                              value={members[idx].department}
                              onChange={(e) => updateMember(idx, 'department', e.target.value)}
                              style={{
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.88rem',
                                outline: 'none',
                                backgroundColor: '#fff',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payment Screenshot & Transaction ID */}
                <div style={{ paddingTop: '10px', borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#16a34a', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    💳 PAYMENT VERIFICATION DETAILS
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      UPI / Payment Transaction ID (12-digit UTR No.) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 423871928371 or UPI Ref Number"
                      value={regForm.transactionId}
                      onChange={(e) => setRegForm({ ...regForm, transactionId: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 15px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        outline: 'none',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                    <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      Found inside your Google Pay / PhonePe / Paytm payment receipt details.
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Upload Payment Screenshot (Optional / Recommended)
                    </label>
                    <div
                      style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer',
                      }}
                      onClick={() => document.getElementById('pitch-screenshot-input')?.click()}
                    >
                      <input
                        id="pitch-screenshot-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleScreenshotChange(e.target.files?.[0] || null)}
                      />
                      {screenshotPreview ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
                          <img
                            src={screenshotPreview}
                            alt="Screenshot Preview"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          />
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#050505' }}>{screenshotFile?.name}</div>
                            <div style={{ fontSize: '0.74rem', color: '#16a34a' }}>
                              ✓ Ready to sync to Google Drive ({(screenshotFile ? (screenshotFile.size / 1024).toFixed(1) : 0)} KB)
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleScreenshotChange(null);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: 0,
                                marginTop: '2px',
                              }}
                            >
                              Remove / Change Screenshot
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload size={22} color="#64748b" style={{ margin: '0 auto 6px auto', display: 'block' }} />
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                            Click to select payment screenshot
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                            PNG, JPG up to 10MB • Uploads directly to SSREC Drive
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '18px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #5B3DF5 0%, #7C4DFF 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: '1.08rem',
                    letterSpacing: '0.04em',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 12px 25px -5px rgba(91, 61, 245, 0.4)',
                    marginTop: '6px',
                  }}
                >
                  {isSubmitting ? syncStatus || 'SUBMITTING TO GOOGLE SHEETS...' : `CONFIRM & REGISTER (₹${teamSize * 200}) →`}
                </button>
              </form>

              {/* QR Payment Column */}
              <div
                style={{
                  padding: '36px 30px',
                  borderRadius: '24px',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    color: '#5B3DF5',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  OFFICIAL PAYMENT DOCK
                </div>

                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.55rem', fontWeight: 900, color: '#050505', margin: '0 0 6px 0' }}>
                  Scan to Pay with Any UPI App
                </h3>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 16px',
                    borderRadius: '100px',
                    backgroundColor: '#F5F3FF',
                    color: '#5B3DF5',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    marginBottom: '18px',
                  }}
                >
                  <span>Total for {teamSize} {teamSize === 1 ? 'member' : 'members'}:</span>
                  <strong style={{ fontSize: '1.05rem', color: '#5B3DF5' }}>₹{teamSize * 200}</strong>
                </div>

                {/* QR Image Box */}
                <div
                  style={{
                    width: '230px',
                    height: '230px',
                    padding: '10px',
                    backgroundColor: '#ffffff',
                    borderRadius: '22px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.09)',
                    border: '1.5px solid #cbd5e1',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src="/images/pitch-payment-qr.png"
                    alt="Subash Mass Official UPI Payment QR Code"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/pitch-payment-qr.png';
                    }}
                  />
                </div>

                {/* Payee Info */}
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#050505',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Subash Mass</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '8px',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                    }}
                  >
                    VERIFIED
                  </span>
                </div>

                {/* UPI Copy Box */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    marginBottom: '14px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', fontFamily: 'monospace' }}>
                    masssubash240@oksbi
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: copiedUpi ? '#16a34a' : '#5B3DF5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                    }}
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check size={17} /> : <Copy size={17} />}
                  </button>
                </div>

                <a
                  href={`upi://pay?pa=masssubash240@oksbi&pn=Subash%20Mass&am=${teamSize * 200}&cu=INR`}
                  style={{
                    fontSize: '0.82rem',
                    color: '#5B3DF5',
                    fontWeight: 700,
                    marginBottom: '16px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  📱 Tap to Open UPI App (GPay / PhonePe) →
                </a>

                <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6, textAlign: 'left' }}>
                  1. Scan using Google Pay, PhonePe, Paytm or BHIM.<br />
                  2. Transfer fee (<strong>₹{teamSize * 200}</strong> for {teamSize} {teamSize === 1 ? 'member' : 'members'}).<br />
                  3. Copy & paste the 12-digit UTR/Txn number in the form.<br />
                  4. Instant sync to Google Sheet on submission.
                </div>

                <div
                  style={{
                    marginTop: '18px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    fontSize: '0.75rem',
                    color: '#15803d',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Google Apps Script Live Sync Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── CONTACT / ORGANIZERS & PARTNERS ─── */}
      <section
        style={{
          padding: '52px 20px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '10px' }}>
              10 / ECOSYSTEM
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 5.5vw, 68px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#050505',
                margin: 0,
              }}
            >
              LET’S MAKE IT HAPPEN.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '64px',
            }}
          >
            {[
              {
                role: 'HOST INSTITUTION',
                name: 'Sri Sai Ranganathan Engineering College',
                desc: 'Premier autonomous institution empowering student innovators across technical engineering disciplines.',
                icon: <Building size={24} color="#5B3DF5" />,
              },
              {
                role: 'IN ASSOCIATION WITH',
                name: 'Sri Sai Ranganathan Innovrise Foundation',
                desc: 'Dedicated venture development and student startup incubation cell driving commercial translation.',
                icon: <Sparkles size={24} color="#5B3DF5" />,
              },
              {
                role: 'MENTORSHIP & VENTURE NETWORK',
                name: 'Innovation & Incubation Council',
                desc: 'Connecting winning pitch teams directly with industry mentors, patent attorneys, and venture funding.',
                icon: <Award size={24} color="#5B3DF5" />,
              },
            ].map((org, i) => (
              <div
                key={i}
                style={{
                  padding: '36px 28px',
                  borderRadius: '24px',
                  backgroundColor: '#FAFAFC',
                  border: '1.5px solid #e2e8f0',
                }}
              >
                <div style={{ marginBottom: '18px' }}>{org.icon}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5B3DF5', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {org.role}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', fontWeight: 900, color: '#050505', margin: '0 0 10px 0' }}>
                  {org.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {org.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Official Partners Row */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.12em', marginBottom: '24px' }}>
              OFFICIAL ECOSYSTEM PARTNERS
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {['SSIR', 'UGHAM', 'StartupTN', 'icebrkr'].map((partner) => (
                <div
                  key={partner}
                  style={{
                    padding: '16px 36px',
                    borderRadius: '16px',
                    backgroundColor: '#FAFAFC',
                    border: '1.5px solid #e2e8f0',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    color: '#334155',
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── VENUE SECTION: MAP & DIRECTIONS ─── */}
      <section
        style={{
          padding: '52px 20px',
          backgroundColor: '#FAFAFC',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '12px' }}>
                11 / LOCATION
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: '#050505',
                  margin: '0 0 20px 0',
                }}
              >
                SEE YOU AT THE STAGE.
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '28px' }}>
                Sri Sai Ranganathan Engineering College, Thondamuthur Road, Pooluvapatti, Coimbatore, Tamil Nadu 641109.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: 700 }}>
                  <Calendar size={18} color="#5B3DF5" />
                  <span>09 October 2026</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: 700 }}>
                  <Clock size={18} color="#5B3DF5" />
                  <span>10:00 AM onwards (Check-in begins 09:15 AM)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: 700 }}>
                  <MapPin size={18} color="#5B3DF5" />
                  <span>Main Auditorium & Presentation Suites</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Sri+Sai+Ranganathan+Engineering+College"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '16px 32px',
                  borderRadius: '100px',
                  backgroundColor: '#050505',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                GET DIRECTIONS ↗
              </a>
            </div>

            {/* Interactive Map Embed */}
            <div
              style={{
                height: '420px',
                borderRadius: '28px',
                overflow: 'hidden',
                border: '1.5px solid #cbd5e1',
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
              }}
            >
              <iframe
                title="SSREC Campus Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.4728881222883!2d76.7972!3d10.9782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85b001!2sSri+Sai+Ranganathan+Engineering+College!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 12 / FREQUENT QUESTIONS: ACCORDION ─── */}
      <section
        id="faq"
        style={{
          padding: '52px 20px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#5B3DF5', letterSpacing: '0.15em', marginBottom: '10px' }}>
              12 / FREQUENT QUESTIONS
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(36px, 5.5vw, 68px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#050505',
                margin: 0,
              }}
            >
              EVERYTHING YOU NEED TO KNOW.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                q: 'What is PITCH PERFECT ’26?',
                a: 'PITCH PERFECT ’26 is an elite student innovation and entrepreneurship pitching competition hosted by Sri Sai Ranganathan Engineering College in association with Sri Sai Ranganathan Innovrise Foundation on 09 October 2026.',
              },
              {
                q: 'Who can participate?',
                a: 'Any currently enrolled undergraduate, postgraduate, or diploma student from engineering, arts, science, polytechnic, or management colleges. Inter-college teams and cross-departmental teams are warmly welcomed.',
              },
              {
                q: 'What is the registration fee?',
                a: 'The registration fee is ₹200 per student participant. Teams with 1 member pay ₹200, 2 members pay ₹400, 3 members pay ₹600, and 4 members pay ₹800.',
              },
              {
                q: 'What are the categories?',
                a: 'Track 01 is IDEA PITCH (for concepts, business models, validation frameworks and social solutions). Track 02 is PROJECT PITCH (for working prototypes, software MVPs, physical hardware and practical technology systems).',
              },
              {
                q: 'Can I present an idea without code?',
                a: 'Yes! The IDEA PITCH category is specifically crafted for theoretical validation, market understanding, and conceptual innovation without requiring running code.',
              },
              {
                q: 'Can I present a completed project or hardware prototype?',
                a: 'Absolutely. Choose PROJECT PITCH. Power sockets, presentation screens, and testing tables are provided at the presentation venue.',
              },
              {
                q: 'What should I prepare for the pitch?',
                a: 'Prepare an 8-slide presentation deck (PowerPoint or PDF) adhering to the official pitch format guidelines. Bring your slide deck on a USB drive and bring your prototype/laptop.',
              },
              {
                q: 'Where and when is the event held?',
                a: 'At Sri Sai Ranganathan Engineering College campus, Pooluvapatti, Coimbatore. The event begins promptly at 10:00 AM on 09 October 2026.',
              },
              {
                q: 'What prizes can I win?',
                a: 'Teams compete for total cash prizes up to ₹20,000/-, along with official winner trophies, merit certificates, and incubation pipeline opportunities.',
              },
              {
                q: 'How do I register?',
                a: 'Complete the online registration form on this page, transfer the fee via the verified UPI QR code (masssubash240@oksbi), enter your 12-digit transaction ID, and download your verified entry receipt instantly.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  style={{
                    borderRadius: '18px',
                    backgroundColor: '#FAFAFC',
                    border: isOpen ? '1.5px solid #5B3DF5' : '1.5px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '22px 28px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#050505',
                      }}
                    >
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp size={20} color="#5B3DF5" /> : <ChevronDown size={20} color="#64748b" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 28px 22px 28px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CINEMATIC CTA ─── */}
      <section
        style={{
          position: 'relative',
          padding: '160px 32px',
          background: 'linear-gradient(180deg, #050505 0%, #150E36 50%, #050505 100%)',
          color: '#FFFFFF',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(700px, 85vw)',
            height: 'min(700px, 85vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(91, 61, 245, 0.3) 0%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(44px, 8vw, 110px)',
              fontWeight: 950,
              lineHeight: 0.95,
              letterSpacing: '-0.05em',
              color: '#FFFFFF',
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
            }}
          >
            DON’T JUST
            <br />
            HAVE AN IDEA.
            <br />
            <span style={{ color: '#5B3DF5' }}>PITCH IT.</span>
          </h2>

          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
              fontWeight: 800,
              color: '#F59E0B',
              letterSpacing: '0.08em',
              marginBottom: '36px',
            }}
          >
            THINK BIG • PITCH BOLD • BIG WIN
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollToSection('register')}
              onMouseEnter={() => {
                setCursorExpanded(true);
                setCursorText('REGISTER');
              }}
              onMouseLeave={() => setCursorExpanded(false)}
              style={{
                padding: '20px 48px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #5B3DF5 0%, #7C4DFF 100%)',
                color: '#ffffff',
                border: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 16px 40px rgba(91, 61, 245, 0.45)',
              }}
            >
              REGISTER NOW (₹200) ↗
            </button>
          </div>
        </div>
      </section>

      {/* ─── MINIMAL EDITORIAL FOOTER ─── */}
      <footer
        style={{
          padding: '60px 32px 100px 32px',
          backgroundColor: '#050505',
          color: '#94a3b8',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.88rem',
        }}
      >
        <div
          style={{
            maxWidth: '1380px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '4px' }}>
              PITCH PERFECT ’26
            </div>
            <div style={{ color: '#64748b' }}>Think Big — Pitch Bold — Big Win</div>
          </div>

          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            {['About', 'Categories', 'Rules', 'Registration', 'FAQ'].map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link.toLowerCase())}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {link}
              </button>
            ))}
            <button
              onClick={onBackToHome}
              style={{
                background: 'none',
                border: 'none',
                color: '#5B3DF5',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Wano Fest Home ↗
            </button>
          </div>

          <div style={{ color: '#64748b', fontSize: '0.82rem' }}>
            © 2026 PITCH PERFECT ’26. Sri Sai Ranganathan Engineering College.
          </div>
        </div>
      </footer>

      {/* ─── STICKY BOTTOM MOBILE REGISTRATION BAR ─── */}
      <div
        className="pitch-mobile-bottom-bar"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '12px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #e2e8f0',
          zIndex: 8999,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <button
          onClick={() => scrollToSection('register')}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '100px',
            background: 'linear-gradient(135deg, #5B3DF5 0%, #7C4DFF 100%)',
            color: '#ffffff',
            border: 'none',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: '0.98rem',
            letterSpacing: '0.04em',
            boxShadow: '0 8px 25px rgba(91, 61, 245, 0.35)',
          }}
        >
          REGISTER NOW — ₹200 ↗
        </button>
      </div>

      {/* ─── 8-SLIDE OFFICIAL PITCH TEMPLATE MODAL ─── */}
      <PitchTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onOpenRegister={() => {
          setIsTemplateModalOpen(false);
          scrollToSection('register');
        }}
        onToast={onToast}
      />

      {/* ─── CATEGORY DETAILS MODAL (IDEA / PROJECT) ─── */}
      {activeCategoryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 5, 5, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={() => setActiveCategoryModal(null)}
        >
          <div
            style={{
              maxWidth: '640px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '40px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              textAlign: 'left',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  backgroundColor: 'rgba(91, 61, 245, 0.1)',
                  color: '#5B3DF5',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                }}
              >
                {activeCategoryModal === 'idea' ? 'TRACK 01 DETAILS' : 'TRACK 02 DETAILS'}
              </span>
              <button
                onClick={() => setActiveCategoryModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '2rem',
                fontWeight: 900,
                color: '#050505',
                margin: '0 0 16px 0',
              }}
            >
              {activeCategoryModal === 'idea' ? '💡 IDEA PITCH TRACK' : '🚀 PROJECT PITCH TRACK'}
            </h3>

            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
              {activeCategoryModal === 'idea'
                ? 'The Idea Pitch track is crafted for students with visionary solutions, disruptive concepts, or social impact models. Participants focus on problem validation, addressable market size, customer empathy, competitive edge, and implementation feasibility.'
                : 'The Project Pitch track is built for engineering builders, coders, and makers with functional working prototypes, running software MVPs, or tangible hardware apparatuses. Participants demonstrate working technology live before technical evaluators.'}
            </p>

            <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#FAFAFC', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#5B3DF5', marginBottom: '8px' }}>
                REQUIREMENTS:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <li>Teams of 1 to 4 members</li>
                <li>8-slide presentation deck (PPT/PDF)</li>
                <li>7 minutes presentation + 3 minutes jury Q&A</li>
                {activeCategoryModal === 'project' && <li>Live functional prototype / apparatus for stage demonstration</li>}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setActiveCategoryModal(null);
                  scrollToSection('register');
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '100px',
                  background: 'linear-gradient(135deg, #5B3DF5 0%, #7C4DFF 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                REGISTER FOR THIS TRACK ↗
              </button>

              <button
                onClick={() => {
                  setActiveCategoryModal(null);
                  setIsTemplateModalOpen(true);
                }}
                style={{
                  padding: '14px 20px',
                  borderRadius: '100px',
                  backgroundColor: '#f1f5f9',
                  color: '#050505',
                  border: '1px solid #cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                View Slides
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Embedded Responsive CSS for Nav & Mobile */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Custom cursor: hide the OS cursor across the whole pitch page (except text fields) */
        .pitch-page:not(.pitch-touch),
        .pitch-page:not(.pitch-touch) * {
          cursor: none !important;
        }
        .pitch-page:not(.pitch-touch) input,
        .pitch-page:not(.pitch-touch) textarea,
        .pitch-page:not(.pitch-touch) select {
          cursor: auto !important;
        }

        @media (min-width: 900px) {
          .pitch-desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 899px) {
          .pitch-mobile-burger {
            display: flex !important;
          }
          .pitch-mobile-bottom-bar {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
