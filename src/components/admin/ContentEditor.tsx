import React, { useState } from 'react';
import type { SiteSettings, ReviewItem, ServiceItem } from '../../types/siteSettings';

interface ContentEditorProps {
  settings: SiteSettings;
  saving: boolean;
  onSave: (updated: SiteSettings) => Promise<void>;
}

type ContentTab = 'contact' | 'doctor' | 'fees' | 'services' | 'reviews' | 'insurance';

const ContentEditor: React.FC<ContentEditorProps> = ({ settings, saving, onSave }) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('contact');
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  // Reset draft when settings change externally
  React.useEffect(() => { setDraft(settings); }, [settings]);

  const handleSave = async () => {
    await onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (path: string, value: unknown) => {
    setDraft(prev => {
      const parts = path.split('.');
      const next = { ...prev } as Record<string, unknown>;
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...(cur[parts[i]] as Record<string, unknown>) };
        cur = cur[parts[i]] as Record<string, unknown>;
      }
      cur[parts[parts.length - 1]] = value;
      return next as unknown as SiteSettings;
    });
  };

  const contentTabs: { id: ContentTab; label: string }[] = [
    { id: 'contact',   label: 'Contact & Hours' },
    { id: 'doctor',    label: 'Doctor Info' },
    { id: 'fees',      label: 'Fees' },
    { id: 'services',  label: 'Services' },
    { id: 'reviews',   label: 'Reviews' },
    { id: 'insurance', label: 'Insurance' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-merriweather font-bold text-text-primary text-xl">Website Content</h2>
          <p className="font-sourcesans text-text-secondary text-sm mt-1">
            Changes save to database and reflect on the website instantly.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-sourcesans font-bold text-sm transition-all ${
            saved ? 'bg-success text-white' : 'bg-primary hover:bg-primary-dark text-white disabled:opacity-60'
          }`}
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
          ) : saved ? (
            <><SavedSVG />Saved!</>
          ) : (
            <><SaveSVG />Save Changes</>
          )}
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-secondary rounded-xl p-1">
        {contentTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg font-sourcesans font-semibold text-sm transition-all ${
              activeTab === t.id ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTACT & HOURS ── */}
      {activeTab === 'contact' && (
        <div className="space-y-5">
          <Card title="Contact Information">
            <Row label="Phone Number">
              <Input value={draft.contact.phone} onChange={v => update('contact.phone', v)} placeholder="+92-319-..." />
            </Row>
            <Row label="Email Address">
              <Input value={draft.contact.email} onChange={v => update('contact.email', v)} placeholder="email@..." />
            </Row>
            <Row label="Emergency Line">
              <Input value={draft.contact.emergencyLine} onChange={v => update('contact.emergencyLine', v)} placeholder="1122" />
            </Row>
            <Row label="Full Address">
              <Textarea value={draft.contact.address} onChange={v => update('contact.address', v)} rows={2} />
            </Row>
            <Row label="Google Maps Embed URL">
              <Textarea value={draft.contact.mapUrl} onChange={v => update('contact.mapUrl', v)} rows={3}
                placeholder="https://www.google.com/maps/embed?pb=..." />
              <p className="text-xs text-text-secondary mt-1">Google Maps → Share → Embed a map → copy the src="..." URL</p>
            </Row>
          </Card>

          <Card title="Clinic Hours">
            <Row label="Mon – Fri">
              <Input value={draft.clinicHours.weekdays} onChange={v => update('clinicHours.weekdays', v)} placeholder="9:00 AM – 5:00 PM" />
            </Row>
            <Row label="Saturday">
              <Input value={draft.clinicHours.saturday} onChange={v => update('clinicHours.saturday', v)} placeholder="9:00 AM – 1:00 PM" />
            </Row>
            <Row label="Sunday">
              <Input value={draft.clinicHours.sunday} onChange={v => update('clinicHours.sunday', v)} placeholder="Closed" />
            </Row>
            <Row label="Emergency">
              <Input value={draft.clinicHours.emergency} onChange={v => update('clinicHours.emergency', v)} placeholder="24 / 7" />
            </Row>
          </Card>
        </div>
      )}

      {/* ── DOCTOR INFO ── */}
      {activeTab === 'doctor' && (
        <div className="space-y-5">
          <Card title="Basic Information">
            <Row label="Doctor Name">
              <Input value={draft.doctor.name} onChange={v => update('doctor.name', v)} />
            </Row>
            <Row label="Title / Specialty">
              <Input value={draft.doctor.title} onChange={v => update('doctor.title', v)} placeholder="Interventional Cardiologist" />
            </Row>
            <Row label="Years of Experience">
              <Input value={draft.doctor.experience} onChange={v => update('doctor.experience', v)} placeholder="18" />
            </Row>
            <Row label="Credentials (header line)">
              <Input value={draft.doctor.credentials} onChange={v => update('doctor.credentials', v)} placeholder="MBBS | FCPS | Fellow" />
            </Row>
            <Row label="Hero Tagline">
              <Textarea value={draft.doctor.tagline} onChange={v => update('doctor.tagline', v)} rows={2} />
            </Row>
            <Row label="Patient Philosophy (About quote)">
              <Textarea value={draft.doctor.philosophy} onChange={v => update('doctor.philosophy', v)} rows={2} />
            </Row>
            <Row label="Publications Count">
              <Input value={draft.doctor.publications} onChange={v => update('doctor.publications', v)} placeholder="28+" />
            </Row>
          </Card>

          <Card title="Education & Training">
            {draft.doctor.education.map((edu, i) => (
              <div key={i} className="p-3 bg-secondary rounded-xl mb-2">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <Label text="Year" />
                    <Input value={edu.year} onChange={v => {
                      const arr = [...draft.doctor.education];
                      arr[i] = { ...arr[i], year: v };
                      update('doctor.education', arr);
                    }} placeholder="2005" />
                  </div>
                  <div className="col-span-2">
                    <Label text="Degree" />
                    <Input value={edu.degree} onChange={v => {
                      const arr = [...draft.doctor.education];
                      arr[i] = { ...arr[i], degree: v };
                      update('doctor.education', arr);
                    }} placeholder="MBBS" />
                  </div>
                </div>
                <Label text="Institution" />
                <div className="flex gap-2">
                  <Input value={edu.institution} onChange={v => {
                    const arr = [...draft.doctor.education];
                    arr[i] = { ...arr[i], institution: v };
                    update('doctor.education', arr);
                  }} placeholder="University name" />
                  <button onClick={() => update('doctor.education', draft.doctor.education.filter((_, j) => j !== i))}
                    className="flex-shrink-0 text-red-400 hover:text-red-600 text-xs px-2 py-1 border border-red-200 rounded-lg">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <AddButton label="Add Education" onClick={() => update('doctor.education', [...draft.doctor.education, { year: '', degree: '', institution: '' }])} />
          </Card>

          <Card title="Awards">
            {draft.doctor.awards.map((award, i) => (
              <div key={i} className="p-3 bg-secondary rounded-xl mb-2">
                <Label text="Award Title" />
                <Input value={award.title} onChange={v => {
                  const arr = [...draft.doctor.awards];
                  arr[i] = { ...arr[i], title: v };
                  update('doctor.awards', arr);
                }} placeholder="Best Cardiologist Award" />
                <Label text="Issuing Body & Year" />
                <div className="flex gap-2">
                  <Input value={award.body} onChange={v => {
                    const arr = [...draft.doctor.awards];
                    arr[i] = { ...arr[i], body: v };
                    update('doctor.awards', arr);
                  }} placeholder="HEC — 2022" />
                  <button onClick={() => update('doctor.awards', draft.doctor.awards.filter((_, j) => j !== i))}
                    className="flex-shrink-0 text-red-400 hover:text-red-600 text-xs px-2 py-1 border border-red-200 rounded-lg">Remove</button>
                </div>
              </div>
            ))}
            <AddButton label="Add Award" onClick={() => update('doctor.awards', [...draft.doctor.awards, { title: '', body: '' }])} />
          </Card>

          <Card title="Professional Memberships">
            {draft.doctor.memberships.map((m, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input value={m} onChange={v => {
                  const arr = [...draft.doctor.memberships];
                  arr[i] = v;
                  update('doctor.memberships', arr);
                }} placeholder="Membership name" />
                <button onClick={() => update('doctor.memberships', draft.doctor.memberships.filter((_, j) => j !== i))}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 text-xs px-2 py-1 border border-red-200 rounded-lg">Remove</button>
              </div>
            ))}
            <AddButton label="Add Membership" onClick={() => update('doctor.memberships', [...draft.doctor.memberships, ''])} />
          </Card>
        </div>
      )}

      {/* ── FEES ── */}
      {activeTab === 'fees' && (
        <Card title="Consultation Fees (PKR)">
          <Row label="In-Clinic Visit">
            <NumberInput value={draft.fees.inClinic} onChange={v => update('fees.inClinic', v)} />
          </Row>
          <Row label="Follow-up Visit">
            <NumberInput value={draft.fees.followUp} onChange={v => update('fees.followUp', v)} />
          </Row>
          <Row label="Teleconsultation">
            <NumberInput value={draft.fees.teleconsultation} onChange={v => update('fees.teleconsultation', v)} />
          </Row>
          <Row label="Urgent Consultation">
            <NumberInput value={draft.fees.urgent} onChange={v => update('fees.urgent', v)} />
          </Row>
        </Card>
      )}

      {/* ── SERVICES ── */}
      {activeTab === 'services' && (
        <div className="space-y-3">
          <p className="font-sourcesans text-text-secondary text-sm">Edit the 6 specialties shown on the website.</p>
          {draft.services.map((svc, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border-light shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{i+1}</div>
                <span className="font-dmsans font-semibold text-text-primary text-sm">{svc.title || 'New Service'}</span>
              </div>
              <Label text="Service Title" />
              <Input value={svc.title} onChange={v => {
                const arr = [...draft.services] as ServiceItem[];
                arr[i] = { ...arr[i], title: v };
                update('services', arr);
              }} placeholder="Service name" />
              <Label text="Description" />
              <Textarea value={svc.description} onChange={v => {
                const arr = [...draft.services] as ServiceItem[];
                arr[i] = { ...arr[i], description: v };
                update('services', arr);
              }} rows={2} placeholder="Brief description..." />
            </div>
          ))}
        </div>
      )}

      {/* ── REVIEWS ── */}
      {activeTab === 'reviews' && (
        <div className="space-y-3">
          <p className="font-sourcesans text-text-secondary text-sm">Manage patient testimonials shown on the website.</p>
          {draft.reviews.map((rev, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border-light shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {rev.name?.charAt(0) || '?'}
                  </div>
                  <span className="font-dmsans font-semibold text-text-primary text-sm">{rev.name || 'New Review'}</span>
                </div>
                <button
                  onClick={() => update('reviews', draft.reviews.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 text-xs px-2 py-1 border border-red-200 rounded-lg font-sourcesans"
                >Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label text="Patient Name" />
                  <Input value={rev.name} onChange={v => {
                    const arr = [...draft.reviews] as ReviewItem[];
                    arr[i] = { ...arr[i], name: v };
                    update('reviews', arr);
                  }} placeholder="Name" />
                </div>
                <div>
                  <Label text="Rating (1–5)" />
                  <select
                    value={rev.rating}
                    onChange={e => {
                      const arr = [...draft.reviews] as ReviewItem[];
                      arr[i] = { ...arr[i], rating: parseInt(e.target.value) };
                      update('reviews', arr);
                    }}
                    className="w-full px-3 py-2.5 rounded-lg border border-border-light font-sourcesans text-text-primary text-sm outline-none focus:border-primary"
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div>
                  <Label text="Condition / Category" />
                  <Input value={rev.condition} onChange={v => {
                    const arr = [...draft.reviews] as ReviewItem[];
                    arr[i] = { ...arr[i], condition: v };
                    update('reviews', arr);
                  }} placeholder="e.g. Heart Failure Patient" />
                </div>
                <div>
                  <Label text="Date (display text)" />
                  <Input value={rev.date} onChange={v => {
                    const arr = [...draft.reviews] as ReviewItem[];
                    arr[i] = { ...arr[i], date: v };
                    update('reviews', arr);
                  }} placeholder="January 2025" />
                </div>
              </div>
              <Label text="Review Text" />
              <Textarea value={rev.review} onChange={v => {
                const arr = [...draft.reviews] as ReviewItem[];
                arr[i] = { ...arr[i], review: v };
                update('reviews', arr);
              }} rows={3} placeholder="Patient review..." />
            </div>
          ))}
          <AddButton label="Add Review" onClick={() => update('reviews', [...draft.reviews, { name: '', rating: 5, review: '', date: '', condition: '' }])} />
        </div>
      )}

      {/* ── INSURANCE ── */}
      {activeTab === 'insurance' && (
        <Card title="Insurance Providers">
          <p className="font-sourcesans text-text-secondary text-sm mb-4">These appear on the booking form and website.</p>
          {draft.insuranceProviders.map((ins, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input value={ins} onChange={v => {
                const arr = [...draft.insuranceProviders];
                arr[i] = v;
                update('insuranceProviders', arr);
              }} placeholder="Insurance provider name" />
              <button onClick={() => update('insuranceProviders', draft.insuranceProviders.filter((_, j) => j !== i))}
                className="flex-shrink-0 text-red-400 hover:text-red-600 text-xs px-2 py-1 border border-red-200 rounded-lg">Remove</button>
            </div>
          ))}
          <AddButton label="Add Provider" onClick={() => update('insuranceProviders', [...draft.insuranceProviders, ''])} />
        </Card>
      )}

      {/* Bottom save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-sourcesans font-bold text-sm transition-all ${
            saved ? 'bg-success text-white' : 'bg-primary hover:bg-primary-dark text-white disabled:opacity-60'
          }`}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

// ── Small reusable UI ─────────────────────────────────────────
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
    <div className="px-5 py-3 bg-secondary border-b border-border-light">
      <h3 className="font-merriweather font-bold text-text-primary text-sm">{title}</h3>
    </div>
    <div className="p-5 space-y-3">{children}</div>
  </div>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <Label text={label} />
    {children}
  </div>
);

const Label: React.FC<{ text: string }> = ({ text }) => (
  <div className="font-dmsans font-semibold text-text-secondary text-xs uppercase tracking-wider mb-1 mt-2">{text}</div>
);

const Input: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2.5 rounded-lg border border-border-light font-sourcesans text-text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
  />
);

const Textarea: React.FC<{ value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }> = ({ value, onChange, rows = 3, placeholder }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className="w-full px-3 py-2.5 rounded-lg border border-border-light font-sourcesans text-text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white resize-none"
  />
);

const NumberInput: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <input
    type="number"
    value={value}
    onChange={e => onChange(parseInt(e.target.value) || 0)}
    className="w-full px-3 py-2.5 rounded-lg border border-border-light font-sourcesans text-text-primary text-sm outline-none focus:border-primary bg-white"
    min={0}
  />
);

const AddButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-primary border border-primary/30 font-sourcesans font-semibold text-xs px-3 py-2 rounded-lg hover:bg-secondary transition-colors mt-2"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    {label}
  </button>
);

const SaveSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16L21 8V19C21 20.1 20.1 21 19 21Z" stroke="white" strokeWidth="1.5"/>
    <path d="M17 21V13H7V21M7 3V8H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SavedSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ContentEditor;
