import React from 'react';
import { StarIcon } from '../../assets/svgs/Icons';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const RATING_DIST = [
  { stars: 5, pct: 89 },
  { stars: 4, pct: 8 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 0 },
  { stars: 1, pct: 0 },
];

const Testimonials: React.FC = () => {
  const { settings } = useSiteSettings();
  const TESTIMONIALS = settings.reviews;
  return (
    <section className="py-16 lg:py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-accent" />
            <span className="font-dmsans text-accent text-sm font-semibold uppercase tracking-wider">Patient Voices</span>
            <div className="w-8 h-0.5 bg-accent" />
          </div>
          <h2 className="font-merriweather font-black text-text-primary text-3xl lg:text-4xl mb-3">Patient Stories</h2>
          <p className="font-sourcesans text-text-secondary text-base max-w-lg mx-auto">
            Real experiences from the patients we have had the privilege of caring for.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Rating overview */}
          <div className="bg-white rounded-2xl border border-border-light shadow-card p-6">
            <div className="text-center mb-5">
              <div className="font-merriweather font-black text-text-primary text-5xl">4.9</div>
              <div className="flex justify-center gap-0.5 my-2">
                {[1,2,3,4,5].map(s => (
                  <StarIcon key={s} className="text-amber-400" size={18} />
                ))}
              </div>
              <div className="font-sourcesans text-text-secondary text-sm">Based on 240+ verified reviews</div>
            </div>

            {/* Rating bars */}
            <div className="space-y-2.5">
              {RATING_DIST.map(row => (
                <div key={row.stars} className="flex items-center gap-2">
                  <span className="font-sourcesans text-text-secondary text-xs w-3 flex-shrink-0">{row.stars}</span>
                  <StarIcon className="text-amber-400 flex-shrink-0" size={12} />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="font-sourcesans text-text-secondary text-xs w-8 text-right">{row.pct}%</span>
                </div>
              ))}
            </div>

            {/* Verified badge */}
            <div className="mt-5 pt-4 border-t border-border-light flex items-center gap-2">
              <VerifiedSVG />
              <span className="font-sourcesans text-text-secondary text-xs">All reviews are from verified patients</span>
            </div>
          </div>

          {/* Review cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border-light shadow-card p-5 flex flex-col hover:shadow-card-hover transition-shadow">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <StarIcon key={s} className={s <= t.rating ? 'text-amber-400' : 'text-gray-200'} size={14} />
                  ))}
                </div>

                {/* Review text */}
                <blockquote className="font-sourcesans text-text-secondary text-sm leading-relaxed flex-1 mb-4">
                  "{t.review}"
                </blockquote>

                {/* Patient */}
                <div className="flex items-center justify-between pt-3 border-t border-border-light">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="font-dmsans font-bold text-primary text-xs">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-dmsans font-semibold text-text-primary text-xs">{t.name}</div>
                      <div className="font-sourcesans text-text-secondary text-xs">{t.condition}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <VerifiedSVG small />
                    <span className="font-sourcesans text-text-secondary text-xs">{t.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const VerifiedSVG: React.FC<{ small?: boolean }> = ({ small }) => (
  <svg width={small ? 13 : 16} height={small ? 13 : 16} viewBox="0 0 24 24" fill="none">
    <path d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21.5C16.6 20.5 20 16.4 20 12V7L12 3Z" fill="#2ecc71" fillOpacity="0.15" stroke="#2ecc71" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8.5 12L10.5 14L15.5 9" stroke="#2ecc71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Testimonials;
