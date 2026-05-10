import React, { useState } from 'react';
import { SPECIALTY_DETAILS } from '../../data/specialtyDetails';
import {
  HeartPulseIcon, HeartIcon, ShieldCheckIcon, ActivityIcon,
  ScanIcon, BarChartIcon, CheckCircleIcon, ChevronDownIcon,
  ArrowRightIcon,
} from '../../assets/svgs/Icons';

const ICON_MAP: Record<string, React.FC<{ className?: string; size?: number }>> = {
  'heart-pulse': HeartPulseIcon,
  'heart': HeartIcon,
  'shield-check': ShieldCheckIcon,
  'activity': ActivityIcon,
  'scan': ScanIcon,
  'bar-chart': BarChartIcon,
};

interface SpecialtyDetailPageProps {
  specialtyId: string;
  onBack: () => void;
  onBookAppointment: () => void;
}

const SpecialtyDetailPage: React.FC<SpecialtyDetailPageProps> = ({ specialtyId, onBack, onBookAppointment }) => {
  const detail = SPECIALTY_DETAILS.find(s => s.id === specialtyId);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!detail) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-sourcesans text-text-secondary mb-4">Specialty not found.</p>
        <button onClick={onBack} className="bg-primary text-white px-6 py-2.5 rounded-lg font-sourcesans font-semibold">Go Back</button>
      </div>
    </div>
  );

  const Icon = ICON_MAP[detail.icon] || HeartIcon;

  return (
    <div className="min-h-screen bg-warm-white pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${detail.heroColor} 0%, ${detail.heroColor}cc 100%)` }}>
        <div className="absolute inset-0 bg-medical-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-white/70 text-sm font-sourcesans">
            <button onClick={onBack} className="hover:text-white transition-colors flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Back to Specialties
            </button>
            <span>/</span>
            <span className="text-white font-semibold">{detail.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Icon className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <div className="font-dmsans text-white/70 text-sm uppercase tracking-wider mb-1">Dr. Sarah Khan — Specialist</div>
              <h1 className="font-merriweather font-black text-white text-3xl lg:text-4xl mb-2">{detail.title}</h1>
              <p className="font-sourcesans text-white/85 text-base max-w-2xl">{detail.tagline}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {detail.stats.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="font-merriweather font-black text-white text-2xl">{s.value}</div>
                <div className="font-sourcesans text-white/70 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section>
              <SectionHeading title="Overview" />
              {detail.overview.split('\n\n').map((para, i) => (
                <p key={i} className="font-sourcesans text-text-secondary text-base leading-relaxed mb-4">{para}</p>
              ))}
            </section>

            {/* Conditions Treated */}
            <section>
              <SectionHeading title="Conditions Treated" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detail.conditions.map((c, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border-light shadow-sm p-4 hover:shadow-card transition-shadow">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: detail.heroColor }} />
                      </div>
                      <div>
                        <div className="font-dmsans font-bold text-text-primary text-sm">{c.name}</div>
                        <div className="font-sourcesans text-text-secondary text-xs leading-snug mt-0.5">{c.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Procedures */}
            <section>
              <SectionHeading title="Procedures & Services" />
              <div className="space-y-4">
                {detail.procedures.map((p, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border-light shadow-sm overflow-hidden">
                    <div className="flex items-start gap-4 p-5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${detail.heroColor}18` }}>
                        <span className="font-merriweather font-black text-sm" style={{ color: detail.heroColor }}>{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-dmsans font-bold text-text-primary text-sm">{p.name}</h4>
                          {p.duration && (
                            <span className="flex-shrink-0 bg-secondary text-primary font-dmsans font-semibold text-xs px-2.5 py-1 rounded-full">
                              {p.duration}
                            </span>
                          )}
                        </div>
                        <p className="font-sourcesans text-text-secondary text-sm leading-relaxed mt-1">{p.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What to Expect */}
            <section>
              <SectionHeading title="What to Expect at Your Appointment" />
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-6">
                <div className="space-y-3">
                  {detail.whatToExpect.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: detail.heroColor }}>
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="font-sourcesans text-text-secondary text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <SectionHeading title="Frequently Asked Questions" />
              <div className="space-y-3">
                {detail.faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-primary shadow-card' : 'border-border-light'}`}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full text-left flex items-center justify-between px-5 py-4 gap-4"
                        aria-expanded={isOpen}
                      >
                        <span className="font-dmsans font-bold text-text-primary text-sm">{faq.q}</span>
                        <ChevronDownIcon size={18} className={`flex-shrink-0 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64' : 'max-h-0'}`}>
                        <div className="px-5 pb-4 border-t border-border-light pt-3">
                          <p className="font-sourcesans text-text-secondary text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Book CTA */}
            <div className="bg-primary rounded-2xl p-6 text-white sticky top-20">
              <div className="font-merriweather font-bold text-lg mb-2">Ready to Book?</div>
              <p className="font-sourcesans text-blue-200 text-sm mb-5">Schedule a consultation with Dr. Sarah Khan for a thorough assessment.</p>
              <button
                onClick={onBookAppointment}
                className="w-full bg-white text-primary font-sourcesans font-bold py-3 rounded-xl hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#0f4c81" strokeWidth="2"/><path d="M3 9H21M8 2V6M16 2V6" stroke="#0f4c81" strokeWidth="2" strokeLinecap="round"/></svg>
                Book Appointment
              </button>
              <a href="tel:+923190539976" className="mt-3 w-full border border-white/30 text-white font-sourcesans font-semibold py-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" stroke="white" strokeWidth="1.5"/></svg>
                +92-319-0539976
              </a>
            </div>

            {/* Preparation checklist */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5">
              <h3 className="font-merriweather font-bold text-text-primary text-sm mb-4">
                Before Your Appointment
              </h3>
              <div className="space-y-2.5">
                {detail.preparation.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircleIcon className="text-success flex-shrink-0 mt-0.5" size={16} />
                    <span className="font-sourcesans text-text-secondary text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency note */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="font-dmsans font-bold text-emergency-red text-xs uppercase tracking-wide mb-1">Urgent Symptoms?</div>
              <p className="font-sourcesans text-text-secondary text-xs mb-3">Chest pain, severe breathlessness, or fainting — call emergency services immediately.</p>
              <a href="tel:1122" className="block text-center bg-emergency-red text-white font-sourcesans font-bold text-sm py-2 rounded-lg">
                Call 1122
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-1 h-6 bg-primary rounded-full" />
    <h2 className="font-merriweather font-bold text-text-primary text-xl">{title}</h2>
  </div>
);

export default SpecialtyDetailPage;
