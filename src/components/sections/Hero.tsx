import React, { useState } from 'react';
import { StarIcon, AwardIcon, UsersIcon, GraduationCapIcon } from '../../assets/svgs/Icons';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface HeroProps {
  onBookAppointment: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookAppointment }) => {
  const { settings } = useSiteSettings();
  const { doctor, contact } = settings;
  const [imgError, setImgError] = useState(false);

  const stats = [
    { value: '15,000+', label: 'Patients Treated', Icon: UsersIcon },
    { value: '4.9',     label: 'Patient Rating',   Icon: StarIcon },
    { value: `${doctor.experience} Yrs`, label: 'Experience', Icon: AwardIcon },
    { value: '3',       label: 'Fellowships',      Icon: GraduationCapIcon },
  ];

  return (
    <section id="home" className="relative bg-warm-white bg-medical-pattern min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-secondary rounded-full opacity-60 -translate-y-1/4 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* ── LEFT: Content ── */}
          <div className="order-2 lg:order-1 animate-fade-in">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-full text-sm font-sourcesans font-semibold mb-5">
              <StarIcon size={14} className="text-amber-500" />
              Top Cardiologist — Islamabad 2024
            </div>

            {/* Credentials */}
            <p className="font-dmsans text-text-secondary text-sm tracking-widest uppercase mb-2">
              {doctor.credentials}
            </p>

            {/* Name */}
            <h1 className="font-merriweather font-black text-text-primary leading-tight mb-2"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
              {doctor.name}
            </h1>

            {/* Title */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-0.5 bg-accent" />
              <span className="font-dmsans font-semibold text-accent text-base tracking-wide">
                {doctor.title}
              </span>
            </div>

            {/* Tagline */}
            <p className="font-sourcesans text-text-secondary text-base leading-relaxed mb-8 max-w-md">
              {doctor.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={onBookAppointment}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-sourcesans font-bold px-6 py-3.5 rounded-xl text-base transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M3 9H21M8 2V6M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Book Appointment
              </button>
              <a
                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-secondary font-sourcesans font-bold px-6 py-3.5 rounded-xl text-base transition-all"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                Call: {contact.phone}
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-1.5">
                    <s.Icon className="text-accent" size={18} />
                    <span className="font-merriweather font-black text-text-primary text-lg leading-none">
                      {s.value}
                    </span>
                  </div>
                  <span className="font-sourcesans text-text-secondary text-xs leading-tight text-center sm:text-left">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Doctor Photo ── */}
          <div className="order-1 lg:order-2 flex justify-center items-center relative">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[350px] lg:h-[350px]">
              {/* Spinning dashed ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin"
                style={{ animationDuration: '30s' }}
              />

              {/* Main circle — shows image OR gradient fallback */}
              <div className="absolute inset-3 rounded-full overflow-hidden shadow-2xl">
                {!imgError ? (
                  <img
                    src="/images/doctor-profile.jpg"
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  /* Fallback gradient with initials — no black overlay */
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white font-merriweather font-black text-5xl opacity-80">SK</div>
                      <div className="text-blue-200 font-dmsans text-sm mt-1">FCPS Cardiology</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Credential badge */}
              <div className="absolute -bottom-2 -left-4 bg-white rounded-xl shadow-card border border-border-light px-4 py-3 min-w-[150px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="font-dmsans font-semibold text-text-primary text-xs">Available Today</span>
                </div>
                <div className="font-sourcesans text-primary text-xs font-bold">FCPS Cardiology</div>
                <div className="font-sourcesans text-text-secondary text-xs">Mayo Clinic Fellow</div>
              </div>

              {/* Floating heart */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-card flex items-center justify-center animate-float">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19.5 12.572L12 20L4.5 12.572C3.09 11.21 3.09 9.01 4.5 7.65C5.91 6.29 8.22 6.29 9.63 7.65L12 10L14.37 7.65C15.78 6.29 18.09 6.29 19.5 7.65C20.91 9.01 20.91 11.21 19.5 12.572Z" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mt-10 pt-6 border-t border-border-light flex flex-col sm:flex-row items-center gap-2 text-sm font-sourcesans text-text-secondary">
          <span>Islamabad Heart Institute</span>
          <span className="hidden sm:block text-gray-300">•</span>
          <span>{contact.address}</span>
          <span className="hidden sm:block text-gray-300">•</span>
          <span className="text-success font-semibold">Accepting New Patients</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
