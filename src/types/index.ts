export type AppointmentStatus =
  | 'pending'         // New booking — waiting admin confirm
  | 'confirmed'       // Admin confirmed
  | 'completed'       // Patient arrived, appointment done
  | 'cancelled'       // Cancelled by patient or admin
  | 'not_confirmed'   // Time passed without admin confirmation
  | 'not_arrived';    // Admin confirmed but patient didn't come

export interface Appointment {
  id: string;
  referenceNumber: string;
  type: AppointmentType;
  date: string;       // YYYY-MM-DD
  timeSlot: string;   // "09:00"
  patientName: string;
  patientAge: string;
  patientGender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  patientType: 'new' | 'returning';
  reason: string;
  hasReports: boolean;
  status: AppointmentStatus;
  createdAt: string;
  fee: number;
}

export type AppointmentType = 'in-clinic' | 'teleconsultation' | 'follow-up' | 'urgent';

export interface TimeSlot {
  time: string;
  label: string;
  available: boolean;
  period: 'morning' | 'afternoon' | 'evening';
}

export interface BookingFormData {
  step: number;
  appointmentType: AppointmentType | null;
  selectedDate: string | null;
  selectedTime: string | null;
  patientName: string;
  patientAge: string;
  patientGender: 'male' | 'female' | 'other' | '';
  phone: string;
  email: string;
  patientType: 'new' | 'returning' | '';
  reason: string;
  hasReports: boolean | null;
}

export interface NavLink  { label: string; href: string; }
export interface Specialty { title: string; description: string; icon: string; }
export interface Testimonial { name: string; rating: number; review: string; date: string; condition: string; }
export interface FAQ { question: string; answer: string; }
