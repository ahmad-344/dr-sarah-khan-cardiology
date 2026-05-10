import { useState, useEffect, useCallback } from 'react';
import { dbFetchSettings, dbSaveSettings } from '../lib/db';
import { isSupabaseConfigured } from '../lib/supabase';

const LS_KEY = 'dr_sarah_admin_settings';
const ADMIN_PASSWORD = 'admin@2025';

export interface AdminSettings {
  blockedDates: string[];
  partialDates: string[];
  blockedTimeSlots: Record<string, string[]>;
  clinicOpen: boolean;
  lastUpdated: string;
}

export const DEFAULT_SETTINGS: AdminSettings = {
  blockedDates: [],
  partialDates: [],
  blockedTimeSlots: {},
  clinicOpen: true,
  lastUpdated: new Date().toISOString(),
};

// ── localStorage helpers ──────────────────────────────────
function lsReadSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

function lsWriteSettings(s: AdminSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// ─────────────────────────────────────────────────────────
//  useAdminSettings — used inside Admin Panel only
// ─────────────────────────────────────────────────────────
export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(lsReadSettings());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'ok' | 'error'>('idle');

  useEffect(() => {
    // Restore session
    if (sessionStorage.getItem('admin_session') === 'true') setIsLoggedIn(true);

    // Load latest settings from Supabase if configured
    if (!isSupabaseConfigured) return;
    setSyncStatus('syncing');
    dbFetchSettings().then(remote => {
      if (remote) {
        setSettings(remote);
        lsWriteSettings(remote);
        setSyncStatus('ok');
      } else {
        setSyncStatus('error');
      }
    });
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_session');
  };

  const save = useCallback(async (newSettings: AdminSettings) => {
    const updated = { ...newSettings, lastUpdated: new Date().toISOString() };
    // Optimistic update
    setSettings(updated);
    lsWriteSettings(updated);
    // Persist to Supabase
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      const ok = await dbSaveSettings(updated);
      setSyncStatus(ok ? 'ok' : 'error');
    }
  }, []);

  const toggleDate = useCallback((date: string, type: 'blocked' | 'partial') => {
    setSettings(prev => {
      const s = { ...prev };
      if (type === 'blocked') {
        s.blockedDates = s.blockedDates.includes(date)
          ? s.blockedDates.filter(d => d !== date)
          : [...s.blockedDates, date];
        s.partialDates = s.partialDates.filter(d => d !== date);
      } else {
        s.partialDates = s.partialDates.includes(date)
          ? s.partialDates.filter(d => d !== date)
          : [...s.partialDates, date];
        s.blockedDates = s.blockedDates.filter(d => d !== date);
      }
      save(s);
      return s;
    });
  }, [save]);

  const toggleTimeSlot = useCallback((date: string, time: string) => {
    setSettings(prev => {
      const s = { ...prev };
      const slots = s.blockedTimeSlots[date] || [];
      s.blockedTimeSlots = {
        ...s.blockedTimeSlots,
        [date]: slots.includes(time)
          ? slots.filter(t => t !== time)
          : [...slots, time],
      };
      save(s);
      return s;
    });
  }, [save]);

  const clearDate = useCallback((date: string) => {
    setSettings(prev => {
      const s = { ...prev };
      s.blockedDates = s.blockedDates.filter(d => d !== date);
      s.partialDates = s.partialDates.filter(d => d !== date);
      const ts = { ...s.blockedTimeSlots };
      delete ts[date];
      s.blockedTimeSlots = ts;
      save(s);
      return s;
    });
  }, [save]);

  return {
    settings,
    isLoggedIn,
    syncStatus,
    login,
    logout,
    save,
    toggleDate,
    toggleTimeSlot,
    clearDate,
  };
}

// ─────────────────────────────────────────────────────────
//  usePublicSettings — used by Calendar & TimeSlotPicker
//  Public-facing, read-only, loads from Supabase if available
// ─────────────────────────────────────────────────────────
export function usePublicSettings(): AdminSettings {
  const [settings, setSettings] = useState<AdminSettings>(lsReadSettings());

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    dbFetchSettings().then(remote => {
      if (remote) {
        setSettings(remote);
        lsWriteSettings(remote);
      }
    });
  }, []);

  return settings;
}
