import React, { useState } from 'react';
import Calendar from '../ui/Calendar';
import TimeSlotPicker from '../ui/TimeSlotPicker';
import ConfirmationCard from '../ui/ConfirmationCard';
import { CheckCircleIcon, VideoIcon, RefreshCwIcon, HospitalIcon, AlertTriangleIcon } from '../../assets/svgs/Icons';
import { useAppointments } from '../../hooks/useAppointments';
import { APPOINTMENT_FEES } from '../../data/constants';
import { generateReferenceNumber, formatDate, formatTime } from '../../utils/helpers';
import type { Appointment, AppointmentType, BookingFormData } from '../../types';
import { usePublicSettings } from '../../hooks/useAdminSettings';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const APPOINTMENT_TYPES: {
  id: AppointmentType;
  label: string;
  desc: string;
  badge?: string;
  Icon: React.FC<{ className?: string; size?: number }>;
}[] = [
  { id: 'in-clinic', label: 'In-Clinic Visit', desc: 'Consultation at hospital', badge: 'Most Popular', Icon: HospitalIcon },
  { id: 'teleconsultation', label: 'Teleconsultation', desc: 'Secure video call', Icon: VideoIcon },
  { id: 'follow-up', label: 'Follow-up Visit', desc: 'Existing patient follow-up', Icon: RefreshCwIcon },
  { id: 'urgent', label: 'Urgent Consultation', desc: 'Priority same-day slot', Icon: AlertTriangleIcon },
];

const INITIAL_FORM: BookingFormData = {
  step: 1,
  appointmentType: null,
  selectedDate: null,
  selectedTime: null,
  patientName: '',
  patientAge: '',
  patientGender: '',
  phone: '',
  email: '',
  patientType: '',
  reason: '',
  hasReports: null,
};

const STEP_LABELS = ['Appointment Type', 'Select Date', 'Select Time', 'Your Details'];

interface AppointmentsBookingProps {
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AppointmentsBooking: React.FC<AppointmentsBookingProps> = ({ scrollRef }) => {
  const [form, setForm] = useState<BookingFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const { saveAppointment } = useAppointments();
  const adminSettings = usePublicSettings();
  const { settings: siteSettings } = useSiteSettings();
  const FEES = { "in-clinic": siteSettings.fees.inClinic, "teleconsultation": siteSettings.fees.teleconsultation, "follow-up": siteSettings.fees.followUp, "urgent": siteSettings.fees.urgent };

  const validateStep = (step: number): boolean => {
    const newErrors: typeof errors = {};
    if (step === 1 && !form.appointmentType) newErrors.appointmentType = 'Please select an appointment type.';
    if (step === 2 && !form.selectedDate) newErrors.selectedDate = 'Please choose a date.';
    if (step === 3 && !form.selectedTime) newErrors.selectedTime = 'Please choose a time slot.';
    if (step === 4) {
      if (!form.patientName.trim()) newErrors.patientName = 'Full name is required.';
      if (!form.patientAge || isNaN(Number(form.patientAge)) || Number(form.patientAge) < 1 || Number(form.patientAge) > 120)
        newErrors.patientAge = 'Enter a valid age.';
      if (!form.patientGender) newErrors.patientGender = 'Please select a gender.';
      if (!form.phone.trim() || !/^[0-9+\-\s]{10,15}$/.test(form.phone.trim()))
        newErrors.phone = 'Enter a valid phone number.';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = 'Enter a valid email address.';
      if (!form.patientType) newErrors.patientType = 'Please select patient type.';
      if (!form.reason.trim()) newErrors.reason = 'Please briefly describe your reason for visit.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(form.step)) {
      setForm(f => ({ ...f, step: f.step + 1 }));
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const prevStep = () => {
    setForm(f => ({ ...f, step: Math.max(1, f.step - 1) }));
  };

  const handleSubmit = () => {
    if (!validateStep(4)) return;
    const apt: Appointment = {
      id: `${Date.now()}`,
      referenceNumber: generateReferenceNumber(),
      type: form.appointmentType!,
      date: form.selectedDate!,
      timeSlot: form.selectedTime!,
      patientName: form.patientName,
      patientAge: form.patientAge,
      patientGender: form.patientGender as 'male' | 'female' | 'other',
      phone: form.phone,
      email: form.email,
      patientType: form.patientType as 'new' | 'returning',
      reason: form.reason,
      hasReports: form.hasReports || false,
      status: 'pending',
      createdAt: new Date().toISOString(),
      fee: FEES[form.appointmentType! as keyof typeof FEES],
    };
    saveAppointment(apt);
    setConfirmedAppointment(apt);
    // Tell TimeSlotPicker to re-fetch booked slots for this date
    window.dispatchEvent(new CustomEvent('appointment-saved', { detail: { date: apt.date } }));
  };

  const resetBooking = () => {
    setForm(INITIAL_FORM);
    setConfirmedAppointment(null);
    setErrors({});
  };

  return (
    <section id="appointments" className="py-16 lg:py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-accent" />
            <span className="font-dmsans text-accent text-sm font-semibold uppercase tracking-wider">Online Booking</span>
            <div className="w-8 h-0.5 bg-accent" />
          </div>
          <h2 className="font-merriweather font-black text-text-primary text-3xl lg:text-4xl mb-3">
            Book Your Appointment
          </h2>
          <p className="font-sourcesans text-text-secondary text-base max-w-lg mx-auto">
            Choose a convenient time — confirmed instantly. No waiting on hold.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* LEFT: info panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5">
              <h3 className="font-merriweather font-bold text-text-primary text-base mb-4">Why Book Online?</h3>
              <div className="space-y-3">
                {[
                  'Instant online confirmation',
                  'SMS & email reminder sent automatically',
                  'Easy rescheduling or cancellation',
                  'Teleconsultation available from home',
                ].map(b => (
                  <div key={b} className="flex items-start gap-2.5">
                    <CheckCircleIcon className="text-success flex-shrink-0 mt-0.5" size={18} />
                    <span className="font-sourcesans text-text-secondary text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fees */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5">
              <h3 className="font-merriweather font-bold text-text-primary text-base mb-4">Consultation Fees</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'In-Clinic Visit', fee: 'PKR ' + siteSettings.fees.inClinic.toLocaleString(), highlight: true },
                  { label: 'Follow-up Visit', fee: 'PKR ' + siteSettings.fees.followUp.toLocaleString(), highlight: false },
                  { label: 'Teleconsultation', fee: 'PKR ' + siteSettings.fees.teleconsultation.toLocaleString(), highlight: false },
                  { label: 'Urgent Consultation', fee: 'PKR ' + siteSettings.fees.urgent.toLocaleString(), highlight: false },
                ].map(f => (
                  <div key={f.label} className={`flex justify-between items-center py-2 px-3 rounded-lg ${f.highlight ? 'bg-secondary' : ''}`}>
                    <span className="font-sourcesans text-text-secondary text-sm">{f.label}</span>
                    <span className="font-dmsans font-bold text-primary text-sm">{f.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance */}
            <div className="bg-white rounded-2xl border border-border-light shadow-card p-5">
              <h3 className="font-merriweather font-bold text-text-primary text-base mb-3">Accepted Insurance</h3>
              <p className="font-sourcesans text-text-secondary text-sm mb-4">We work with all major insurance providers in Pakistan.</p>
              <div className="flex flex-wrap gap-2">
                {siteSettings.insuranceProviders.map(ins => (
                  <span key={ins} className="bg-secondary text-primary font-dmsans font-semibold text-xs px-3 py-1.5 rounded-full border border-border-light">
                    {ins}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-emergency-red/5 border border-emergency-red/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangleIcon className="text-emergency-red" size={18} />
                <span className="font-dmsans font-bold text-emergency-red text-sm">Cardiac Emergency?</span>
              </div>
              <p className="font-sourcesans text-text-secondary text-sm mb-3">Do not book online — call immediately.</p>
              <a href="tel:1122" className="inline-flex items-center gap-2 bg-emergency-red text-white font-sourcesans font-bold text-sm px-4 py-2.5 rounded-lg w-full justify-center hover:bg-red-700 transition-colors">
                Call 1122 — Emergency
              </a>
            </div>
          </div>

          {/* RIGHT: booking form */}
          <div className="lg:col-span-3">
            {!adminSettings.clinicOpen && (
              <div className="mb-5 bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18C1.55 18.48 1.55 19.07 1.82 19.55C2.09 20.03 2.59 20.32 3.12 20.32H20.08C20.61 20.32 21.11 20.03 21.38 19.55C21.65 19.07 21.65 18.48 21.38 18L12.91 3.86C12.64 3.38 12.14 3.09 11.6 3.09C11.06 3.09 10.56 3.38 10.29 3.86Z" stroke="#d97706" strokeWidth="1.5"/><line x1="12" y1="9" x2="12" y2="13" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="17" r="0.5" fill="#d97706" stroke="#d97706"/></svg>
                <div>
                  <div className="font-dmsans font-bold text-amber-800 text-sm">Online Booking Temporarily Unavailable</div>
                  <p className="font-sourcesans text-amber-700 text-sm mt-1">The online booking system is currently paused. Please call <a href="tel:+923190539976" className="font-bold underline">+92-319-0539976</a> to book your appointment directly.</p>
                </div>
              </div>
            )}
            <div className={`bg-white rounded-2xl border-2 border-primary/20 shadow-card-hover overflow-hidden ${!adminSettings.clinicOpen ? 'opacity-50 pointer-events-none select-none' : ''}`}>
              {!confirmedAppointment ? (
                <>
                  {/* Progress bar */}
                  <div className="px-6 pt-6 pb-4 border-b border-border-light">
                    <div className="flex items-center gap-1 mb-3">
                      {STEP_LABELS.map((label, i) => {
                        const step = i + 1;
                        const isDone = form.step > step;
                        const isActive = form.step === step;
                        return (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone ? 'bg-success text-white' : isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {isDone ? <CheckSVG /> : step}
                              </div>
                              <span className={`text-xs mt-1 font-sourcesans hidden sm:block ${isActive ? 'text-primary font-semibold' : 'text-gray-400'}`}>{label}</span>
                            </div>
                            {i < STEP_LABELS.length - 1 && (
                              <div className={`flex-1 h-0.5 transition-all mx-1 ${isDone ? 'bg-success' : 'bg-gray-100'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="p-6">
                    {/* Step 1 */}
                    {form.step === 1 && (
                      <div>
                        <h3 className="font-merriweather font-bold text-text-primary text-lg mb-1">Select Appointment Type</h3>
                        <p className="font-sourcesans text-text-secondary text-sm mb-5">Choose the type of consultation you need.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {APPOINTMENT_TYPES.map(type => {
                            const isSelected = form.appointmentType === type.id;
                            return (
                              <button
                                key={type.id}
                                onClick={() => setForm(f => ({ ...f, appointmentType: type.id }))}
                                className={`relative text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                                  isSelected ? 'border-primary bg-secondary shadow-md' : 'border-border-light hover:border-primary/50 hover:bg-gray-50/50'
                                }`}
                                aria-pressed={isSelected}
                              >
                                {type.badge && (
                                  <span className="absolute -top-2.5 right-3 bg-accent text-white font-dmsans font-bold text-xs px-2 py-0.5 rounded-full">
                                    {type.badge}
                                  </span>
                                )}
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 transition-colors ${isSelected ? 'bg-primary' : 'bg-secondary'}`}>
                                  <type.Icon className={isSelected ? 'text-white' : 'text-primary'} size={18} />
                                </div>
                                <div className="font-dmsans font-semibold text-text-primary text-sm">{type.label}</div>
                                <div className="font-sourcesans text-text-secondary text-xs mt-0.5">{type.desc}</div>
                                <div className={`mt-2 font-dmsans font-bold text-sm ${isSelected ? 'text-primary' : 'text-text-secondary'}`}>
                                  PKR {FEES[type.id].toLocaleString()}
                                </div>
                                {type.id === 'teleconsultation' && (
                                  <div className="mt-1.5 text-xs text-accent font-sourcesans">Video link sent to email</div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {errors.appointmentType && <p className="mt-2 text-emergency-red text-xs font-sourcesans">{errors.appointmentType}</p>}
                      </div>
                    )}

                    {/* Step 2 */}
                    {form.step === 2 && (
                      <div>
                        <h3 className="font-merriweather font-bold text-text-primary text-lg mb-1">Select a Date</h3>
                        <p className="font-sourcesans text-text-secondary text-sm mb-4">Available dates for the next 30 days are shown below.</p>
                        <Calendar
                          selectedDate={form.selectedDate}
                          onSelectDate={date => setForm(f => ({ ...f, selectedDate: date }))}
                        />
                        {form.selectedDate && (
                          <div className="mt-3 p-3 bg-secondary rounded-xl flex items-center gap-2">
                            <CheckCircleIcon className="text-success" size={18} />
                            <span className="font-sourcesans text-text-primary text-sm font-semibold">{formatDate(form.selectedDate)}</span>
                          </div>
                        )}
                        {errors.selectedDate && <p className="mt-2 text-emergency-red text-xs font-sourcesans">{errors.selectedDate}</p>}
                      </div>
                    )}

                    {/* Step 3 */}
                    {form.step === 3 && (
                      <div>
                        <h3 className="font-merriweather font-bold text-text-primary text-lg mb-1">Select a Time Slot</h3>
                        <p className="font-sourcesans text-text-secondary text-sm mb-4">
                          {form.selectedDate ? `Available slots for ${formatDate(form.selectedDate)}` : 'Choose your preferred time.'}
                        </p>
                        <TimeSlotPicker
                          selectedTime={form.selectedTime}
                          onSelectTime={time => setForm(f => ({ ...f, selectedTime: time }))}
                          selectedDate={form.selectedDate}
                        />
                        {form.selectedTime && (
                          <div className="mt-4 p-3 bg-secondary rounded-xl flex items-center gap-2">
                            <CheckCircleIcon className="text-success" size={18} />
                            <span className="font-sourcesans text-text-primary text-sm font-semibold">
                              Selected: {formatTime(form.selectedTime)}
                            </span>
                          </div>
                        )}
                        {errors.selectedTime && <p className="mt-2 text-emergency-red text-xs font-sourcesans">{errors.selectedTime}</p>}
                      </div>
                    )}

                    {/* Step 4 */}
                    {form.step === 4 && (
                      <div>
                        <h3 className="font-merriweather font-bold text-text-primary text-lg mb-1">Your Details</h3>
                        <p className="font-sourcesans text-text-secondary text-sm mb-5">Please provide accurate information for your appointment.</p>

                        {/* Summary strip */}
                        <div className="bg-secondary rounded-xl p-3 mb-5 grid grid-cols-3 gap-2 text-center">
                          {[
                            { label: 'Type', value: APPOINTMENT_TYPES.find(t => t.id === form.appointmentType)?.label || '' },
                            { label: 'Date', value: form.selectedDate ? new Date(form.selectedDate + 'T00:00:00').toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : '' },
                            { label: 'Time', value: form.selectedTime ? formatTime(form.selectedTime) : '' },
                          ].map(s => (
                            <div key={s.label}>
                              <div className="font-dmsans text-text-secondary text-xs">{s.label}</div>
                              <div className="font-sourcesans font-semibold text-primary text-xs mt-0.5">{s.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name *" error={errors.patientName}>
                              <input
                                type="text"
                                placeholder="e.g. Fatima Ahmed"
                                value={form.patientName}
                                onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))}
                                className={inputCls(!!errors.patientName)}
                                aria-label="Full name"
                              />
                            </Field>
                            <Field label="Age *" error={errors.patientAge}>
                              <input
                                type="number"
                                placeholder="e.g. 45"
                                min={1} max={120}
                                value={form.patientAge}
                                onChange={e => setForm(f => ({ ...f, patientAge: e.target.value }))}
                                className={inputCls(!!errors.patientAge)}
                                aria-label="Age"
                              />
                            </Field>
                          </div>

                          <Field label="Gender *" error={errors.patientGender}>
                            <div className="flex gap-3" role="radiogroup" aria-label="Gender">
                              {(['male', 'female', 'other'] as const).map(g => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="gender"
                                    value={g}
                                    checked={form.patientGender === g}
                                    onChange={() => setForm(f => ({ ...f, patientGender: g }))}
                                    className="accent-primary w-4 h-4"
                                  />
                                  <span className="font-sourcesans text-text-primary text-sm capitalize">{g}</span>
                                </label>
                              ))}
                            </div>
                          </Field>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Phone Number *" error={errors.phone}>
                              <input
                                type="tel"
                                placeholder="+92-300-1234567"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                className={inputCls(!!errors.phone)}
                                aria-label="Phone number"
                              />
                            </Field>
                            <Field label="Email Address" error={errors.email}>
                              <input
                                type="email"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                className={inputCls(!!errors.email)}
                                aria-label="Email address"
                              />
                            </Field>
                          </div>

                          <Field label="Patient Type *" error={errors.patientType}>
                            <div className="flex gap-3">
                              {(['new', 'returning'] as const).map(pt => (
                                <button
                                  key={pt}
                                  type="button"
                                  onClick={() => setForm(f => ({ ...f, patientType: pt }))}
                                  className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-sourcesans font-semibold capitalize transition-all ${
                                    form.patientType === pt ? 'border-primary bg-secondary text-primary' : 'border-border-light text-text-secondary hover:border-primary/50'
                                  }`}
                                  aria-pressed={form.patientType === pt}
                                >
                                  {pt === 'new' ? 'New Patient' : 'Returning Patient'}
                                </button>
                              ))}
                            </div>
                          </Field>

                          <Field label="Reason for Visit *" error={errors.reason}>
                            <textarea
                              rows={3}
                              placeholder="Briefly describe your symptoms or reason for consultation..."
                              value={form.reason}
                              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                              className={`${inputCls(!!errors.reason)} resize-none`}
                              aria-label="Reason for visit"
                            />
                          </Field>

                          <Field label="Do you have any reports or test results?">
                            <div className="flex gap-3">
                              {([true, false] as const).map(val => (
                                <button
                                  key={String(val)}
                                  type="button"
                                  onClick={() => setForm(f => ({ ...f, hasReports: val }))}
                                  className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-sm font-sourcesans font-semibold transition-all ${
                                    form.hasReports === val ? 'border-primary bg-secondary text-primary' : 'border-border-light text-text-secondary hover:border-primary/50'
                                  }`}
                                  aria-pressed={form.hasReports === val}
                                >
                                  {val ? 'Yes, I have reports' : 'No reports yet'}
                                </button>
                              ))}
                            </div>
                            {form.hasReports && (
                              <p className="mt-2 text-xs font-sourcesans text-accent bg-accent/5 rounded-lg px-3 py-2">
                                Please bring all reports, ECGs, and test results to your appointment.
                              </p>
                            )}
                          </Field>
                        </div>
                      </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex items-center gap-3 mt-8 pt-5 border-t border-border-light">
                      {form.step > 1 && (
                        <button
                          onClick={prevStep}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border-light text-text-secondary font-sourcesans font-semibold text-sm hover:border-primary hover:text-primary transition-all"
                        >
                          <BackSVG /> Back
                        </button>
                      )}
                      {form.step < 4 ? (
                        <button
                          onClick={nextStep}
                          className="flex-1 bg-primary hover:bg-primary-dark text-white font-sourcesans font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          className="flex-1 bg-primary hover:bg-primary-dark text-white font-sourcesans font-bold py-3.5 rounded-xl text-base transition-all hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <CheckSVG2 />
                          Confirm Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <ConfirmationCard
                    appointment={confirmedAppointment}
                    onNewBooking={resetBooking}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const inputCls = (hasError: boolean) =>
  `w-full px-4 py-2.5 rounded-lg border font-sourcesans text-text-primary text-sm outline-none transition-all ${
    hasError ? 'border-emergency-red bg-red-50 focus:ring-1 focus:ring-emergency-red' : 'border-border-light focus:border-primary focus:ring-1 focus:ring-primary/30 bg-white'
  }`;

const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div>
    <label className="block font-dmsans font-semibold text-text-primary text-xs uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-emergency-red text-xs font-sourcesans">{error}</p>}
  </div>
);

const CheckSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CheckSVG2 = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const BackSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default AppointmentsBooking;
