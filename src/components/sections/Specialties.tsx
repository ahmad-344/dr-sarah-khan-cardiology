import React from 'react';
import {
  HeartPulseIcon, HeartIcon, ShieldCheckIcon,
  ActivityIcon, ScanIcon, BarChartIcon, ArrowRightIcon,
} from '../../assets/svgs/Icons';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const ICON_MAP: Record<string, React.FC<{ className?: string; size?: number }>> = {
  'heart-pulse': HeartPulseIcon,
  'heart': HeartIcon,
  'shield-check': ShieldCheckIcon,
  'activity': ActivityIcon,
  'scan': ScanIcon,
  'bar-chart': BarChartIcon,
};

const SPECIALTY_IDS = [
  'interventional-cardiology',
  'heart-failure-management',
  'preventive-cardiology',
  'cardiac-electrophysiology',
  'echocardiography',
  'hypertension-lipid-management',
];

interface SpecialtiesProps {
  onLearnMore: (id: string) => void;
}

const Specialties: React.FC<SpecialtiesProps> = ({ onLearnMore }) => {
  const { settings } = useSiteSettings();
  const SPECIALTIES = settings.services;
  return (
    <section id="specialties" className="py-16 lg:py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-accent" />
            <span className="font-dmsans text-accent text-sm font-semibold uppercase tracking-wider">Clinical Expertise</span>
            <div className="w-8 h-0.5 bg-accent" />
          </div>
          <h2 className="font-merriweather font-black text-text-primary text-3xl lg:text-4xl mb-3">Areas of Expertise</h2>
          <p className="font-sourcesans text-text-secondary text-base max-w-xl mx-auto">
            Comprehensive cardiac care using the latest evidence-based protocols and interventional techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SPECIALTIES.map((spec, idx) => {
            const Icon = ICON_MAP[spec.icon] || HeartIcon;
            const specId = SPECIALTY_IDS[idx];
            return (
              <div key={idx} className="group bg-white rounded-2xl border-l-4 border-l-primary border border-border-light shadow-card hover:shadow-card-hover hover:bg-primary hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="text-primary group-hover:text-white transition-colors" size={22} />
                  </div>
                  <h3 className="font-merriweather font-bold text-text-primary group-hover:text-white text-base mb-2 transition-colors">{spec.title}</h3>
                  <p className="font-sourcesans text-text-secondary group-hover:text-blue-100 text-sm leading-relaxed mb-4 transition-colors">{spec.description}</p>
                  <button
                    onClick={() => onLearnMore(specId)}
                    className="inline-flex items-center gap-1.5 text-accent group-hover:text-white font-sourcesans font-semibold text-sm transition-colors hover:gap-2.5"
                  >
                    Learn More <ArrowRightIcon size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-border-light shadow-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-merriweather font-bold text-text-primary text-lg mb-1">Not sure which consultation you need?</h3>
            <p className="font-sourcesans text-text-secondary text-sm">Call us and our team will guide you to the right specialist appointment.</p>
          </div>
          <a href="tel:+923190539976" className="flex-shrink-0 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-sourcesans font-bold px-6 py-3 rounded-xl transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
            Call: +92-319-0539976
          </a>
        </div>
      </div>
    </section>
  );
};

export default Specialties;
