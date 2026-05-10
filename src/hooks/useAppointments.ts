import { useState, useEffect, useCallback } from 'react';
import type { Appointment } from '../types';
import {
  dbInsertAppointment,
  dbFetchByPhone,
  dbUpdateStatus,
  dbRescheduleAppointment,
} from '../lib/db';
import { isSupabaseConfigured } from '../lib/supabase';

const LS_KEY    = 'dr_sarah_khan_appointments';
const LS_PHONES = 'dr_sarah_khan_phones';

function lsRead(): Appointment[] {
  try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function lsWrite(a: Appointment[]) { localStorage.setItem(LS_KEY, JSON.stringify(a)); }

function lsReadPhones(): string[] {
  try { const r = localStorage.getItem(LS_PHONES); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function lsAddPhone(phone: string) {
  const ex = lsReadPhones();
  if (!ex.includes(phone)) localStorage.setItem(LS_PHONES, JSON.stringify([...ex, phone]));
}

function mergeApts(local: Appointment[], remote: Appointment[]): Appointment[] {
  const map = new Map<string, Appointment>();
  local.forEach(a => map.set(a.id, a));
  remote.forEach(a => map.set(a.id, a)); // DB wins for status/date/time
  return Array.from(map.values());
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(lsRead());
  const [loading, setLoading] = useState(false);

  const fetchFromDB = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const phones = [...new Set([...lsReadPhones(), ...lsRead().map(a => a.phone)])].filter(Boolean);
    if (phones.length === 0) return;
    setLoading(true);
    try {
      const results = await Promise.all(phones.map(p => dbFetchByPhone(p)));
      const remote  = results.flat();
      const merged  = mergeApts(lsRead(), remote);
      setAppointments(merged);
      lsWrite(merged);
    } catch (e) { console.error('fetchFromDB:', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    setAppointments(lsRead());
    fetchFromDB();
  }, [fetchFromDB]);

  const lookupByPhone = useCallback(async (phone: string): Promise<boolean> => {
    lsAddPhone(phone);
    if (!isSupabaseConfigured) return false;
    setLoading(true);
    try {
      const remote = await dbFetchByPhone(phone);
      const merged = mergeApts(lsRead(), remote);
      setAppointments(merged);
      lsWrite(merged);
      return remote.length > 0;
    } catch { return false; }
    finally { setLoading(false); }
  }, []);

  const saveAppointment = useCallback(async (apt: Appointment) => {
    lsAddPhone(apt.phone);
    const updated = [...lsRead(), apt];
    lsWrite(updated);
    setAppointments(updated);
    if (isSupabaseConfigured) {
      const ok = await dbInsertAppointment(apt);
      if (!ok) console.warn('Supabase insert failed — saved locally only.');
    }
  }, []);

  const cancelAppointment = useCallback(async (id: string) => {
    const updated = lsRead().map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a);
    lsWrite(updated);
    setAppointments(updated);
    if (isSupabaseConfigured) await dbUpdateStatus(id, 'cancelled');
  }, []);

  const rescheduleAppointment = useCallback(async (id: string, newDate: string, newTimeSlot: string) => {
    const updated = lsRead().map(a => a.id === id ? { ...a, date: newDate, timeSlot: newTimeSlot } : a);
    lsWrite(updated);
    setAppointments(updated);
    if (isSupabaseConfigured) await dbRescheduleAppointment(id, newDate, newTimeSlot);
  }, []);

  return { appointments, loading, saveAppointment, cancelAppointment, rescheduleAppointment, lookupByPhone, refresh: fetchFromDB };
}
