export function generateReferenceNumber(): string {
  const year   = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `APT-${year}-${random}`;
}

// ── Build a YYYY-MM-DD string from a Date object WITHOUT using
//    toISOString() — toISOString converts to UTC which shifts the
//    date backwards in UTC+5 (Pakistan) timezone. ───────────────
export function dateToStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ── Today's date string in LOCAL time ───────────────────────────
export function todayStr(): string {
  return dateToStr(new Date());
}

export function formatDate(dateStr: string): string {
  // Add T00:00:00 so JS parses as LOCAL time not UTC
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-PK', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period       = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function getEndTime(timeStr: string): string {
  const [hours, minutes]  = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + 30;
  const endHours     = Math.floor(totalMinutes / 60);
  const endMins      = totalMinutes % 60;
  const period       = endHours >= 12 ? 'PM' : 'AM';
  const displayHours = endHours > 12 ? endHours - 12 : endHours === 0 ? 12 : endHours;
  return `${displayHours}:${endMins.toString().padStart(2, '0')} ${period}`;
}

export function isWeekend(dateStr: string): boolean {
  // Parse as local time
  const date = new Date(dateStr + 'T00:00:00');
  return date.getDay() === 0; // Sunday = closed
}

export function getDatesInRange(startDate: Date, days: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(dateToStr(d)); // timezone-safe
  }
  return dates;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}
