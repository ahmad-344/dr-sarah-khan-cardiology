import React, { useState, useEffect } from 'react';
import { TIME_SLOTS } from '../../data/constants';
import { usePublicSettings } from '../../hooks/useAdminSettings';
import { dbFetchBookedSlotsForDate } from '../../lib/db';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { TimeSlot } from '../../types';

interface TimeSlotPickerProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  selectedDate: string | null;
}

const PERIOD_LABELS: Record<TimeSlot['period'], string> = {
  morning:   'Morning',
  afternoon: 'Afternoon',
  evening:   'Evening',
};

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ selectedTime, onSelectTime, selectedDate }) => {
  const adminSettings = usePublicSettings();
  const adminBlockedSlots = selectedDate ? (adminSettings.blockedTimeSlots[selectedDate] || []) : [];

  // Live booked slots from DB / localStorage for the selected date
  const [dbBookedSlots, setDbBookedSlots] = useState<string[]>([]);
  const [loading, setLoading]             = useState(false);

  // Re-fetch when a new appointment is saved on this date
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ date: string }>;
      if (ev.detail?.date === selectedDate) {
        dbFetchBookedSlotsForDate(selectedDate).then(slots => setDbBookedSlots(slots));
      }
    };
    window.addEventListener('appointment-saved', handler);
    return () => window.removeEventListener('appointment-saved', handler);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate) { setDbBookedSlots([]); return; }

    setLoading(true);

    if (isSupabaseConfigured) {
      // Fetch from Supabase
      dbFetchBookedSlotsForDate(selectedDate)
        .then(slots => setDbBookedSlots(slots))
        .finally(() => setLoading(false));
    } else {
      // Fallback: read from localStorage
      try {
        const raw  = localStorage.getItem('dr_sarah_khan_appointments');
        const apts = raw ? JSON.parse(raw) : [];
        const booked = apts
          .filter((a: { date: string; status: string; timeSlot: string }) =>
            a.date === selectedDate && a.status === 'confirmed'
          )
          .map((a: { timeSlot: string }) => a.timeSlot);
        setDbBookedSlots(booked);
      } catch { setDbBookedSlots([]); }
      setLoading(false);
    }
  }, [selectedDate]);

  const periods: TimeSlot['period'][] = ['morning', 'afternoon', 'evening'];

  return (
    <div className="space-y-5">
      {loading && (
        <div className="flex items-center gap-2 text-text-secondary text-xs font-sourcesans py-1">
          <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
          Checking availability...
        </div>
      )}

      {periods.map(period => {
        const slots = TIME_SLOTS.filter(s => s.period === period);
        return (
          <div key={period}>
            <div className="flex items-center gap-2 mb-2.5">
              <PeriodIcon period={period} />
              <span className="font-dmsans font-semibold text-text-secondary text-xs uppercase tracking-wider">
                {PERIOD_LABELS[period]}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {slots.map(slot => {
                const isSelected     = selectedTime === slot.time;
                const isAdminBlocked = adminBlockedSlots.includes(slot.time);
                const isDBBooked     = dbBookedSlots.includes(slot.time);

                // Check if this time slot has already passed (today only)
                const isTimePast = (() => {
                  if (!selectedDate) return false;
                  const now     = new Date();
                  const todayDs = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
                  if (selectedDate !== todayDs) return false;
                  const [slotH, slotM] = slot.time.split(':').map(Number);
                  return now.getHours() > slotH || (now.getHours() === slotH && now.getMinutes() >= slotM);
                })();

                // Separate states — past vs actually booked
                const isUnavailable = isAdminBlocked || isDBBooked || isTimePast;

                // Badge logic: only show "Booked" if a real booking exists or admin blocked
                // Never show "Booked" on past time slots — they just look grayed/strikethrough
                const showBookedBadge = (isAdminBlocked || isDBBooked) && !isTimePast;

                return (
                  <button
                    key={slot.time}
                    onClick={() => !isUnavailable && onSelectTime(slot.time)}
                    disabled={isUnavailable}
                    aria-label={`${slot.label}${isTimePast ? ' - time passed' : isDBBooked ? ' - fully booked' : ''}`}
                    aria-pressed={isSelected}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-sourcesans font-semibold
                      transition-all duration-150
                      ${isSelected
                        ? 'bg-primary text-white shadow-md scale-105'
                        : isTimePast
                          ? 'bg-gray-50 text-gray-300 cursor-not-allowed line-through decoration-gray-200'
                          : isUnavailable
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            : 'bg-white border border-border-light text-text-primary hover:border-primary hover:text-primary hover:bg-secondary cursor-pointer'
                      }
                    `}
                  >
                    {slot.label}

                    {/* Only show "Booked" badge for actual bookings — not for past times */}
                    {showBookedBadge && (
                      <span className="absolute -top-2 -right-1 bg-red-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-tight whitespace-nowrap">
                        Booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      {!loading && (
        <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-border-light">
          <LegendDot color="bg-white border border-border-light" label="Available" />
          <LegendDot color="bg-primary" label="Selected" />
          <LegendDot color="bg-gray-100 line-through" label="Time passed" />
          <LegendDot color="bg-red-100" label="Booked" />
        </div>
      )}
    </div>
  );
};

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className={`w-3 h-3 rounded-sm ${color}`} />
    <span className="font-sourcesans text-text-secondary text-xs">{label}</span>
  </div>
);

const PeriodIcon: React.FC<{ period: TimeSlot['period'] }> = ({ period }) => {
  if (period === 'morning') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="#f59e0b" strokeWidth="2"/>
      <path d="M12 2V4M12 20V22M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M2 12H4M20 12H22M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  if (period === 'afternoon') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="#0f4c81" strokeWidth="2"/>
      <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="#0f4c81" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
};

export default TimeSlotPicker;
