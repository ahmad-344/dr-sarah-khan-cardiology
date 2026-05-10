import React, { useState } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { CheckCircleIcon, XCircleIcon, RefreshCwIcon, DownloadIcon } from '../../assets/svgs/Icons';
import { formatDate, formatTime } from '../../utils/helpers';
import { generateAppointmentPDF } from '../../utils/generatePDF';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import Calendar from '../ui/Calendar';
import TimeSlotPicker from '../ui/TimeSlotPicker';
import type { Appointment } from '../../types';

const TYPE_LABELS: Record<string, string> = {
  'in-clinic':       'In-Clinic',
  'teleconsultation':'Teleconsultation',
  'follow-up':       'Follow-up',
  'urgent':          'Urgent',
};

function isMoreThan24hrsAway(apt: Appointment): boolean {
  const diff = new Date(`${apt.date}T${apt.timeSlot}:00`).getTime() - Date.now();
  return diff > 24 * 60 * 60 * 1000;
}

// ── Phone Lookup ──────────────────────────────────────────────
const PhoneLookup: React.FC<{ onLookup: (phone: string) => Promise<boolean>; loading: boolean }> = ({ onLookup, loading }) => {
  const [phone, setPhone] = useState('');
  const [tried, setTried] = useState(false);
  const [found, setFound] = useState<boolean | null>(null);

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setTried(true);
    const result = await onLookup(phone.trim());
    setFound(result);
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-card p-8 text-center max-w-md mx-auto">
      <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="2" width="14" height="20" rx="2" stroke="#0f4c81" strokeWidth="1.5"/>
          <path d="M9 7H15M9 11H15M9 15H12" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="font-merriweather font-bold text-text-primary text-lg mb-2">Find My Appointments</h3>
      <p className="font-sourcesans text-text-secondary text-sm mb-5">
        Enter the phone number you used when booking to view your appointments.
      </p>
      <div className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="+92-319-0539976"
          className="flex-1 px-4 py-2.5 rounded-xl border border-border-light font-sourcesans text-sm outline-none focus:border-primary"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !phone.trim()}
          className="bg-primary text-white font-sourcesans font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>
      {tried && found === false && (
        <p className="mt-3 font-sourcesans text-emergency-red text-sm">
          No appointments found for this number.
        </p>
      )}
    </div>
  );
};

// ── Contact Popup ─────────────────────────────────────────────
const ContactPopup: React.FC<{
  type: 'cancel' | 'reschedule';
  appointmentRef: string;
  onClose: () => void;
}> = ({ type, appointmentRef, onClose }) => {
  const { settings } = useSiteSettings();
  const isCancel = type === 'cancel';
  const phone = settings.contact.phone.replace(/[^0-9+]/g, '');
  const msg = encodeURIComponent(
    `Hi, I would like to ${isCancel ? 'cancel' : 'reschedule'} my appointment.\n\nRef: ${appointmentRef}\n\nPlease confirm.`
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
        <div className={`px-5 py-4 border-b ${isCancel ? 'bg-red-50 border-red-100' : 'bg-secondary border-border-light'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCancel ? 'bg-red-100' : 'bg-primary/10'}`}>
                {isCancel
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#e74c3c" strokeWidth="1.5"/><path d="M9 9L15 15M15 9L9 15" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 4V10H17M1 20V14H7M3.51 9C5.01 5.46 8.41 3 12.41 3C17.21 3 21.21 6.54 21.91 11M20.49 15C18.99 18.54 15.59 21 11.59 21C6.79 21 2.79 17.46 2.09 13" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/></svg>
                }
              </div>
              <div>
                <div className={`font-merriweather font-bold text-sm ${isCancel ? 'text-emergency-red' : 'text-primary'}`}>
                  {isCancel ? 'Cancel Appointment' : 'Reschedule Appointment'}
                </div>
                <div className="font-sourcesans text-text-secondary text-xs">Ref: {appointmentRef}</div>
              </div>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
        <div className="p-5">
          <p className="font-sourcesans text-text-secondary text-sm leading-relaxed mb-4">
            Your appointment is within 24 hours. To {isCancel ? 'cancel' : 'reschedule'}, please contact us directly.
          </p>
          <div className="space-y-2.5">
            <a href={`https://wa.me/${phone}?text=${msg}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white font-sourcesans font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
              <WhatsAppSVG />
              <div className="text-left">
                <div>Contact via WhatsApp</div>
                <div className="text-xs text-green-100">{settings.contact.phone}</div>
              </div>
            </a>
            <a href={`tel:${phone}`}
              className="flex items-center gap-3 w-full bg-secondary border border-border-light hover:border-primary text-primary font-sourcesans font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" stroke="#0f4c81" strokeWidth="1.5"/></svg>
              <div><div>Call Us</div><div className="text-xs text-text-secondary">{settings.contact.phone}</div></div>
            </a>
          </div>
          <p className="mt-4 font-sourcesans text-text-secondary text-xs text-center">
            Clinic hours: Mon–Sat, {settings.clinicHours.weekdays}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Reschedule Modal ──────────────────────────────────────────
const RescheduleModal: React.FC<{
  appointment: Appointment;
  onConfirm: (newDate: string, newTime: string) => void;
  onClose: () => void;
}> = ({ appointment, onConfirm, onClose }) => {
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [newDate, setNewDate] = useState<string | null>(null);
  const [newTime, setNewTime] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-4 animate-slide-up">
        <div className="bg-primary px-5 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <div className="font-dmsans text-blue-200 text-xs uppercase tracking-wider">Reschedule</div>
            <div className="font-merriweather font-bold text-white text-base mt-0.5">Ref: {appointment.referenceNumber}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="mx-5 mt-4 mb-3 bg-secondary rounded-xl p-3 flex gap-4 text-xs font-sourcesans">
          <div><div className="text-text-secondary">Current date</div><div className="font-semibold text-text-primary">{formatDate(appointment.date)}</div></div>
          <div><div className="text-text-secondary">Current time</div><div className="font-semibold text-text-primary">{formatTime(appointment.timeSlot)}</div></div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setStep('date')}
              className={`flex-1 py-2 rounded-lg text-sm font-sourcesans font-semibold transition-colors ${step==='date' ? 'bg-primary text-white' : 'bg-secondary text-text-secondary'}`}>
              1. New Date {newDate && '✓'}
            </button>
            <button onClick={() => newDate && setStep('time')} disabled={!newDate}
              className={`flex-1 py-2 rounded-lg text-sm font-sourcesans font-semibold transition-colors disabled:opacity-40 ${step==='time' ? 'bg-primary text-white' : 'bg-secondary text-text-secondary'}`}>
              2. New Time {newTime && '✓'}
            </button>
          </div>

          {step === 'date' && (
            <Calendar selectedDate={newDate} onSelectDate={d => { setNewDate(d); setNewTime(null); setStep('time'); }} />
          )}

          {step === 'time' && newDate && (
            <TimeSlotPicker selectedTime={newTime} onSelectTime={setNewTime} selectedDate={newDate} />
          )}

          <div className="mt-5 flex gap-2">
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border-light text-text-secondary font-sourcesans text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={() => newDate && newTime && onConfirm(newDate, newTime)} disabled={!newDate || !newTime}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-sourcesans font-bold py-2.5 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2 text-sm">
              <RefreshCwIcon size={16} />Confirm Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────
const MyAppointments: React.FC = () => {
  const { appointments, loading, cancelAppointment, rescheduleAppointment, lookupByPhone, refresh } = useAppointments();
  const { settings } = useSiteSettings();

  const [contactPopup, setContactPopup] = useState<{ type: 'cancel'|'reschedule'; ref: string } | null>(null);
  const [rescheduleFor, setRescheduleFor] = useState<Appointment | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const flash = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 4000); };

  const handleAction = (type: 'cancel' | 'reschedule', apt: Appointment) => {
    if (type === 'cancel') {
      if (isMoreThan24hrsAway(apt)) setConfirmCancel(apt.id);
      else setContactPopup({ type: 'cancel', ref: apt.referenceNumber });
    } else {
      if (isMoreThan24hrsAway(apt)) setRescheduleFor(apt);
      else setContactPopup({ type: 'reschedule', ref: apt.referenceNumber });
    }
  };

  const handleConfirmCancel = async (id: string) => {
    await cancelAppointment(id);
    setConfirmCancel(null);
    flash('Appointment cancelled successfully.');
  };

  const handleConfirmReschedule = async (newDate: string, newTime: string) => {
    if (!rescheduleFor) return;
    await rescheduleAppointment(rescheduleFor.id, newDate, newTime);
    setRescheduleFor(null);
    flash(`Rescheduled to ${formatDate(newDate)} at ${formatTime(newTime)}.`);
  };

  const sorted = [...appointments].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section id="my-appointments" className="py-16 lg:py-20 bg-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-0.5 bg-accent"/>
              <span className="font-dmsans text-accent text-sm font-semibold uppercase tracking-wider">Patient Portal</span>
            </div>
            <h2 className="font-merriweather font-black text-text-primary text-2xl lg:text-3xl">My Appointments</h2>
          </div>
          <div className="flex items-center gap-3">
            {sorted.length > 0 && (
              <span className="font-sourcesans text-text-secondary text-sm flex items-center gap-1.5">
                <span className="bg-primary text-white font-bold px-2.5 py-1 rounded-full text-xs">{sorted.length}</span>
                booking{sorted.length !== 1 ? 's' : ''}
              </span>
            )}
            <button onClick={refresh} disabled={loading}
              className="flex items-center gap-1.5 text-primary border border-primary/30 font-sourcesans font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50">
              <RefreshCwIcon size={13} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="mb-5 flex items-center gap-2 bg-white border border-success/30 text-success px-4 py-3 rounded-xl font-sourcesans text-sm font-semibold shadow-sm">
            <CheckCircleIcon size={18}/>{successMsg}
          </div>
        )}

        {/* Loading */}
        {loading && sorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-border-light shadow-card p-10 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
            <p className="font-sourcesans text-text-secondary text-sm">Loading appointments...</p>
          </div>
        )}

        {/* Empty — show phone lookup */}
        {!loading && sorted.length === 0 && (
          <PhoneLookup onLookup={lookupByPhone} loading={loading} />
        )}

        {/* Appointments list */}
        {sorted.length > 0 && (
          <div className="space-y-4">
            {sorted.map(apt => {
              const isCancelled = apt.status === 'cancelled';
              const isPast = new Date(`${apt.date}T${apt.timeSlot}:00`) < new Date();
              const isCompleted = !isCancelled && isPast;
              const canAct = !isCancelled && !isPast;
              const within24 = canAct && !isMoreThan24hrsAway(apt);

              return (
                <div key={apt.id} className={`bg-white rounded-2xl border shadow-card overflow-hidden transition-all ${isCancelled ? 'opacity-60 border-border-light' : 'border-border-light hover:shadow-card-hover'}`}>
                  <div className={`px-5 py-2.5 flex items-center justify-between ${isCancelled ? 'bg-gray-50' : isCompleted ? 'bg-gray-50' : 'bg-secondary'}`}>
                    <span className="font-dmsans font-semibold text-text-secondary text-xs uppercase tracking-wider">
                      Ref: {apt.referenceNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      {within24 && (
                        <span className="font-sourcesans text-amber-600 bg-amber-50 border border-amber-200 text-xs px-2 py-0.5 rounded-full">
                          Within 24h
                        </span>
                      )}
                      <StatusBadge status={apt.status}/>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <Detail label="Date"  value={formatDate(apt.date)}/>
                      <Detail label="Time"  value={formatTime(apt.timeSlot)}/>
                      <Detail label="Type"  value={TYPE_LABELS[apt.type]||apt.type}/>
                      <Detail label="Fee"   value={'PKR ' + apt.fee.toLocaleString()}/>
                    </div>

                    <div className="pt-3 border-t border-border-light">
                      <div className="font-sourcesans text-text-secondary text-sm mb-3">
                        <span className="font-semibold text-text-primary">{apt.patientName}</span>
                        {apt.reason && <span className="ml-2 text-xs">— {apt.reason.slice(0,60)}{apt.reason.length>60?'…':''}</span>}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => generateAppointmentPDF(apt, settings.contact)}
                          className="inline-flex items-center gap-1.5 bg-secondary border border-border-light text-primary font-sourcesans font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-primary/5 hover:border-primary transition-colors">
                          <DownloadIcon size={13}/>Download PDF
                        </button>

                        {canAct && (
                          <>
                            <button onClick={() => handleAction('reschedule', apt)}
                              className="inline-flex items-center gap-1.5 text-primary border border-primary font-sourcesans font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors">
                              <RefreshCwIcon size={13}/>Reschedule
                            </button>

                            {confirmCancel === apt.id ? (
                              <div className="flex items-center gap-2">
                                <span className="font-sourcesans text-text-secondary text-xs">Cancel this appointment?</span>
                                <button onClick={() => handleConfirmCancel(apt.id)} className="bg-emergency-red text-white font-sourcesans font-bold text-xs px-3 py-1.5 rounded-lg">Yes, Cancel</button>
                                <button onClick={() => setConfirmCancel(null)} className="border border-border-light text-text-secondary font-sourcesans text-xs px-3 py-1.5 rounded-lg">Keep</button>
                              </div>
                            ) : (
                              <button onClick={() => handleAction('cancel', apt)}
                                className="inline-flex items-center gap-1.5 text-emergency-red border border-emergency-red/30 font-sourcesans font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                <XCircleIcon size={13}/>Cancel
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Lookup more appointments */}
            <div className="text-center pt-2">
              <p className="font-sourcesans text-text-secondary text-sm mb-2">Looking for appointments from another number?</p>
              <PhoneLookup onLookup={lookupByPhone} loading={loading} />
            </div>
          </div>
        )}
      </div>

      {contactPopup && (
        <ContactPopup type={contactPopup.type} appointmentRef={contactPopup.ref} onClose={() => setContactPopup(null)}/>
      )}
      {rescheduleFor && (
        <RescheduleModal appointment={rescheduleFor} onConfirm={handleConfirmReschedule} onClose={() => setRescheduleFor(null)}/>
      )}
    </section>
  );
};

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="font-dmsans text-text-secondary text-xs uppercase tracking-wider mb-0.5">{label}</div>
    <div className="font-sourcesans font-semibold text-text-primary text-sm">{value}</div>
  </div>
);

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  pending:       { label: 'Awaiting Confirmation', cls: 'bg-amber-100 text-amber-700' },
  confirmed:     { label: 'Confirmed',             cls: 'bg-success/10 text-success' },
  completed:     { label: 'Completed',             cls: 'bg-blue-100 text-blue-700' },
  cancelled:     { label: 'Cancelled',             cls: 'bg-red-100 text-emergency-red' },
  not_confirmed: { label: 'Not Confirmed',         cls: 'bg-red-100 text-red-700' },
  not_arrived:   { label: 'Did Not Arrive',        cls: 'bg-amber-100 text-amber-700' },
};
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={cfg.cls + " font-dmsans font-bold text-xs px-2.5 py-1 rounded-full"}>{cfg.label}</span>
  );
};

const WhatsAppSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default MyAppointments;
