import React from 'react';
import { CheckCircleIcon, DownloadIcon, PlusCircleIcon } from '../../assets/svgs/Icons';
import type { Appointment } from '../../types';
import { formatDate, formatTime, getEndTime } from '../../utils/helpers';
import { generateAppointmentPDF } from '../../utils/generatePDF';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface ConfirmationCardProps {
  appointment: Appointment;
  onNewBooking: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  'in-clinic':       'In-Clinic Visit',
  'teleconsultation':'Teleconsultation (Video)',
  'follow-up':       'Follow-up Visit',
  'urgent':          'Urgent Consultation',
};

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ appointment, onNewBooking }) => {

  // ── Calendar helpers ─────────────────────────────────────────
  const getCalendarTimes = () => {
    const startDate = appointment.date.replace(/-/g, '');
    const [h, m]    = appointment.timeSlot.split(':').map(Number);
    const startTime = `${String(h).padStart(2,'0')}${String(m).padStart(2,'0')}00`;
    const endH      = h + (m + 30 >= 60 ? 1 : 0);
    const endM      = (m + 30) % 60;
    const endTime   = `${String(endH).padStart(2,'0')}${String(endM).padStart(2,'0')}00`;
    return { startDate, startTime, endTime };
  };

  const { settings } = useSiteSettings();

  const handleGoogleCalendar = () => {
    const { startDate, startTime, endTime } = getCalendarTimes();
    const title    = encodeURIComponent('Appointment — Dr. Sarah Khan');
    const details  = encodeURIComponent(
      `${TYPE_LABELS[appointment.type]}\nRef: ${appointment.referenceNumber}\nFee: PKR ${appointment.fee.toLocaleString()}\nPhone: ${appointment.phone}`
    );
    const location = encodeURIComponent('Islamabad Heart Institute, G-8/4, Islamabad');
    const dates    = `${startDate}T${startTime}/${startDate}T${endTime}`;
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`,
      '_blank'
    );
  };

  const handleIcsDownload = () => {
    const { startDate, startTime, endTime } = getCalendarTimes();
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0',
      'PRODID:-//Dr Sarah Khan//Appointment//EN',
      'BEGIN:VEVENT',
      `DTSTART:${startDate}T${startTime}`,
      `DTEND:${startDate}T${endTime}`,
      'SUMMARY:Appointment — Dr. Sarah Khan',
      `DESCRIPTION:${TYPE_LABELS[appointment.type]} | Ref: ${appointment.referenceNumber} | Fee: PKR ${appointment.fee.toLocaleString()}`,
      'LOCATION:Islamabad Heart Institute\\, G-8/4\\, Islamabad',
      'STATUS:CONFIRMED',
      `UID:${appointment.referenceNumber}@drsarahkhan.pk`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${appointment.referenceNumber}.ics`; a.click();
    URL.revokeObjectURL(url);
  };

  // ── JSX ──────────────────────────────────────────────────────
  return (
    <div className="animate-slide-up">
      {/* Success banner */}
      <div className="bg-success/10 border border-success/30 rounded-2xl p-5 mb-5 flex items-start gap-3">
        <CheckCircleIcon className="text-success flex-shrink-0 mt-0.5" size={26} />
        <div>
          <h3 className="font-merriweather font-bold text-text-primary text-lg">Appointment Confirmed!</h3>
          <p className="font-sourcesans text-text-secondary text-sm mt-0.5">
            Your appointment has been confirmed and saved.
          </p>
        </div>
      </div>

      {/* Details card */}
      <div className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden">
        <div className="bg-primary px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-dmsans text-blue-200 text-xs font-semibold uppercase tracking-wider">Reference Number</div>
            <div className="font-merriweather font-black text-white text-xl mt-0.5">{appointment.referenceNumber}</div>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="divide-y divide-border-light">
          <InfoRow icon={<DoctorSVG />} label="Doctor"           value="Dr. Sarah Khan — Interventional Cardiologist" />
          <InfoRow icon={<CalSVG />}    label="Date"             value={formatDate(appointment.date)} />
          <InfoRow icon={<ClockSVG />}  label="Time"             value={`${formatTime(appointment.timeSlot)} — ${getEndTime(appointment.timeSlot)}`} />
          <InfoRow icon={<TypeSVG />}   label="Type"             value={TYPE_LABELS[appointment.type]} />
          <InfoRow icon={<HospSVG />}   label="Location"         value="Islamabad Heart Institute, G-8/4, Islamabad" />
          <InfoRow icon={<FeeSVG />}    label="Consultation Fee" value={`PKR ${appointment.fee.toLocaleString()}`} />
          {appointment.type === 'teleconsultation' && (
            <div className="px-5 py-3 bg-accent/5">
              <p className="font-sourcesans text-accent text-sm font-semibold">
                Video call link will be sent to {appointment.email} 30 minutes before your appointment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Before your visit */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="font-dmsans font-semibold text-amber-800 text-xs uppercase tracking-wider mb-2">Before Your Visit</p>
        <ul className="font-sourcesans text-amber-700 text-sm space-y-1">
          <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"/>Arrive 15 minutes early for paperwork</li>
          <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"/>Bring CNIC, previous reports, and medication list</li>
          {appointment.hasReports && (
            <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"/>Please bring the test reports you mentioned</li>
          )}
        </ul>
      </div>

      {/* Calendar buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={handleGoogleCalendar}
          className="flex items-center justify-center gap-2 bg-white border border-border-light text-text-primary font-sourcesans font-semibold py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors text-sm"
        >
          <GoogleCalSVG />
          Google Calendar
        </button>
        <button
          onClick={handleIcsDownload}
          className="flex items-center justify-center gap-2 bg-white border border-border-light text-text-primary font-sourcesans font-semibold py-2.5 rounded-xl hover:border-primary hover:text-primary transition-colors text-sm"
        >
          <IcsSVG />
          Apple / Outlook
        </button>
      </div>

      {/* PDF download */}
      <div className="mt-2">
        <button
          onClick={() => generateAppointmentPDF(appointment, settings.contact)}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-sourcesans font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors text-sm"
        >
          <DownloadIcon size={17} />Download Appointment PDF
        </button>
      </div>

      <button
        onClick={onNewBooking}
        className="mt-3 w-full text-center font-sourcesans text-text-secondary text-sm hover:text-primary transition-colors py-2"
      >
        Book another appointment
      </button>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 px-5 py-3.5">
    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">{icon}</div>
    <div>
      <div className="font-dmsans text-text-secondary text-xs font-semibold">{label}</div>
      <div className="font-sourcesans text-text-primary text-sm font-semibold">{value}</div>
    </div>
  </div>
);

const CalSVG    = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#0f4c81" strokeWidth="1.5"/><path d="M3 9H21M8 2V6M16 2V6" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/></svg>);
const ClockSVG  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#0f4c81" strokeWidth="1.5"/><path d="M12 7V12L15 15" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/></svg>);
const TypeSVG   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="14" height="12" rx="2" stroke="#0f4c81" strokeWidth="1.5"/><path d="M16 9.5L22 6V18L16 14.5" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/></svg>);
const HospSVG   = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.69 2 6 4.69 6 8C6 12.5 12 20 12 20C12 20 18 12.5 18 8C18 4.69 15.31 2 12 2Z" stroke="#0f4c81" strokeWidth="1.5"/><circle cx="12" cy="8" r="2.5" stroke="#0f4c81" strokeWidth="1.5"/></svg>);
const FeeSVG    = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#0f4c81" strokeWidth="1.5"/><path d="M12 7V8M12 16V17M9.5 10C9.5 8.9 10.62 8 12 8C13.38 8 14.5 8.9 14.5 10C14.5 11.1 13.38 12 12 12C10.62 12 9.5 12.9 9.5 14C9.5 15.1 10.62 16 12 16C13.38 16 14.5 15.1 14.5 14" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/></svg>);
const DoctorSVG = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#0f4c81" strokeWidth="1.5"/><path d="M4 20C4 17.8 7.6 16 12 16C16.4 16 20 17.8 20 20" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/></svg>);

const GoogleCalSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#4285F4" strokeWidth="1.5"/>
    <path d="M3 9H21" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 2V6M16 2V6" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14H10V16H8V14ZM11 14H13V16H11V14ZM14 14H16V16H14V14Z" fill="#EA4335"/>
  </svg>
);

const IcsSVG = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#5a6a85" strokeWidth="1.5"/>
    <path d="M3 9H21" stroke="#5a6a85" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 2V6M16 2V6" stroke="#5a6a85" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="8.5" cy="13.5" r="1" fill="#5a6a85"/>
    <circle cx="12" cy="13.5" r="1" fill="#5a6a85"/>
    <circle cx="15.5" cy="13.5" r="1" fill="#5a6a85"/>
    <circle cx="8.5" cy="17" r="1" fill="#5a6a85"/>
    <circle cx="12" cy="17" r="1" fill="#5a6a85"/>
  </svg>
);

export default ConfirmationCard;
