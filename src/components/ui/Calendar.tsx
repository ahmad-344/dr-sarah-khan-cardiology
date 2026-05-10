import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../assets/svgs/Icons';
import { usePublicSettings } from '../../hooks/useAdminSettings';

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ── Safe date-string builder — NO toISOString (timezone-safe) ──
function makeDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ── Get today's date string in local time ────────────────────
function todayStr(): string {
  const d = new Date();
  return makeDateStr(d.getFullYear(), d.getMonth(), d.getDate());
}

// ── Get day-of-week (0=Sun) without timezone shift ──────────
function dayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month, day).getDay();
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const adminSettings = usePublicSettings();

  const now = new Date();
  const [viewDate, setViewDate] = useState({
    month: now.getMonth(),
    year:  now.getFullYear(),
  });

  // Today and max-date as plain strings (no UTC conversion)
  const TODAY    = todayStr();
  const maxDate  = new Date(now);
  maxDate.setDate(now.getDate() + 30);
  const MAX_STR  = makeDateStr(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

  const firstDay    = new Date(viewDate.year, viewDate.month, 1).getDay();
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const canGoPrev = () =>
    new Date(viewDate.year, viewDate.month - 1, 1) >=
    new Date(now.getFullYear(), now.getMonth(), 1);

  const canGoNext = () =>
    new Date(viewDate.year, viewDate.month + 1, 1) <=
    new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  // Last bookable time slot of the day (latest slot = 16:30)
  const LAST_SLOT_HOUR = 16;
  const LAST_SLOT_MIN  = 30;

  type Status = 'available' | 'unavailable' | 'past' | 'weekend' | 'selected' | 'partial';

  const getStatus = (day: number): Status => {
    const ds = makeDateStr(viewDate.year, viewDate.month, day);

    if (ds === selectedDate)        return 'selected';
    if (ds > MAX_STR)               return 'past'; // beyond 30-day window
    if (ds < TODAY)                 return 'past'; // strict past dates

    // Today: check if the last available time slot has already passed
    if (ds === TODAY) {
      const nowH = new Date().getHours();
      const nowM = new Date().getMinutes();
      const allSlotsPast =
        nowH > LAST_SLOT_HOUR ||
        (nowH === LAST_SLOT_HOUR && nowM >= LAST_SLOT_MIN);
      if (allSlotsPast) return 'past';
    }

    if (dayOfWeek(viewDate.year, viewDate.month, day) === 0) return 'weekend';
    if (adminSettings.blockedDates.includes(ds))             return 'unavailable';
    if (adminSettings.partialDates.includes(ds))             return 'partial';
    return 'available';
  };

  const handleClick = (day: number) => {
    const ds = makeDateStr(viewDate.year, viewDate.month, day);
    const s  = getStatus(day);
    if (s === 'available' || s === 'partial') onSelectDate(ds);
  };

  const STATUS_CLS: Record<Status, string> = {
    selected:    'bg-primary text-white font-bold shadow-md cursor-pointer',
    available:   'text-text-primary hover:bg-secondary hover:text-primary cursor-pointer',
    partial:     'text-amber-700 bg-amber-50 hover:bg-amber-100 cursor-pointer',
    unavailable: 'text-gray-300 cursor-not-allowed line-through',
    past:        'text-gray-200 cursor-not-allowed',
    weekend:     'text-orange-200 cursor-not-allowed',
  };

  return (
    <div className="bg-white rounded-xl border border-border-light overflow-hidden">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border-light">
        <button
          onClick={() => setViewDate(p => {
            const d = new Date(p.year, p.month - 1, 1);
            return { month: d.getMonth(), year: d.getFullYear() };
          })}
          disabled={!canGoPrev()}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon size={18} className="text-text-primary" />
        </button>
        <span className="font-dmsans font-semibold text-text-primary text-sm">
          {MONTHS[viewDate.month]} {viewDate.year}
        </span>
        <button
          onClick={() => setViewDate(p => {
            const d = new Date(p.year, p.month + 1, 1);
            return { month: d.getMonth(), year: d.getFullYear() };
          })}
          disabled={!canGoNext()}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon size={18} className="text-text-primary" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border-light">
        {DAYS.map(d => (
          <div key={d} className="py-2 text-center font-dmsans font-semibold text-text-secondary text-xs">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 p-2 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;

          const status  = getStatus(day);
          const ds      = makeDateStr(viewDate.year, viewDate.month, day);
          const isToday = ds === TODAY;

          return (
            <button
              key={idx}
              onClick={() => handleClick(day)}
              disabled={status !== 'available' && status !== 'partial'}
              className={`w-full aspect-square flex items-center justify-center rounded-lg text-sm font-sourcesans font-medium transition-all duration-150 relative ${STATUS_CLS[status]}`}
              aria-label={`${day} ${MONTHS[viewDate.month]} ${viewDate.year}${status === 'unavailable' ? ' — fully booked' : ''}`}
              aria-pressed={status === 'selected'}
            >
              {day}
              {/* Today dot */}
              {isToday && status !== 'selected' && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
              {/* Limited slot dot */}
              {status === 'partial' && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-t border-border-light bg-gray-50/50">
        {[
          { color: 'bg-primary',                         label: 'Selected' },
          { color: 'bg-secondary border border-border-light', label: 'Available' },
          { color: 'bg-amber-100',                       label: 'Limited slots' },
          { color: 'bg-gray-100',                        label: 'Unavailable' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${l.color}`} />
            <span className="font-sourcesans text-text-secondary text-xs">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
