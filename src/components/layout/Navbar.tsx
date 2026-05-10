import React, { useState, useEffect } from 'react';
import { CaduceusIcon, MenuIcon, XIcon, AlertTriangleIcon } from '../../assets/svgs/Icons';
import { NAV_LINKS } from '../../data/constants';

interface NavbarProps {
  onBookAppointment: () => void;
  onNavigate: (target: string) => void;
  isHomePage: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onBookAppointment, onNavigate, isHomePage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver — only active on home page where sections exist
  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = NAV_LINKS.map(l => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [isHomePage]);

  // Reset active section when leaving home page
  useEffect(() => {
    if (!isHomePage) setActiveSection('');
  }, [isHomePage]);

  const handleNavClick = (href: string) => {
    const sectionId = href.replace('#', '');
    onNavigate(sectionId);   // Works from any page
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-nav' : 'border-b-2 border-primary'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo — always goes home */}
            <button
              onClick={() => { onNavigate('home'); setMobileOpen(false); }}
              className="flex items-center gap-2.5 group"
              aria-label="Dr. Sarah Khan — Home"
            >
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-dark transition-colors">
                <CaduceusIcon className="text-white" size={20} />
              </div>
              <div className="text-left">
                <div className="font-merriweather font-bold text-text-primary text-sm leading-tight">
                  Dr. Sarah Khan
                </div>
                <div className="font-dmsans text-text-secondary text-xs leading-tight">
                  FCPS (Cardiology)
                </div>
              </div>
            </button>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const sId = link.href.replace('#', '');
                const isActive = isHomePage && activeSection === sId;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`px-3.5 py-2 rounded-t-md font-sourcesans text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-secondary border-b-2 border-primary'
                        : 'text-text-secondary hover:text-primary hover:bg-secondary/60'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="tel:1122"
                className="flex items-center gap-1.5 text-emergency-red font-sourcesans text-xs font-bold bg-red-50 px-2.5 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                aria-label="Emergency 1122"
              >
                <AlertTriangleIcon size={13} className="text-emergency-red" />
                Emergency: 1122
              </a>
              <button
                onClick={onBookAppointment}
                className="bg-primary hover:bg-primary-dark text-white font-sourcesans font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
              >
                <CalendarSVG />
                Book Appointment
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-text-primary hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '64px' }}
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col p-6 gap-1">
          {NAV_LINKS.map(link => {
            const sId = link.href.replace('#', '');
            const isActive = isHomePage && activeSection === sId;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-left px-4 py-3.5 font-sourcesans text-base font-semibold rounded-lg transition-colors border-b border-gray-100 last:border-0 ${
                  isActive
                    ? 'text-primary bg-secondary'
                    : 'text-text-primary hover:text-primary hover:bg-secondary'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="mt-4 flex flex-col gap-3">
            <a
              href="tel:1122"
              className="flex items-center justify-center gap-2 text-emergency-red font-sourcesans font-bold bg-red-50 px-4 py-3 rounded-lg"
            >
              <AlertTriangleIcon size={16} />
              Emergency: 1122
            </a>
            <button
              onClick={() => { onBookAppointment(); setMobileOpen(false); }}
              className="bg-primary text-white font-sourcesans font-semibold py-3.5 rounded-lg w-full"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const CalendarSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2" />
    <path d="M3 9H21M8 2V6M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default Navbar;
