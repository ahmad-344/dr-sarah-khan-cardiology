import React from 'react';
import { CaduceusIcon, MapPinIcon, PhoneIcon, MailIcon, AlertTriangleIcon } from '../../assets/svgs/Icons';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface FooterProps {
  onNavigate: (target: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const { contact, clinicHours, doctor } = settings;

  return (
    <footer className="bg-text-primary text-white" id="contact">
      {/* Emergency banner */}
      <div className="bg-emergency-red py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <AlertTriangleIcon size={18} className="text-white flex-shrink-0" />
          <span className="font-sourcesans font-bold text-sm">
            For medical emergencies call <strong>{contact.emergencyLine}</strong> (Rescue) immediately
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <CaduceusIcon className="text-accent" size={20} />
              </div>
              <div className="text-left">
                <div className="font-merriweather font-bold text-white text-sm">{doctor.name}</div>
                <div className="font-dmsans text-gray-400 text-xs">FCPS Cardiology</div>
              </div>
            </button>
            <p className="font-sourcesans text-gray-400 text-sm leading-relaxed mb-4">
              Compassionate care. Evidence-based medicine. Serving Islamabad for {doctor.experience} years.
            </p>
            <div className="text-xs text-gray-500 font-sourcesans space-y-1">
              <div>PMDC Reg: <span className="text-gray-300">PM-35201-PKN</span></div>
              <div>CPSP Fellow: <span className="text-gray-300">FCPS/Card/2011-047</span></div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-merriweather font-bold text-white text-sm mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home',               target: 'home' },
                { label: 'About the Doctor',   target: 'about' },
                { label: 'Specialties',        target: 'specialties' },
                { label: 'Book Appointment',   target: 'appointments' },
                { label: 'Patient Information',target: 'patient-info' },
                { label: 'My Appointments',    target: 'my-appointments' },
              ].map(link => (
                <li key={link.target}>
                  <button onClick={() => onNavigate(link.target)}
                    className="font-sourcesans text-gray-400 text-sm hover:text-accent transition-colors text-left">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-merriweather font-bold text-white text-sm mb-4 uppercase tracking-wider">Services</h3>
            <ul className="space-y-2.5">
              {settings.services.map(svc => (
                <li key={svc.title}>
                  <button onClick={() => onNavigate('specialties')}
                    className="font-sourcesans text-gray-400 text-sm hover:text-accent transition-colors text-left">
                    {svc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-merriweather font-bold text-white text-sm mb-4 uppercase tracking-wider">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPinIcon size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <div className="font-sourcesans text-gray-400 text-sm">{contact.address}</div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon size={16} className="text-accent flex-shrink-0" />
                <a href={`tel:${contact.phone.replace(/[^0-9+]/g,'')}`}
                  className="font-sourcesans text-gray-400 text-sm hover:text-accent transition-colors">
                  {contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MailIcon size={16} className="text-accent flex-shrink-0" />
                <a href={`mailto:${contact.email}`}
                  className="font-sourcesans text-gray-400 text-sm hover:text-accent transition-colors">
                  {contact.email}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="font-dmsans text-xs font-semibold text-gray-300 mb-2">CLINIC HOURS</div>
              <div className="font-sourcesans text-xs text-gray-400 space-y-1">
                <div className="flex justify-between"><span>Mon – Fri</span><span className="text-gray-300">{clinicHours.weekdays}</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="text-gray-300">{clinicHours.saturday}</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-gray-400">{clinicHours.sunday}</span></div>
                <div className="flex justify-between"><span>Emergency</span><span className="text-green-400 font-semibold">{clinicHours.emergency}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sourcesans text-gray-500 text-xs">
            © {year} {doctor.name} — {doctor.title}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')}
              className="font-sourcesans text-gray-500 text-xs hover:text-gray-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('terms')}
              className="font-sourcesans text-gray-500 text-xs hover:text-gray-300 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
