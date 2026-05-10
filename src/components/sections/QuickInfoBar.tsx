import React from 'react';
import { MapPinIcon, ClockIcon, PhoneIcon, MailIcon } from '../../assets/svgs/Icons';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const QuickInfoBar: React.FC = () => {
  const { settings } = useSiteSettings();
  const { contact, clinicHours } = settings;

  const INFO_ITEMS = [
    { Icon: MapPinIcon, label: 'Location', value: contact.address.split(',').slice(0,2).join(','), href: null, color: 'text-primary' },
    { Icon: ClockIcon,  label: 'Clinic Hours', value: `Mon–Sat: ${clinicHours.weekdays}  |  Emergency: ${clinicHours.emergency}`, href: null, color: 'text-accent' },
    { Icon: PhoneIcon,  label: 'Telephone', value: contact.phone, href: `tel:${contact.phone.replace(/[^0-9+]/g,'')}`, color: 'text-primary' },
    { Icon: MailIcon,   label: 'Email', value: contact.email, href: `mailto:${contact.email}`, color: 'text-accent' },
  ];

  return (
    <div className="bg-secondary border-y border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-border-light">
          {INFO_ITEMS.map(item => (
            <div key={item.label} className="flex items-center gap-3.5 py-4 px-5">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <item.Icon className={item.color} size={19} />
              </div>
              <div className="min-w-0">
                <div className="font-dmsans font-semibold text-text-secondary text-xs uppercase tracking-wider mb-0.5">{item.label}</div>
                {item.href ? (
                  <a href={item.href} className="font-sourcesans text-text-primary text-sm font-semibold hover:text-primary transition-colors truncate block">{item.value}</a>
                ) : (
                  <div className="font-sourcesans text-text-primary text-sm font-semibold">{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickInfoBar;
