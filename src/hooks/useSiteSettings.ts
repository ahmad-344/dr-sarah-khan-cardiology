import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { SiteSettings } from '../types/siteSettings';
import { DEFAULT_SITE_SETTINGS } from '../types/siteSettings';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LS_KEY = 'dr_sarah_site_settings';

function lsRead(): SiteSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      doctor:      { ...DEFAULT_SITE_SETTINGS.doctor,      ...parsed.doctor },
      contact:     { ...DEFAULT_SITE_SETTINGS.contact,     ...parsed.contact },
      clinicHours: { ...DEFAULT_SITE_SETTINGS.clinicHours, ...parsed.clinicHours },
      fees:        { ...DEFAULT_SITE_SETTINGS.fees,        ...parsed.fees },
      services:    parsed.services    || DEFAULT_SITE_SETTINGS.services,
      reviews:     parsed.reviews     || DEFAULT_SITE_SETTINGS.reviews,
      insuranceProviders: parsed.insuranceProviders || DEFAULT_SITE_SETTINGS.insuranceProviders,
    };
  } catch { return DEFAULT_SITE_SETTINGS; }
}

function lsWrite(s: SiteSettings) { localStorage.setItem(LS_KEY, JSON.stringify(s)); }

async function dbFetch(): Promise<SiteSettings | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('site_settings').select('*').eq('id', 1).single();
    if (error || !data) return null;
    const content = data.content as Partial<SiteSettings>;
    if (!content || Object.keys(content).length === 0) return null;
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...content,
      doctor:      { ...DEFAULT_SITE_SETTINGS.doctor,      ...content.doctor },
      contact:     { ...DEFAULT_SITE_SETTINGS.contact,     ...content.contact },
      clinicHours: { ...DEFAULT_SITE_SETTINGS.clinicHours, ...content.clinicHours },
      fees:        { ...DEFAULT_SITE_SETTINGS.fees,        ...content.fees },
      services:    content.services    || DEFAULT_SITE_SETTINGS.services,
      reviews:     content.reviews     || DEFAULT_SITE_SETTINGS.reviews,
      insuranceProviders: content.insuranceProviders || DEFAULT_SITE_SETTINGS.insuranceProviders,
    };
  } catch { return null; }
}

async function dbSave(s: SiteSettings): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, content: s, updated_at: new Date().toISOString() });
    if (error) { console.error('dbSave site_settings:', error.message); return false; }
    return true;
  } catch { return false; }
}

// ── Context ───────────────────────────────────────────────────
interface CtxValue {
  settings: SiteSettings;
  saving: boolean;
  save: (s: SiteSettings) => Promise<void>;
}

export const SiteSettingsContext = createContext<CtxValue>({
  settings: DEFAULT_SITE_SETTINGS,
  saving: false,
  save: async () => {},
});

export function useSiteSettings() { return useContext(SiteSettingsContext); }

// ── Provider hook ─────────────────────────────────────────────
export function useSiteSettingsProvider() {
  const [settings, setSettings] = useState<SiteSettings>(lsRead());
  const [saving, setSaving] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    dbFetch().then(remote => {
      if (remote) { setSettings(remote); lsWrite(remote); }
    });
  }, []);

  // Real-time subscription — when admin saves, website updates automatically
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'site_settings',
        filter: 'id=eq.1',
      }, (payload) => {
        const content = (payload.new as { content: Partial<SiteSettings> }).content;
        if (!content || Object.keys(content).length === 0) return;
        const updated: SiteSettings = {
          ...DEFAULT_SITE_SETTINGS,
          ...content,
          doctor:      { ...DEFAULT_SITE_SETTINGS.doctor,      ...content.doctor },
          contact:     { ...DEFAULT_SITE_SETTINGS.contact,     ...content.contact },
          clinicHours: { ...DEFAULT_SITE_SETTINGS.clinicHours, ...content.clinicHours },
          fees:        { ...DEFAULT_SITE_SETTINGS.fees,        ...content.fees },
          services:    content.services    || DEFAULT_SITE_SETTINGS.services,
          reviews:     content.reviews     || DEFAULT_SITE_SETTINGS.reviews,
          insuranceProviders: content.insuranceProviders || DEFAULT_SITE_SETTINGS.insuranceProviders,
        };
        setSettings(updated);
        lsWrite(updated);
      })
      .subscribe();
    return () => { supabase!.removeChannel(channel); };
  }, []);

  const save = useCallback(async (updated: SiteSettings) => {
    const s = { ...updated, lastUpdated: new Date().toISOString() };
    setSettings(s);   // instant UI update
    lsWrite(s);
    setSaving(true);
    if (isSupabaseConfigured) await dbSave(s);
    setSaving(false);
  }, []);

  return { settings, saving, save };
}
