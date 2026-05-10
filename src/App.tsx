import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SiteSettingsContext, useSiteSettingsProvider } from './hooks/useSiteSettings';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import QuickInfoBar from './components/sections/QuickInfoBar';
import About from './components/sections/About';
import Specialties from './components/sections/Specialties';
import AppointmentsBooking from './components/sections/AppointmentsBooking';
import MyAppointments from './components/sections/MyAppointments';
import PatientInfo from './components/sections/PatientInfo';
import Testimonials from './components/sections/Testimonials';
import HospitalInfo from './components/sections/HospitalInfo';
import SpecialtyDetailPage from './components/sections/SpecialtyDetail';
import AdminPanel from './pages/AdminPanel';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

type Page =
  | { type: 'home'; scrollTo?: string }
  | { type: 'specialty'; id: string }
  | { type: 'admin' }
  | { type: 'privacy' }
  | { type: 'terms' };

const App: React.FC = () => {
  const bookingRef = useRef<HTMLDivElement>(null);
  const siteSettings = useSiteSettingsProvider();
  const [page, setPage] = useState<Page>({ type: 'home' });
  const isHomePage = page.type === 'home';

  useEffect(() => {
    if (window.location.hash === '#admin') {
      setPage({ type: 'admin' });
    }
  }, []);

  useEffect(() => {
    if (page.type === 'home' && page.scrollTo) {
      const timer = setTimeout(() => {
        const el = document.getElementById(page.scrollTo!);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setPage({ type: 'home' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [page]);

  const navigateTo = useCallback((target: string) => {
    window.scrollTo({ top: 0 });
    if (target === 'privacy') { setPage({ type: 'privacy' }); return; }
    if (target === 'terms')   { setPage({ type: 'terms' });   return; }
    if (target === 'admin')   { setPage({ type: 'admin' });   return; }
    if (isHomePage) {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setPage({ type: 'home', scrollTo: target });
    }
  }, [isHomePage]);

  const scrollToBooking = useCallback(() => navigateTo('appointments'), [navigateTo]);
  const goHome = useCallback(() => {
    setPage({ type: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navProps = { onBookAppointment: scrollToBooking, onNavigate: navigateTo, isHomePage: false };

  return (
    <SiteSettingsContext.Provider value={siteSettings}>
      {page.type === 'admin' && (
        <AdminPanel onBack={goHome} />
      )}

      {page.type === 'privacy' && (
        <>
          <Navbar {...navProps} />
          <PrivacyPolicy onBack={goHome} />
          <Footer onNavigate={navigateTo} />
        </>
      )}

      {page.type === 'terms' && (
        <>
          <Navbar {...navProps} />
          <TermsOfService onBack={goHome} />
          <Footer onNavigate={navigateTo} />
        </>
      )}

      {page.type === 'specialty' && (
        <>
          <Navbar {...navProps} />
          <SpecialtyDetailPage
            specialtyId={page.id}
            onBack={() => navigateTo('specialties')}
            onBookAppointment={scrollToBooking}
          />
          <Footer onNavigate={navigateTo} />
        </>
      )}

      {page.type === 'home' && (
        <div className="min-h-screen bg-warm-white">
          <Navbar
            onBookAppointment={scrollToBooking}
            onNavigate={navigateTo}
            isHomePage={true}
          />
          <main>
            <Hero onBookAppointment={scrollToBooking} />
            <QuickInfoBar />
            <About />
            <Specialties
              onLearnMore={id => {
                window.scrollTo({ top: 0 });
                setPage({ type: 'specialty', id });
              }}
            />
            <div ref={bookingRef}>
              <AppointmentsBooking scrollRef={bookingRef} />
            </div>
            <MyAppointments />
            <PatientInfo />
            <Testimonials />
            <HospitalInfo />
          </main>
          <Footer onNavigate={navigateTo} />
        </div>
      )}
    </SiteSettingsContext.Provider>
  );
};

export default App;
