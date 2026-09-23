import { useState, useEffect, useRef } from 'react';
import './index.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GlobalAmbientAudio } from './components/GlobalAmbientAudio';
import { WorldOfWanoFest } from './components/WorldOfWanoFest';
import { DualPortals } from './components/DualPortals';
import { TreasureStats } from './components/TreasureStats';
import { FeaturedEvents } from './components/FeaturedEvents';
import { CodingChallengeSection } from './components/CodingChallengeSection';
import { StickyStorySection } from './components/StickyStorySection';
import { Schedule } from './components/Schedule';
import { WantedPassModal } from './components/WantedPassModal';
import { EventRegistrationModal } from './components/EventRegistrationModal';
import { FAQ } from './components/FAQ';
import { CrewContactSection } from './components/CrewContactSection';
import { Footer } from './components/Footer';
import { EventDetailPage } from './components/EventDetailPage';
import { CustomCursor } from './components/CustomCursor';
import { AtmosphereParticles } from './components/AtmosphereParticles';
import { FloatingUI } from './components/FloatingUI';
import { SideMovingBackground } from './components/SideMovingBackground';
import { EventDetailTransition } from './components/EventDetailTransition';
import { TreasureMapNavigator } from './components/TreasureMapNavigator';
import { FinalLegendCTA } from './components/FinalLegendCTA';
import { OpeningLoader } from './components/OpeningLoader';
import { FEATURED_EVENTS } from './data/eventData';
import { ContactPage } from './components/ContactPage';
import { PitchPerfectPage } from './components/PitchPerfectPage';
import { PitchTemplateModal } from './components/PitchTemplateModal';
import { SITE_CONFIG } from './data/siteConfig';
import { MessageCircle } from 'lucide-react';


function App() {
  const [currentView, setCurrentView] = useState<'home' | 'event-detail' | 'contact' | 'pitch-perfect'>('home');
  const [selectedEventId, setSelectedEventId] = useState<string>('will-of-d');
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [eventFilter, setEventFilter] = useState<'all' | 'tech' | 'non-tech'>('all');
  const [wantedModalOpen, setWantedModalOpen] = useState(false);
  const [pitchTemplateOpen, setPitchTemplateOpen] = useState(false);
  const [selectedTierId] = useState('supernova');
  const [openingVisible, setOpeningVisible] = useState(true);

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const [registrationModalInitialMode, setRegistrationModalInitialMode] = useState<'register' | 'auth'>('register');

  const openAuth = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setRegistrationModalInitialMode('auth');
    setRegistrationModalOpen(true);
  };

  // Global Toast for Copy feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToastMessage(msg);
    toastTimer.current = window.setTimeout(() => setToastMessage(null), 3200);
  };

  // SSREC Official Registration Modal State (Excel/Google Sheets Sync)
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [registrationEventName, setRegistrationEventName] = useState<string>('');
  const [registrationEventType, setRegistrationEventType] = useState<'technical' | 'non-technical' | ''>('technical');

  const handleOpenRegistration = (eventName?: string, eventType?: 'technical' | 'non-technical' | '', mode: 'register' | 'auth' = 'register') => {
    if (eventName) setRegistrationEventName(eventName);
    if (eventType) setRegistrationEventType(eventType);
    setRegistrationModalInitialMode(mode);
    setRegistrationModalOpen(true);
  };

  // FLIP expansion transition state
  const [transitionState, setTransitionState] = useState<{
    active: boolean;
    rect?: DOMRect | null;
    eventId: string;
    image: string;
    title: string;
    category?: string;
  } | null>(null);

  // Handle URL hash changes (e.g. #event/will-of-d, #contact)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#event/')) {
        const id = hash.replace('#event/', '').trim();
        setSelectedEventId(id || 'will-of-d');
        setCurrentView('event-detail');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === '#event') {
        setSelectedEventId('will-of-d');
        setCurrentView('event-detail');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === '#contact') {
        setCurrentView('contact');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === '#pitch-perfect' || hash === '#pitch' || hash === '#pitch-events') {
        setCurrentView('pitch-perfect');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash === '#template') {
        setPitchTemplateOpen(true);
      } else if (hash === '#home') {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#') && !hash.startsWith('#event') && hash !== '#contact' && hash !== '#pitch-perfect') {
        setCurrentView('home');
        const targetId = hash.replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      } else if (currentView === 'event-detail' && !hash.startsWith('#event')) {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleOpenEventDetail = (eventId: string, rect?: DOMRect, initialTab: string = 'overview') => {
    const event = FEATURED_EVENTS.find((e) => e.id === eventId) || FEATURED_EVENTS[0];
    setSelectedTab(initialTab);

    if (rect) {
      setTransitionState({
        active: true,
        rect,
        eventId,
        image: event.image,
        title: event.title,
        category: event.category.toUpperCase(),
      });
    } else {
      setSelectedEventId(eventId);
      setCurrentView('event-detail');
      window.location.hash = `event/${eventId}`;
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleTransitionComplete = () => {
    if (transitionState) {
      setSelectedEventId(transitionState.eventId);
      setCurrentView('event-detail');
      window.location.hash = `event/${transitionState.eventId}`;
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTransitionState(null);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.location.hash = 'events';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateContact = () => {
    setCurrentView('contact');
    window.location.hash = 'contact';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigatePitch = () => {
    setCurrentView('pitch-perfect');
    window.location.hash = 'pitch-perfect';
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectCategory = (cat: 'tech' | 'non-tech' | string) => {
    if (cat === 'tech' || cat === 'non-tech') {
      setEventFilter(cat);
    } else {
      setEventFilter('all');
    }
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Floating WhatsApp Pulse Button (Subash +91 63838 53695)
  const renderFloatingWhatsApp = () => (
    <a
      href="https://wa.me/916383853695?text=Hi%20Subash,%20I%20have%20an%20inquiry%20regarding%20CybiTradic%20Wano%20Fest%202026"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Subash on WhatsApp (+91 63838 53695)"
      className="floating-whatsapp-btn"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 18px 8px 12px',
        borderRadius: '35px',
        backgroundColor: '#25d366',
        color: '#ffffff',
        textDecoration: 'none',
        boxShadow: '0 8px 30px rgba(37, 211, 102, 0.6), 0 0 20px rgba(37, 211, 102, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        fontFamily: 'var(--font-body, system-ui, sans-serif)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 211, 102, 0.85), 0 0 30px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 211, 102, 0.6), 0 0 20px rgba(37, 211, 102, 0.4)';
      }}
      title="Chat with Subash on WhatsApp (+91 63838 53695)"
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MessageCircle size={28} />
        <span className="whatsapp-pulse-ring" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.15 }}>
        <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em' }}>
          Subash
        </span>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>
          +91 63838 53695
        </span>
      </div>
    </a>
  );

  // Global Toast Alert
  const renderGlobalToast = () =>
    toastMessage ? (
      <div
        role="status"
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 28px',
          borderRadius: '16px',
          background: 'rgba(8, 14, 26, 0.96)',
          border: '1.5px solid #d4af37',
          boxShadow: '0 15px 45px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.3)',
          backdropFilter: 'blur(12px)',
          animation: 'fadeIn 0.25s ease',
          color: '#ffffff',
          fontSize: '0.88rem',
          fontWeight: 700,
          maxWidth: 'calc(100vw - 40px)',
        }}
      >
        <span style={{ fontSize: '1.3rem' }}>ðŸ“œ</span>
        <div>{toastMessage}</div>
      </div>
    ) : null;

  if (openingVisible) {
    return (
      <AuthProvider>
          <GlobalAmbientAudio />
          <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }} />
          <OpeningLoader onComplete={() => setOpeningVisible(false)} />
        </AuthProvider>
      
    );
  }

  // If in Event Detail View
  if (currentView === 'event-detail') {
    return (
      <AuthProvider>
          <div style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
            <GlobalAmbientAudio />
            <CustomCursor />
            <AtmosphereParticles />

            <EventDetailPage
              key={selectedEventId}
              eventId={selectedEventId}
              initialTab={selectedTab}
              onBackToHome={handleBackToHome}
              onSelectEvent={(newId: string) => {
                setSelectedEventId(newId);
                window.location.hash = `event/${newId}`;
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onOpenRegister={(eventName, eventType) => handleOpenRegistration(eventName, eventType)}
            />
            <EventRegistrationModal
              isOpen={registrationModalOpen}
              onClose={() => setRegistrationModalOpen(false)}
              preselectedEventName={registrationEventName}
              preselectedEventType={registrationEventType}
              initialMode={registrationModalInitialMode}
            />
            <WantedPassModal
              isOpen={wantedModalOpen}
              selectedTierId={selectedTierId}
              onClose={() => setWantedModalOpen(false)}
            />
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialTab={authModalTab} />

            {renderFloatingWhatsApp()}
            {renderGlobalToast()}
          </div>
        </AuthProvider>
      
    );
  }

  // If in Dedicated Contact Page View
  if (currentView === 'contact') {
    return (
      <AuthProvider>
          <div style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
            <GlobalAmbientAudio />
            <CustomCursor />
            <AtmosphereParticles />
            <FloatingUI />

            <Navbar
              onOpenRegister={() => handleOpenRegistration()}
              onNavigateHome={handleBackToHome}
              onNavigateContact={handleNavigateContact}
              onNavigatePitch={handleNavigatePitch}
              onOpenTemplate={() => setPitchTemplateOpen(true)}
              currentView="contact"
              onOpenAuth={openAuth}
            />

            <ContactPage onBackToHome={handleBackToHome} onToast={showToast} />

            <Footer />

            <EventRegistrationModal
              isOpen={registrationModalOpen}
              onClose={() => setRegistrationModalOpen(false)}
              preselectedEventName={registrationEventName}
              preselectedEventType={registrationEventType}
              initialMode={registrationModalInitialMode}
            />
            <WantedPassModal
              isOpen={wantedModalOpen}
              selectedTierId={selectedTierId}
              onClose={() => setWantedModalOpen(false)}
            />
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialTab={authModalTab} />

            {renderFloatingWhatsApp()}
            {renderGlobalToast()}
          </div>
        </AuthProvider>
      
    );
  }

  // If in Pitch Perfect 26 View
  if (currentView === 'pitch-perfect') {
    return (
      <AuthProvider>
        <PitchPerfectPage onBackToHome={handleBackToHome} onToast={showToast} />

        {renderFloatingWhatsApp()}
        {renderGlobalToast()}
      </AuthProvider>
    );
  }

  // Standard Home Deck View
  return (
    <AuthProvider>
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
          <GlobalAmbientAudio />
          <CustomCursor />
          <AtmosphereParticles />
          <FloatingUI />
          <SideMovingBackground />

          <Navbar
            onOpenRegister={() => handleOpenRegistration()}
            onNavigateHome={handleBackToHome}
            onNavigateContact={handleNavigateContact}
            onNavigatePitch={handleNavigatePitch}
            onOpenTemplate={() => setPitchTemplateOpen(true)}
            currentView="home"
            onOpenAuth={openAuth}
          />

      {/* ─── 6-LAYER PARALLAX CINEMATIC HERO ─── */}
      <Hero
        onRegisterClick={() => handleOpenRegistration()}
        onNavigatePitch={handleNavigatePitch}
        onSelectCategory={(cat) => handleSelectCategory(cat)}
      />

      {/* â”€â”€â”€ HORIZONTAL SCROLL STORY: THE WORLD OF WANO FEST â”€â”€â”€ */}
      <WorldOfWanoFest
        onSelectCategory={handleSelectCategory}
        onOpenEventDetail={handleOpenEventDetail}
      />

      {/* â”€â”€â”€ DUAL PORTALS: TECH / NON-TECH â”€â”€â”€ */}
      <DualPortals onSelectCategory={handleSelectCategory} />

      {/* â”€â”€â”€ TREASURE STATS BANNER â”€â”€â”€ */}
      <TreasureStats />

      {/* â”€â”€â”€ FEATURED 3D EVENTS POSTER GRID (Section 13) + FIND OUR HARBOR â”€â”€â”€ */}
      <FeaturedEvents
        filterCategory={eventFilter}
        onFilterChange={setEventFilter}
        onOpenEventDetail={handleOpenEventDetail}
        onRegisterClick={(eventTitle) => handleOpenRegistration(eventTitle)}
      />

      {/* â”€â”€â”€ CODING CHALLENGE â€” PIRATES OF LOGIC POSTER SECTION â”€â”€â”€ */}
      <CodingChallengeSection
        onRegister={() => handleOpenRegistration('Coding Challenge', 'technical')}
        onOpenDetail={() => handleOpenEventDetail('coding-challenge')}
      />

      {/* â”€â”€â”€ GRAND LINE TREASURE MAP NAVIGATOR (Section 15) â”€â”€â”€ */}
      <TreasureMapNavigator
        onOpenEventDetail={handleOpenEventDetail}
      />

      {/* â”€â”€â”€ STICKY NARRATIVE STORY: CHRONICLES OF WANO â”€â”€â”€ */}
      <StickyStorySection />

      {/* â”€â”€â”€ GRAND LINE SCHEDULE â”€â”€â”€ */}
      <Schedule />

      {/* â”€â”€â”€ FAQ â”€â”€â”€ */}
      <FAQ />

      {/* â”€â”€â”€ THE CREW / CONTACT HEADQUARTERS â”€â”€â”€ */}
      <CrewContactSection />

      {/* â”€â”€â”€ CHOOSE YOUR EVENT. CREATE YOUR LEGEND. (Section 21) â”€â”€â”€ */}
      <FinalLegendCTA
        onExploreEvents={() => {
          document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onRegister={() => handleOpenRegistration()}
      />

      {/* â”€â”€â”€ ANIME FINALE CINEMATIC FOOTER â”€â”€â”€ */}
      <Footer />

      {/* â”€â”€â”€ SSREC OFFICIAL TEAM REGISTRATION MODAL (Global) â”€â”€â”€ */}
      <EventRegistrationModal
        isOpen={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        preselectedEventName={registrationEventName}
        preselectedEventType={registrationEventType}
        initialMode={registrationModalInitialMode}
      />

      {/* â”€â”€â”€ WANTED PASS MODAL (Global) â”€â”€â”€ */}
      <WantedPassModal
        isOpen={wantedModalOpen}
        selectedTierId={selectedTierId}
        onClose={() => setWantedModalOpen(false)}
      />

      {/* ─── PITCH PERFECT '26 OFFICIAL 8-SLIDE TEMPLATE MODAL (Global) ─── */}
      <PitchTemplateModal
        isOpen={pitchTemplateOpen}
        onClose={() => setPitchTemplateOpen(false)}
        onOpenRegister={() => handleOpenRegistration("PITCH PERFECT '26", 'technical')}
        onToast={showToast}
      />

          {/* â”€â”€â”€ CARD-TO-FULLSCREEN FLIP EXPANSION TRANSITION â”€â”€â”€ */}
          {transitionState && (
            <EventDetailTransition
              initialRect={transitionState.rect}
              eventImage={transitionState.image}
              eventTitle={transitionState.title}
              eventCategory={transitionState.category}
              onComplete={handleTransitionComplete}
            />
          )}

          {/* â”€â”€â”€ AUTH MODAL (Global) â”€â”€â”€ */}
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialTab={authModalTab} />

          {/* ─── FLOATING WHATSAPP BUTTON ─── */}
          {renderFloatingWhatsApp()}

          {/* ─── GLOBAL TOAST ─── */}
          {renderGlobalToast()}
        </div>
      </AuthProvider>
    
  );
}

export default App;


