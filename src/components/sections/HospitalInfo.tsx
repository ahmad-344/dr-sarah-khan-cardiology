import React from 'react';
import { MapPinIcon, PhoneIcon, ClockIcon } from '../../assets/svgs/Icons';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const DIRECTIONS = [
  { label: 'By Car',      detail: 'Take Jinnah Avenue towards G-8, turn right on G-8 Markaz road. Ample parking available inside the hospital premises.' },
  { label: 'By Metro',    detail: 'Islamabad Metro — alight at Faizabad station, then take a rickshaw (7 min) or Careem to G-8/4.' },
  { label: 'Landmarks',   detail: 'Adjacent to G-8 Markaz commercial area. Near Capital Hospital, opposite Centaurus Mall direction.' },
];

const HospitalInfo: React.FC = () => {
  const { settings } = useSiteSettings();
  const { contact, clinicHours } = settings;

  return (
    <section className="py-16 lg:py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-accent" />
            <span className="font-dmsans text-accent text-sm font-semibold uppercase tracking-wider">Location</span>
            <div className="w-8 h-0.5 bg-accent" />
          </div>
          <h2 className="font-merriweather font-black text-text-primary text-3xl lg:text-4xl mb-3">Hospital Information</h2>
          <p className="font-sourcesans text-text-secondary text-base">Conveniently located in the heart of Islamabad.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real Google Maps iframe */}
          <div className="rounded-2xl overflow-hidden border border-border-light shadow-card-hover h-80 lg:h-auto min-h-80 relative">
            <iframe
              title="Islamabad Heart Institute Location"
              src={contact.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-primary font-sourcesans font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-secondary transition-all flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.69 2 6 4.69 6 8C6 12.5 12 20 12 20C12 20 18 12.5 18 8C18 4.69 15.31 2 12 2Z" stroke="#0f4c81" strokeWidth="1.5"/>
                <circle cx="12" cy="8" r="2.5" stroke="#0f4c81" strokeWidth="1.5"/>
              </svg>
              Open in Google Maps
            </a>
          </div>

          {/* Info panel */}
          <div className="space-y-5">
            {/* Address card */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5">
              <h3 className="font-merriweather font-bold text-text-primary text-base mb-4">Islamabad Heart Institute</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="text-primary flex-shrink-0 mt-0.5" size={18} />
                  <div className="font-sourcesans text-text-secondary text-sm">{contact.address}</div>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="text-primary flex-shrink-0" size={18} />
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    className="font-sourcesans text-text-primary text-sm font-semibold hover:text-primary transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="text-primary flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <div className="font-sourcesans text-text-primary text-sm font-semibold">
                      Mon–Fri: {clinicHours.weekdays}
                    </div>
                    {clinicHours.saturday !== 'Closed' && (
                      <div className="font-sourcesans text-text-secondary text-sm">
                        Saturday: {clinicHours.saturday}
                      </div>
                    )}
                    <div className="font-sourcesans text-success text-sm font-semibold">
                      Emergency: {clinicHours.emergency}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5">
              <h3 className="font-merriweather font-bold text-text-primary text-sm mb-3 uppercase tracking-wide">Getting Here</h3>
              <div className="space-y-3.5">
                {DIRECTIONS.map(d => (
                  <div key={d.label} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <div className="font-dmsans font-bold text-text-primary text-xs uppercase tracking-wide">{d.label}</div>
                      <div className="font-sourcesans text-text-secondary text-sm mt-0.5">{d.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-secondary rounded-2xl border border-border-light p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="4" r="2" stroke="#0f4c81" strokeWidth="1.5"/>
                  <path d="M10 8L8 14H12L14 20" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 10L12 9" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="18" r="3" stroke="#0f4c81" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="font-dmsans font-bold text-primary text-xs uppercase tracking-wide mb-1">Accessibility</div>
                <p className="font-sourcesans text-text-secondary text-sm">
                  Fully wheelchair accessible. Dedicated disabled parking, lift access, and on-site assistance available on request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalInfo;
