import React, { useState } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { ChevronDownIcon } from '../../assets/svgs/Icons';
import { FAQS } from '../../data/constants';

const PatientInfo: React.FC = () => {
  const { settings } = useSiteSettings();
  const { contact } = settings;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="patient-info" className="py-16 lg:py-20 bg-warm-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-accent" />
            <span className="font-dmsans text-accent text-sm font-semibold uppercase tracking-wider">Patient Resources</span>
            <div className="w-8 h-0.5 bg-accent" />
          </div>
          <h2 className="font-merriweather font-black text-text-primary text-3xl lg:text-4xl mb-3">Patient Information</h2>
          <p className="font-sourcesans text-text-secondary text-base">
            Everything you need to prepare for your visit and make the most of your consultation.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isOpen ? 'border-primary shadow-card' : 'border-border-light hover:border-primary/40'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left flex items-center justify-between px-5 py-4 gap-4"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-btn-${i}`}
                >
                  <span className="font-merriweather font-bold text-text-primary text-sm leading-snug">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary' : 'bg-secondary'}`}>
                    <ChevronDownIcon
                      size={16}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-primary'}`}
                    />
                  </div>
                </button>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                >
                  <div className="px-5 pb-5 border-t border-border-light pt-4">
                    <p className="font-sourcesans text-text-secondary text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-8 bg-secondary rounded-2xl border border-border-light p-5 flex items-start gap-3">
          <QuestionSVG />
          <div>
            <h4 className="font-dmsans font-bold text-text-primary text-sm mb-1">Still have questions?</h4>
            <p className="font-sourcesans text-text-secondary text-sm mb-3">
              Our clinic coordinators are available Monday–Saturday, 9 AM–5 PM.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={contact ? 'tel:' + contact.phone.replace(/[^0-9+]/g, '') : 'tel:+923190539976'} className="inline-flex items-center gap-1.5 bg-primary text-white font-sourcesans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                <PhoneSVG />
                Call Us
              </a>
              <a href={contact ? 'mailto:' + contact.email : 'mailto:contactahmad.services@gmail.com'} className="inline-flex items-center gap-1.5 bg-white text-primary border border-primary font-sourcesans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
                <MailSVG />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const QuestionSVG = () => (
  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#0f4c81" strokeWidth="1.5"/>
      <path d="M9.09 9C9.32 8.33 9.77 7.77 10.37 7.41C10.97 7.05 11.68 6.91 12.38 7.02C13.08 7.13 13.72 7.48 14.18 8.01C14.64 8.54 14.9 9.21 14.9 9.9C14.9 12 12 13 12 13" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.5" fill="#0f4c81" stroke="#0f4c81"/>
    </svg>
  </div>
);

const PhoneSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" stroke="white" strokeWidth="1.5"/>
  </svg>
);

const MailSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#0f4c81" strokeWidth="1.5"/>
    <path d="M2 8L12 13L22 8" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default PatientInfo;
