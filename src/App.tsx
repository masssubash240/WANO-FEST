import { useState, useEffect } from 'react';
import './index.css';
import './App.css';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GlobalAmbientAudio } from './components/GlobalAmbientAudio';
import { WorldOfWanoFest } from './components/WorldOfWanoFest';
import { DualPortals } from './components/DualPortals';
import { TreasureStats } from './components/TreasureStats';
import { FeaturedEvents } from './components/FeaturedEvents';
import { StickyStorySection } from './components/StickyStorySection';
import { Schedule } from './components/Schedule';
import { WantedPassModal } from './components/WantedPassModal';
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

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'event-detail'>('home');
  const [selectedEventId, setSelectedEventId] = useState<string>('will-of-d');
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [eventFilter, setEventFilter] = useState<'all' | 'tech' | 'non-tech'>('all');
  const [wantedModalOpen, setWantedModalOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('supernova');
  const [openingVisible, setOpeningVisible] = useState(true);

  // FLIP expansion transition state
  const [transitionState, setTransitionState] = useState<{
    active: boolean;
    rect?: DOMRect | null;
    eventId: string;
    image: string;
    title: string;
    category?: string;
  } | null>(null);

  // Handle URL hash changes (e.g. #event/will-of-d)
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
      // Trigger cinematic card-to-fullscreen expansion
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
  };

  const handleSelectCategory = (cat: 'tech' | 'non-tech' | string) => {
    if (cat === 'tech' || cat === 'non-tech') {
      setEventFilter(cat);
    } else {
      setEventFilter('all');
    }
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTicketSelect = (tierId: string) => {
    setSelectedTierId(tierId);
    setWantedModalOpen(true);
  };

  if (openingVisible) {
    return (
      <>
        <GlobalAmbientAudio />
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }} />
        <OpeningLoader onComplete={() => setOpeningVisible(false)} />
      </>
    );
  }

  // If in Event Detail View, display the Godmode Individual Event Page
  if (currentView === 'event-detail') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
        <GlobalAmbientAudio />
        {/* Desktop Custom Cursor */}
        <CustomCursor />

        {/* Ambient Atmosphere Particles */}
        <AtmosphereParticles />

        <EventDetailPage
          key={selectedEventId}
          eventId={selectedEventId}
          initialTab={selectedTab}
          onBackToHome={handleBackToHome}
          onSelectEvent={(newId) => {
            setSelectedEventId(newId);
            window.location.hash = `event/${newId}`;
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
        {/* WANTED PASS MODAL */}
        <WantedPassModal
          isOpen={wantedModalOpen}
          selectedTierId={selectedTierId}
          onClose={() => setWantedModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
      <GlobalAmbientAudio />
      {/* ─── DESKTOP CUSTOM CURSOR ─── */}
      <CustomCursor />

      {/* ─── AMBIENT ATMOSPHERE CANVAS PARTICLES ─── */}
      <AtmosphereParticles />

      {/* ─── MINIMAL FLOATING EDGE UI ─── */}
      <FloatingUI />

      {/* ─── SIDE-MOVING BACKGROUND HORIZONTAL DRIFT ─── */}
      <SideMovingBackground />

      {/* ─── STICKY TRANSPARENT GLASS NAVBAR ─── */}
      <Navbar
        onOpenRegister={() => {
          setSelectedTierId('supernova');
          setWantedModalOpen(true);
        }}
      />

      {/* ─── 6-LAYER PARALLAX CINEMATIC HERO ─── */}
      <Hero
        onRegisterClick={() => {
          setSelectedTierId('supernova');
          setWantedModalOpen(true);
        }}
        onSelectCategory={(cat) => handleSelectCategory(cat)}
      />

      {/* ─── HORIZONTAL SCROLL STORY: THE WORLD OF WANO FEST ─── */}
      <WorldOfWanoFest
        onSelectCategory={handleSelectCategory}
        onOpenEventDetail={handleOpenEventDetail}
      />

      {/* ─── DUAL PORTALS: TECH / NON-TECH ─── */}
      <DualPortals onSelectCategory={handleSelectCategory} />

      {/* ─── TREASURE STATS BANNER ─── */}
      <TreasureStats />

      {/* ─── FEATURED 3D EVENTS POSTER GRID (Section 13) ─── */}
      <FeaturedEvents
        filterCategory={eventFilter}
        onFilterChange={setEventFilter}
        onOpenEventDetail={handleOpenEventDetail}
        onRegisterClick={() => handleTicketSelect('supernova')}
      />

      {/* ─── GRAND LINE TREASURE MAP NAVIGATOR (Section 15) ─── */}
      <TreasureMapNavigator
        onOpenEventDetail={handleOpenEventDetail}
      />

      {/* ─── STICKY NARRATIVE STORY: CHRONICLES OF WANO ─── */}
      <StickyStorySection />

      {/* ─── GRAND LINE SCHEDULE ─── */}
      <Schedule />

      {/* ─── FAQ ─── */}
      <FAQ />

      {/* ─── THE CREW / CONTACT HEADQUARTERS ─── */}
      <CrewContactSection />

      {/* ─── CHOOSE YOUR EVENT. CREATE YOUR LEGEND. (Section 21) ─── */}
      <FinalLegendCTA
        onExploreEvents={() => {
          document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onRegister={() => handleTicketSelect('supernova')}
      />

      {/* ─── ANIME FINALE CINEMATIC FOOTER ─── */}
      <Footer />

      {/* ─── WANTED PASS MODAL (Global) ─── */}
      <WantedPassModal
        isOpen={wantedModalOpen}
        selectedTierId={selectedTierId}
        onClose={() => setWantedModalOpen(false)}
      />

      {/* ─── CARD-TO-FULLSCREEN FLIP EXPANSION TRANSITION ─── */}
      {transitionState && (
        <EventDetailTransition
          initialRect={transitionState.rect}
          eventImage={transitionState.image}
          eventTitle={transitionState.title}
          eventCategory={transitionState.category}
          onComplete={handleTransitionComplete}
        />
      )}
    </div>
  );
}

export default App;
