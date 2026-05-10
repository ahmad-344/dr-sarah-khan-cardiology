import React from 'react';
import { GraduationCapIcon, AwardIcon, UsersIcon, BookOpenIcon } from '../../assets/svgs/Icons';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const About: React.FC = () => {
  const { settings } = useSiteSettings();
  const { doctor } = settings;

  return (
    <section id="about" className="py-16 lg:py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-0.5 bg-accent" />
            <span className="font-dmsans text-accent text-sm font-semibold uppercase tracking-wider">About the Physician</span>
          </div>
          <h2 className="font-merriweather font-black text-text-primary text-3xl lg:text-4xl">{doctor.name}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* LEFT: Bio */}
          <div className="lg:col-span-3 space-y-5">
            <div className="relative mb-8 w-full max-w-sm">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary-light shadow-card-hover">
                <img
                  src="/images/doctor-about.jpg"
                  alt={`${doctor.name} in consultation`}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display='none'; }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white rounded-xl px-5 py-3 shadow-lg">
                <div className="font-merriweather font-black text-3xl leading-none">{doctor.experience}</div>
                <div className="font-sourcesans text-xs text-blue-200 font-semibold">Years of Excellence</div>
              </div>
            </div>

            <p className="font-sourcesans text-text-secondary text-base leading-relaxed">
              {doctor.name} developed her passion for cardiology during her undergraduate years at King Edward Medical University — one of Pakistan's most prestigious medical institutions. Witnessing the impact of heart disease on patients and families across the country drove her to pursue the most challenging subspecialty within medicine.
            </p>
            <p className="font-sourcesans text-text-secondary text-base leading-relaxed">
              After earning her FCPS in Cardiology, Dr. Khan was selected for a highly competitive fellowship in Interventional Cardiology at the Mayo Clinic in Rochester, USA. She subsequently completed post-doctoral research at Cleveland Clinic, focusing on catheter-based structural heart disease interventions.
            </p>
            <p className="font-sourcesans text-text-secondary text-base leading-relaxed">
              Dr. Khan has authored over {doctor.publications} peer-reviewed publications in international journals including JACC, Lancet, and European Heart Journal. She is a sought-after speaker at international cardiology conferences.
            </p>
            <blockquote className="border-l-4 border-accent bg-secondary rounded-r-xl pl-5 pr-4 py-4">
              <p className="font-merriweather text-text-primary text-base italic leading-relaxed">
                "{doctor.philosophy}"
              </p>
              <cite className="font-dmsans text-accent text-sm font-semibold mt-2 block not-italic">— {doctor.name}</cite>
            </blockquote>
          </div>

          {/* RIGHT: Credentials */}
          <div className="lg:col-span-2 space-y-5">
            {/* Education */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 bg-secondary border-b border-border-light">
                <GraduationCapIcon className="text-primary" size={18} />
                <h3 className="font-merriweather font-bold text-text-primary text-sm">Education & Training</h3>
              </div>
              <div className="p-5 space-y-4">
                {doctor.education.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 w-px bg-border-light self-stretch relative">
                      <div className="absolute top-0.5 -left-1.5 w-3 h-3 rounded-full bg-primary" />
                    </div>
                    <div className="pb-2">
                      <div className="font-dmsans font-semibold text-primary text-xs mb-0.5">{item.year}</div>
                      <div className="font-sourcesans font-semibold text-text-primary text-sm">{item.degree}</div>
                      <div className="font-sourcesans text-text-secondary text-xs leading-snug">{item.institution}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 bg-secondary border-b border-border-light">
                <AwardIcon className="text-primary" size={18} />
                <h3 className="font-merriweather font-bold text-text-primary text-sm">Awards & Recognition</h3>
              </div>
              <div className="p-5 space-y-3">
                {doctor.awards.map((award, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                    <div>
                      <div className="font-sourcesans font-semibold text-text-primary text-sm">{award.title}</div>
                      <div className="font-sourcesans text-text-secondary text-xs">{award.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memberships */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 bg-secondary border-b border-border-light">
                <UsersIcon className="text-primary" size={18} />
                <h3 className="font-merriweather font-bold text-text-primary text-sm">Professional Memberships</h3>
              </div>
              <div className="p-5 space-y-2.5">
                {doctor.memberships.map((m, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="font-sourcesans text-text-secondary text-sm">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Publications badge */}
            <div className="bg-primary rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <BookOpenIcon size={18} className="text-accent" />
                <span className="font-dmsans font-semibold text-accent text-sm">Research Output</span>
              </div>
              <div className="font-merriweather font-black text-3xl mb-1">{doctor.publications}</div>
              <div className="font-sourcesans text-blue-200 text-sm">
                Peer-reviewed publications in international journals including JACC, Lancet, and European Heart Journal
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
