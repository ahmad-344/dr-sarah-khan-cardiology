import { supabase } from './supabase';
import type { Appointment } from '../types';
import type { AdminSettings } from '../hooks/useAdminSettings';

// ─── Type that matches Supabase snake_case columns ───────────
interface DbAppointment {
  id: string;
  reference_number: string;
  type: string;
  date: string;
  time_slot: string;
  patient_name: string;
  patient_age: string;
  patient_gender: string;
  phone: string;
  email: string;
  patient_type: string;
  reason: string;
  has_reports: boolean;
  status: string;
  fee: number;
  created_at: string;
}

// ─── Convert DB row → app Appointment ────────────────────────
function fromDb(row: DbAppointment): Appointment {
  return {
    id:             row.id,
    referenceNumber: row.reference_number,
    type:           row.type as Appointment['type'],
    date:           row.date,
    timeSlot:       row.time_slot,
    patientName:    row.patient_name,
    patientAge:     row.patient_age,
    patientGender:  row.patient_gender as Appointment['patientGender'],
    phone:          row.phone,
    email:          row.email ?? '',
    patientType:    row.patient_type as Appointment['patientType'],
    reason:         row.reason ?? '',
    hasReports:     row.has_reports,
    status:         row.status as Appointment['status'],
    fee:            row.fee,
    createdAt:      row.created_at,
  };
}

// ─── Convert app Appointment → DB row ────────────────────────
function toDb(apt: Appointment): Omit<DbAppointment, 'created_at'> {
  return {
    id:              apt.id,
    reference_number: apt.referenceNumber,
    type:            apt.type,
    date:            apt.date,
    time_slot:       apt.timeSlot,
    patient_name:    apt.patientName,
    patient_age:     apt.patientAge,
    patient_gender:  apt.patientGender,
    phone:           apt.phone,
    email:           apt.email,
    patient_type:    apt.patientType,
    reason:          apt.reason,
    has_reports:     apt.hasReports,
    status:          apt.status,
    fee:             apt.fee,
  };
}

// ═══════════════════════════════════════════════════════════
//  APPOINTMENTS
// ═══════════════════════════════════════════════════════════

/** Fetch ALL appointments (admin use) */
export async function dbFetchAllAppointments(): Promise<Appointment[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('dbFetchAllAppointments:', error.message); return []; }
  return (data as DbAppointment[]).map(fromDb);
}

/** Fetch appointments by phone number (patient's "My Appointments") */
export async function dbFetchByPhone(phone: string): Promise<Appointment[]> {
  if (!supabase) return [];
  // Normalize phone — strip spaces and dashes for comparison
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('phone', phone)
    .order('created_at', { ascending: false });
  if (error) { console.error('dbFetchByPhone:', error.message); return []; }
  return (data as DbAppointment[]).map(fromDb);
}

/** Insert a new appointment */
export async function dbInsertAppointment(apt: Appointment): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('appointments')
    .insert(toDb(apt));
  if (error) { console.error('dbInsertAppointment:', error.message); return false; }
  return true;
}

/** Confirm a pending appointment */
export async function dbConfirmAppointment(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', id);
  if (error) { console.error('dbConfirmAppointment:', error.message); return false; }
  return true;
}

/** Update appointment date and time (reschedule) */
export async function dbRescheduleAppointment(
  id: string,
  newDate: string,
  newTimeSlot: string
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('appointments')
    .update({ date: newDate, time_slot: newTimeSlot })
    .eq('id', id);
  if (error) { console.error('dbRescheduleAppointment:', error.message); return false; }
  return true;
}

/** Update appointment status (cancel / confirm) */
export async function dbUpdateStatus(
  id: string,
  status: Appointment['status']
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);
  if (error) { console.error('dbUpdateStatus:', error.message); return false; }
  return true;
}

// ═══════════════════════════════════════════════════════════
//  ADMIN SETTINGS
// ═══════════════════════════════════════════════════════════

interface DbSettings {
  id: number;
  blocked_dates: string[];
  partial_dates: string[];
  blocked_time_slots: Record<string, string[]>;
  clinic_open: boolean;
  last_updated: string;
}

function settingsFromDb(row: DbSettings): AdminSettings {
  return {
    blockedDates:      row.blocked_dates      ?? [],
    partialDates:      row.partial_dates       ?? [],
    blockedTimeSlots:  row.blocked_time_slots  ?? {},
    clinicOpen:        row.clinic_open         ?? true,
    lastUpdated:       row.last_updated,
  };
}

/** Fetch admin settings */
export async function dbFetchSettings(): Promise<AdminSettings | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) { console.error('dbFetchSettings:', error.message); return null; }
  return settingsFromDb(data as DbSettings);
}

/** Save admin settings */
export async function dbSaveSettings(settings: AdminSettings): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('admin_settings')
    .upsert({
      id:                 1,
      blocked_dates:      settings.blockedDates,
      partial_dates:      settings.partialDates,
      blocked_time_slots: settings.blockedTimeSlots,
      clinic_open:        settings.clinicOpen,
      last_updated:       new Date().toISOString(),
    });
  if (error) { console.error('dbSaveSettings:', error.message); return false; }
  return true;
}


/** Fetch booked time slots for a specific date (confirmed only) */
export async function dbFetchBookedSlotsForDate(date: string): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('appointments')
    .select('time_slot')
    .eq('date', date)
    .eq('status', 'confirmed');
  if (error) { console.error('dbFetchBookedSlotsForDate:', error.message); return []; }
  return (data as { time_slot: string }[]).map(r => r.time_slot);
}

/** Subscribe to real-time appointment changes (admin dashboard) */
export function subscribeToAppointments(
  onInsert: (apt: Appointment) => void,
  onUpdate: (apt: Appointment) => void,
) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('appointments-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'appointments' },
      (payload) => onInsert(fromDb(payload.new as DbAppointment))
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'appointments' },
      (payload) => onUpdate(fromDb(payload.new as DbAppointment))
    )
    .subscribe();

  // Return unsubscribe function
  return () => { supabase!.removeChannel(channel); };
}
