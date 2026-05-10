import React, { useState, useEffect, useCallback } from 'react';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { formatDate, formatTime } from '../utils/helpers';
import { TIME_SLOTS } from '../data/constants';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  dbFetchAllAppointments,
  dbUpdateStatus,
  subscribeToAppointments,
} from '../lib/db';
import type { Appointment } from '../types';
import ContentEditor from '../components/admin/ContentEditor';
import { useSiteSettings } from '../hooks/useSiteSettings';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

type Tab = 'dashboard' | 'availability' | 'appointments' | 'content' | 'settings';

interface AdminPanelProps { onBack: () => void; }

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const {
    settings, isLoggedIn, syncStatus,
    login, logout,
    save, toggleDate, toggleTimeSlot, clearDate,
  } = useAdminSettings();

  // Appointments state — loaded from Supabase or localStorage
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [aptsLoading, setAptsLoading] = useState(false);
  const [aptsFilter, setAptsFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'today'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { settings: siteSettings, saving: siteSaving, save: saveSiteSettings } = useSiteSettings();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [calViewDate, setCalViewDate] = useState(() => {
    const d = new Date();
    return { month: d.getMonth(), year: d.getFullYear() };
  });
  const [selectedAdminDate, setSelectedAdminDate] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [newBadge, setNewBadge] = useState(false); // real-time new booking indicator
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [notArrivedId, setNotArrivedId] = useState<string | null>(null);
  // Dashboard date selector
  const [dashDate, setDashDate] = useState<string>(() => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  });

  // ── Load all appointments (admin only) ─────────────────
  const loadAppointments = useCallback(async () => {
    setAptsLoading(true);
    if (isSupabaseConfigured) {
      const data = await dbFetchAllAppointments();
      setAppointments(data);
    } else {
      // Fallback: localStorage (only has this browser's bookings)
      try {
        const raw = localStorage.getItem('dr_sarah_khan_appointments');
        setAppointments(raw ? JSON.parse(raw) : []);
      } catch { setAppointments([]); }
    }
    setAptsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadAppointments();

    // Real-time subscription
    if (!isSupabaseConfigured) return;
    const unsub = subscribeToAppointments(
      (newApt) => {
        setAppointments(prev => {
          if (prev.find(a => a.id === newApt.id)) return prev;
          setNewBadge(true);
          setTimeout(() => setNewBadge(false), 5000);
          return [newApt, ...prev];
        });
      },
      (updatedApt) => {
        setAppointments(prev =>
          prev.map(a => a.id === updatedApt.id ? updatedApt : a)
        );
      },
    );
    return unsub;
  }, [isLoggedIn, loadAppointments]);

  // ── Login ───────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(password);
    if (!ok) { setLoginError('Incorrect password. Try again.'); }
    else setLoginError('');
  };

  // ── Cancel appointment ──────────────────────────────────
  const handleCancel = async (id: string) => {
    if (isSupabaseConfigured) {
      await dbUpdateStatus(id, 'cancelled');
    }
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a)
    );
    // Also update localStorage
    try {
      const raw = localStorage.getItem('dr_sarah_khan_appointments');
      if (raw) {
        const apts: Appointment[] = JSON.parse(raw);
        const updated = apts.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a);
        localStorage.setItem('dr_sarah_khan_appointments', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
    setCancellingId(null);
  };

  // ── Complete appointment ─────────────────────────────────
  const handleComplete = async (id: string) => {
    if (isSupabaseConfigured) {
      await dbUpdateStatus(id, 'completed');
    }
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'completed' as const } : a)
    );
    try {
      const raw = localStorage.getItem('dr_sarah_khan_appointments');
      if (raw) {
        const apts: Appointment[] = JSON.parse(raw);
        const updated = apts.map(a => a.id === id ? { ...a, status: 'completed' as const } : a);
        localStorage.setItem('dr_sarah_khan_appointments', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
    setCompletingId(null);
  };

  // ── Confirm pending appointment ──────────────────────────
  const handleConfirm = async (id: string) => {
    if (isSupabaseConfigured) { await dbUpdateStatus(id, 'confirmed'); }
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' as const } : a));
    try {
      const raw = localStorage.getItem('dr_sarah_khan_appointments');
      if (raw) {
        const updated = (JSON.parse(raw) as Appointment[]).map(a => a.id === id ? { ...a, status: 'confirmed' as const } : a);
        localStorage.setItem('dr_sarah_khan_appointments', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
    setConfirmingId(null);
  };

  // ── Mark as Not Arrived ───────────────────────────────────
  const handleNotArrived = async (id: string) => {
    if (isSupabaseConfigured) { await dbUpdateStatus(id, 'not_arrived'); }
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'not_arrived' as const } : a));
    try {
      const raw = localStorage.getItem('dr_sarah_khan_appointments');
      if (raw) {
        const updated = (JSON.parse(raw) as Appointment[]).map(a => a.id === id ? { ...a, status: 'not_arrived' as const } : a);
        localStorage.setItem('dr_sarah_khan_appointments', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
    setNotArrivedId(null);
  };

  // ── Auto-status: when time passes ────────────────────────
  // Run on every render — mark expired appointments appropriately
  const autoUpdateStatuses = () => {
    const nowMs = Date.now();
    setAppointments(prev => prev.map(a => {
      const aptMs = new Date(a.date + 'T' + a.timeSlot + ':00').getTime();
      // Add 30min buffer (appointment duration)
      const endMs = aptMs + 30 * 60 * 1000;
      if (nowMs < endMs) return a;
      if (a.status === 'pending')    return { ...a, status: 'not_confirmed' as const };
      if (a.status === 'confirmed')  return { ...a, status: 'not_arrived' as const };
      return a;
    }));
  };

  // ── LOGIN SCREEN ────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="1.5"/>
                <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="white"/>
              </svg>
            </div>
            <h1 className="font-merriweather font-black text-text-primary text-2xl">Admin Panel</h1>
            <p className="font-sourcesans text-text-secondary text-sm mt-1">Dr. Sarah Khan — Clinic Management</p>
            {isSupabaseConfigured ? (
              <div className="inline-flex items-center gap-1.5 mt-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-sourcesans font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"/>Database Connected
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 mt-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-sourcesans font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"/>Local mode (setup Supabase)
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-border-light shadow-card p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-dmsans font-semibold text-text-primary text-xs uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl border border-border-light font-sourcesans text-text-primary text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  autoFocus
                />
                {loginError && (
                  <p className="mt-1.5 text-red-500 text-xs font-sourcesans">{loginError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-sourcesans font-bold py-3 rounded-xl transition-colors"
              >
                Sign In
              </button>
            </form>
            <button
              onClick={onBack}
              className="mt-4 w-full text-center font-sourcesans text-text-secondary text-sm hover:text-primary transition-colors py-2"
            >
              Back to Website
            </button>
          </div>
          <p className="text-center font-sourcesans text-text-secondary text-xs mt-4">
            This panel is not visible to patients.
          </p>
        </div>
      </div>
    );
  }

  // ── Derived stats ───────────────────────────────────────
  const now = new Date();
  const today = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
  // Dashboard selected date appointments (all statuses except cancelled)
  const dashDateApts = appointments.filter(a => a.date === dashDate && a.status !== 'cancelled');
  // Stats for header cards
  const confirmed = appointments.filter(a => a.status === 'confirmed');
  const pending   = appointments.filter(a => a.status === 'pending');
  // Revenue: from confirmed + completed appointments
  const revenue   = appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').reduce((s, a) => s + a.fee, 0);
  // Upcoming: confirmed from today onwards
  const upcoming  = confirmed.filter(a => a.date >= today);

  // ── Filter appointments for table ───────────────────────
  const filtered = appointments
    .filter(a => {
      if (aptsFilter === 'pending')    return a.status === 'pending';
      if (aptsFilter === 'confirmed')  return a.status === 'confirmed';
      if (aptsFilter === 'cancelled')  return a.status === 'cancelled';
      if (aptsFilter === 'today')      return a.date === today;
      return true;
    })
    .filter(a => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        a.patientName.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.referenceNumber.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q)
      );
    });

  // ── Calendar helpers ─────────────────────────────────────
  const firstDay    = new Date(calViewDate.year, calViewDate.month, 1).getDay();
  const daysInMonth = new Date(calViewDate.year, calViewDate.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const getDateStr = (day: number) => {
    const m = String(calViewDate.month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${calViewDate.year}-${m}-${d}`;
  };

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: 'dashboard',    label: 'Dashboard' },
    { id: 'availability', label: 'Availability' },
    { id: 'appointments', label: 'Appointments', badge: newBadge ? 'New' : undefined },
    { id: 'content',      label: 'Content' },
    { id: 'settings',     label: 'Settings' },
  ];

  // ── MAIN PANEL ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-primary text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21.5C16.6 20.5 20 16.4 20 12V7L12 3Z" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div className="font-merriweather font-bold text-sm">Admin Panel</div>
              <div className="flex items-center gap-2">
                <div className="font-sourcesans text-blue-200 text-xs">Dr. Sarah Khan</div>
                {isSupabaseConfigured ? (
                  <span className="flex items-center gap-1 bg-green-500/30 text-green-200 text-xs px-2 py-0.5 rounded-full font-sourcesans">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Live DB
                  </span>
                ) : (
                  <span className="bg-amber-500/30 text-amber-200 text-xs px-2 py-0.5 rounded-full font-sourcesans">
                    Local only
                  </span>
                )}
                {syncStatus === 'syncing' && (
                  <span className="text-blue-200 text-xs font-sourcesans">Syncing...</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAppointments}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M23 4V10H17M1 20V14H7M3.51 9C4.01 7.54 4.87 6.23 6.01 5.18C7.15 4.13 8.54 3.38 10.04 3C11.54 2.62 13.12 2.62 14.62 3C16.12 3.38 17.51 4.13 18.65 5.18L23 10M1 14L5.35 18.82C6.49 19.87 7.88 20.62 9.38 21C10.88 21.38 12.46 21.38 13.96 21C15.46 20.62 16.85 19.87 17.99 18.82C19.13 17.77 19.99 16.46 20.49 15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={onBack} className="font-sourcesans text-blue-200 text-sm hover:text-white transition-colors hidden sm:block">
              View Website
            </button>
            <button
              onClick={logout}
              className="bg-white/10 hover:bg-white/20 text-white font-sourcesans font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-4 sm:px-5 py-2.5 font-sourcesans font-semibold text-sm transition-all rounded-t-lg ${
                tab === t.id ? 'bg-white text-primary' : 'text-blue-200 hover:text-white'
              }`}
            >
              {t.label}
              {t.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Panel body ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── DASHBOARD ──────────────────────────────── */}
        {tab === 'dashboard' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-merriweather font-bold text-text-primary text-xl">Dashboard</h2>
              <span className="font-sourcesans text-text-secondary text-xs">
                {new Date().toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
              </span>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label:'Total Bookings', value: appointments.length, color:'bg-primary',    icon: CalIcon },
                { label:'Pending',        value: pending.length,      color:'bg-amber-500',  icon: ClockIcon },
                { label:'Confirmed',      value: confirmed.length,    color:'bg-success',    icon: CheckIcon },
                { label:'Total Revenue',  value:'PKR ' + revenue.toLocaleString(), color:'bg-accent', icon: PKRIcon },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-border-light shadow-sm p-5">
                  <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                    <s.icon />
                  </div>
                  <div className="font-merriweather font-black text-text-primary text-2xl leading-tight">{s.value}</div>
                  <div className="font-sourcesans text-text-secondary text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Date selector + day's appointments */}
            <div className="bg-white rounded-2xl border border-border-light shadow-sm p-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="font-merriweather font-bold text-text-primary text-base">
                  Appointments for Date
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dashDate}
                    onChange={e => setDashDate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-border-light font-sourcesans text-sm text-text-primary outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => { const d=new Date(); setDashDate(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')); }}
                    className="text-primary border border-primary/30 font-sourcesans font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    Today
                  </button>
                  <span className="bg-primary text-white font-bold text-xs px-2.5 py-1 rounded-full">{dashDateApts.length}</span>
                </div>
              </div>
              {dashDateApts.length === 0 ? (
                <p className="font-sourcesans text-text-secondary text-sm">No appointments on this date.</p>
              ) : (
                <div className="space-y-2">
                  {dashDateApts
                    .sort((a,b) => a.timeSlot.localeCompare(b.timeSlot))
                    .map(apt => (
                      <div key={apt.id} className="flex items-center justify-between rounded-xl px-4 py-3 border" style={{
                        background: apt.status === 'pending' ? '#fef3f2' : apt.status === 'not_confirmed' ? '#fdf2f2' : apt.status === 'completed' ? '#f0fdf4' : apt.status === 'not_arrived' ? '#fffbeb' : '#f0f9ff',
                        borderColor: apt.status === 'pending' ? '#fca5a5' : apt.status === 'not_confirmed' ? '#fca5a5' : apt.status === 'completed' ? '#86efac' : apt.status === 'not_arrived' ? '#fcd34d' : '#bae6fd',
                      }}>
                        <div className="flex items-center gap-3">
                          <div className="w-16 font-dmsans font-bold text-primary text-sm">{formatTime(apt.timeSlot)}</div>
                          <div>
                            <div className="font-sourcesans font-semibold text-text-primary text-sm">{apt.patientName}</div>
                            <div className="font-sourcesans text-text-secondary text-xs">{apt.type} · {apt.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="font-dmsans font-bold text-primary text-xs">PKR {apt.fee.toLocaleString()}</div>
                          <StatusPill status={apt.status} />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Upcoming preview */}
            <div className="bg-white rounded-2xl border border-border-light shadow-sm p-5">
              <h3 className="font-merriweather font-bold text-text-primary text-base mb-4">
                Upcoming ({upcoming.length})
              </h3>
              {upcoming.length === 0 ? (
                <p className="font-sourcesans text-text-secondary text-sm">No upcoming appointments.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-light">
                        {['Date','Time','Patient','Type','Fee'].map(h => (
                          <th key={h} className="text-left pb-2 font-dmsans font-semibold text-text-secondary text-xs uppercase tracking-wider pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {upcoming.slice(0,8).sort((a,b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot)).map(apt => (
                        <tr key={apt.id}>
                          <td className="py-2.5 pr-4 font-sourcesans text-text-primary">{apt.date}</td>
                          <td className="py-2.5 pr-4 font-sourcesans text-text-secondary">{formatTime(apt.timeSlot)}</td>
                          <td className="py-2.5 pr-4">
                            <div className="font-sourcesans font-semibold text-text-primary">{apt.patientName}</div>
                            <div className="font-sourcesans text-text-secondary text-xs">{apt.phone}</div>
                          </td>
                          <td className="py-2.5 pr-4 font-sourcesans text-text-secondary capitalize text-xs">{apt.type}</td>
                          <td className="py-2.5 font-dmsans font-bold text-primary text-xs">PKR {apt.fee.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {upcoming.length > 8 && (
                    <button
                      onClick={() => setTab('appointments')}
                      className="mt-3 text-primary font-sourcesans text-sm hover:underline"
                    >
                      View all {upcoming.length} upcoming →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AVAILABILITY ───────────────────────────── */}
        {tab === 'availability' && (
          <div>
            <div className="mb-6">
              <h2 className="font-merriweather font-bold text-text-primary text-xl">Manage Availability</h2>
              <p className="font-sourcesans text-text-secondary text-sm mt-1">
                Click a date to block it. Changes sync to database instantly — all patients see updated availability.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-secondary border-b border-border-light">
                  <button
                    onClick={() => setCalViewDate(p => { const d = new Date(p.year,p.month-1,1); return {month:d.getMonth(),year:d.getFullYear()}; })}
                    className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#1a2744" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  <span className="font-dmsans font-semibold text-text-primary">{MONTHS[calViewDate.month]} {calViewDate.year}</span>
                  <button
                    onClick={() => setCalViewDate(p => { const d = new Date(p.year,p.month+1,1); return {month:d.getMonth(),year:d.getFullYear()}; })}
                    className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="#1a2744" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 border-b border-border-light">
                  {DAYS.map(d => <div key={d} className="py-2 text-center font-dmsans font-semibold text-text-secondary text-xs">{d}</div>)}
                </div>

                <div className="grid grid-cols-7 p-3 gap-1">
                  {cells.map((day, idx) => {
                    if (!day) return <div key={idx} />;
                    const dateStr   = getDateStr(day);
                    const isBlocked = settings.blockedDates.includes(dateStr);
                    const isPartial = settings.partialDates.includes(dateStr);
                    const isSelected = selectedAdminDate === dateStr;
                    const isSun     = new Date(dateStr + 'T00:00:00').getDay() === 0;
                    const aptCount  = appointments.filter(a => a.date === dateStr && a.status === 'confirmed').length;

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedAdminDate(isSelected ? null : dateStr)}
                        className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-sourcesans font-medium transition-all cursor-pointer relative
                          ${isSelected  ? 'ring-2 ring-primary ring-offset-1' : ''}
                          ${isBlocked   ? 'bg-red-100 text-red-600 font-bold'
                            : isPartial ? 'bg-amber-100 text-amber-700 font-bold'
                            : isSun     ? 'bg-gray-50 text-gray-300'
                            :             'text-text-primary hover:bg-secondary'}`}
                      >
                        <span>{day}</span>
                        {aptCount > 0 && (
                          <span className="text-[9px] font-bold text-accent leading-none">{aptCount}</span>
                        )}
                        {isBlocked  && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500"/>}
                        {isPartial  && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500"/>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3 px-4 py-3 border-t border-border-light bg-gray-50/50">
                  {[
                    {color:'bg-red-200',   label:'Fully Blocked'},
                    {color:'bg-amber-200', label:'Limited Slots'},
                    {color:'bg-secondary', label:'Available'},
                    {color:'bg-white border border-accent', label:'Has Bookings (# shown)'},
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded ${l.color}`}/>
                      <span className="font-sourcesans text-text-secondary text-xs">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right panel */}
              <div className="space-y-4">
                {selectedAdminDate ? (
                  <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
                    <div className="bg-primary px-4 py-3">
                      <div className="font-dmsans text-blue-200 text-xs uppercase tracking-wider">Selected</div>
                      <div className="font-merriweather font-bold text-white mt-0.5">{formatDate(selectedAdminDate)}</div>
                      <div className="font-sourcesans text-blue-200 text-xs mt-0.5">
                        {appointments.filter(a => a.date === selectedAdminDate && a.status === 'confirmed').length} confirmed booking(s)
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => toggleDate(selectedAdminDate, 'blocked')}
                          className={`py-2 px-3 rounded-lg text-sm font-sourcesans font-semibold transition-colors ${
                            settings.blockedDates.includes(selectedAdminDate)
                              ? 'bg-red-500 text-white'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {settings.blockedDates.includes(selectedAdminDate) ? 'Unblock Day' : 'Block Full Day'}
                        </button>
                        <button
                          onClick={() => toggleDate(selectedAdminDate, 'partial')}
                          className={`py-2 px-3 rounded-lg text-sm font-sourcesans font-semibold transition-colors ${
                            settings.partialDates.includes(selectedAdminDate)
                              ? 'bg-amber-500 text-white'
                              : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          }`}
                        >
                          {settings.partialDates.includes(selectedAdminDate) ? 'Remove Limit' : 'Limit Slots'}
                        </button>
                      </div>

                      <div className="border-t border-border-light pt-3">
                        <div className="font-dmsans font-semibold text-text-primary text-xs uppercase tracking-wider mb-2">
                          Block Individual Time Slots
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {TIME_SLOTS.map(slot => {
                            const blocked = (settings.blockedTimeSlots[selectedAdminDate] || []).includes(slot.time);
                            const hasBooking = appointments.some(
                              a => a.date === selectedAdminDate && a.timeSlot === slot.time && a.status === 'confirmed'
                            );
                            return (
                              <button
                                key={slot.time}
                                onClick={() => toggleTimeSlot(selectedAdminDate, slot.time)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-sourcesans font-semibold transition-colors relative ${
                                  blocked
                                    ? 'bg-red-100 text-red-600 line-through'
                                    : hasBooking
                                      ? 'bg-blue-50 text-primary border border-primary/20'
                                      : 'bg-secondary text-primary hover:bg-primary/10'
                                }`}
                              >
                                {slot.label}
                                {hasBooking && <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-accent"/>}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => { clearDate(selectedAdminDate); setSelectedAdminDate(null); }}
                        className="w-full py-2 text-text-secondary font-sourcesans text-xs hover:text-red-500 transition-colors border-t border-border-light pt-2"
                      >
                        Clear all restrictions for this date
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-border-light shadow-sm p-6 text-center">
                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#0f4c81" strokeWidth="1.5"/>
                        <path d="M3 9H21M8 2V6M16 2V6" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="font-sourcesans text-text-secondary text-sm">
                      Click any date to manage availability or view bookings for that day.
                    </p>
                  </div>
                )}

                {settings.blockedDates.length > 0 && (
                  <div className="bg-white rounded-2xl border border-border-light shadow-sm p-4">
                    <div className="font-dmsans font-semibold text-text-primary text-xs uppercase tracking-wider mb-3">
                      Blocked Dates ({settings.blockedDates.length})
                    </div>
                    <div className="space-y-1.5 max-h-52 overflow-y-auto">
                      {settings.blockedDates.sort().map(d => (
                        <div key={d} className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-1.5">
                          <span className="font-sourcesans text-red-700 text-xs">{formatDate(d)}</span>
                          <button
                            onClick={() => toggleDate(d, 'blocked')}
                            className="text-red-400 hover:text-red-600 text-xs font-sourcesans"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── APPOINTMENTS ───────────────────────────── */}
        {tab === 'appointments' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-merriweather font-bold text-text-primary text-xl">All Appointments</h2>
                <p className="font-sourcesans text-text-secondary text-sm mt-0.5">
                  {isSupabaseConfigured
                    ? 'Live from database — all patients\' bookings'
                    : 'Local mode — only this browser\'s bookings'}
                </p>
              </div>
              <button
                onClick={loadAppointments}
                disabled={aptsLoading}
                className="inline-flex items-center gap-2 bg-secondary border border-border-light text-primary font-sourcesans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M23 4V10H17M1 20V14H7M3.51 9C5.01 5.46 8.41 3 12.41 3C17.21 3 21.21 6.54 21.91 11M20.49 15C18.99 18.54 15.59 21 11.59 21C6.79 21 2.79 17.46 2.09 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {aptsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {/* Search + Filters */}
            <div className="bg-white rounded-2xl border border-border-light shadow-sm p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name, phone, email, reference..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-border-light font-sourcesans text-text-primary text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(['all','confirmed','cancelled','today'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setAptsFilter(f)}
                      className={`px-3 py-2 rounded-lg font-sourcesans font-semibold text-xs capitalize transition-colors ${
                        aptsFilter === f ? 'bg-primary text-white' : 'bg-secondary text-text-secondary hover:text-primary'
                      }`}
                    >
                      {f === 'all' ? `All (${appointments.length})` : f === 'today' ? `Today (${appointments.filter(a=>a.date===today).length})` : `${f} (${appointments.filter(a=>a.status===f).length})`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {aptsLoading ? (
              <div className="bg-white rounded-2xl border border-border-light p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
                <p className="font-sourcesans text-text-secondary text-sm">Loading appointments...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border-light p-12 text-center">
                <p className="font-sourcesans text-text-secondary">No appointments found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary border-b border-border-light">
                      <tr>
                        {['Reference','Patient','Date','Time','Type','Fee','Status','Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-dmsans font-semibold text-text-secondary text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {filtered.map(apt => (
                        <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-dmsans font-bold text-primary text-xs whitespace-nowrap">{apt.referenceNumber}</td>
                          <td className="px-4 py-3 min-w-[140px]">
                            <div className="font-sourcesans font-semibold text-text-primary text-sm">{apt.patientName}</div>
                            <div className="font-sourcesans text-text-secondary text-xs">{apt.phone}</div>
                            {apt.email && <div className="font-sourcesans text-text-secondary text-xs truncate max-w-[160px]">{apt.email}</div>}
                          </td>
                          <td className="px-4 py-3 font-sourcesans text-text-primary text-sm whitespace-nowrap">{apt.date}</td>
                          <td className="px-4 py-3 font-sourcesans text-text-primary text-sm whitespace-nowrap">{formatTime(apt.timeSlot)}</td>
                          <td className="px-4 py-3 font-sourcesans text-text-secondary text-xs capitalize whitespace-nowrap">{apt.type.replace('-',' ')}</td>
                          <td className="px-4 py-3 font-dmsans font-bold text-primary text-xs whitespace-nowrap">PKR {apt.fee.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <StatusPill status={apt.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1.5">
                              {/* PENDING → Confirm or Cancel */}
                              {apt.status === 'pending' && (
                                <>
                                  {confirmingId === apt.id ? (
                                    <div className="flex items-center gap-1">
                                      <span className="font-sourcesans text-text-secondary text-xs">Confirm?</span>
                                      <button onClick={() => handleConfirm(apt.id)} className="bg-success text-white font-bold text-xs px-2 py-0.5 rounded">Yes</button>
                                      <button onClick={() => setConfirmingId(null)} className="border text-text-secondary font-sourcesans text-xs px-2 py-0.5 rounded">No</button>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setConfirmingId(apt.id); setCancellingId(null); }}
                                      className="flex items-center gap-1 text-success hover:text-green-700 font-sourcesans font-semibold text-xs">
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      Confirm
                                    </button>
                                  )}
                                  {cancellingId === apt.id ? (
                                    <div className="flex items-center gap-1">
                                      <span className="font-sourcesans text-text-secondary text-xs">Cancel?</span>
                                      <button onClick={() => handleCancel(apt.id)} className="bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded">Yes</button>
                                      <button onClick={() => setCancellingId(null)} className="border text-text-secondary font-sourcesans text-xs px-2 py-0.5 rounded">No</button>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setCancellingId(apt.id); setConfirmingId(null); }}
                                      className="flex items-center gap-1 text-red-500 hover:text-red-700 font-sourcesans font-semibold text-xs">
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                      Cancel
                                    </button>
                                  )}
                                </>
                              )}
                              {/* CONFIRMED → Complete or Not Arrived or Cancel */}
                              {apt.status === 'confirmed' && (
                                <>
                                  {completingId === apt.id ? (
                                    <div className="flex items-center gap-1">
                                      <span className="font-sourcesans text-text-secondary text-xs">Complete?</span>
                                      <button onClick={() => handleComplete(apt.id)} className="bg-blue-500 text-white font-bold text-xs px-2 py-0.5 rounded">Yes</button>
                                      <button onClick={() => setCompletingId(null)} className="border text-text-secondary font-sourcesans text-xs px-2 py-0.5 rounded">No</button>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setCompletingId(apt.id); setCancellingId(null); setNotArrivedId(null); }}
                                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-sourcesans font-semibold text-xs">
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      Complete
                                    </button>
                                  )}
                                  {notArrivedId === apt.id ? (
                                    <div className="flex items-center gap-1">
                                      <span className="font-sourcesans text-text-secondary text-xs">Not arrived?</span>
                                      <button onClick={() => handleNotArrived(apt.id)} className="bg-amber-500 text-white font-bold text-xs px-2 py-0.5 rounded">Yes</button>
                                      <button onClick={() => setNotArrivedId(null)} className="border text-text-secondary font-sourcesans text-xs px-2 py-0.5 rounded">No</button>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setNotArrivedId(apt.id); setCompletingId(null); setCancellingId(null); }}
                                      className="flex items-center gap-1 text-amber-600 hover:text-amber-800 font-sourcesans font-semibold text-xs">
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="15" r="0.5" fill="currentColor" stroke="currentColor"/></svg>
                                      Not Arrived
                                    </button>
                                  )}
                                  {cancellingId === apt.id ? (
                                    <div className="flex items-center gap-1">
                                      <span className="font-sourcesans text-text-secondary text-xs">Cancel?</span>
                                      <button onClick={() => handleCancel(apt.id)} className="bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded">Yes</button>
                                      <button onClick={() => setCancellingId(null)} className="border text-text-secondary font-sourcesans text-xs px-2 py-0.5 rounded">No</button>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setCancellingId(apt.id); setCompletingId(null); setNotArrivedId(null); }}
                                      className="flex items-center gap-1 text-red-500 hover:text-red-700 font-sourcesans font-semibold text-xs">
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                      Cancel
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-border-light bg-gray-50/50 flex items-center justify-between">
                  <span className="font-sourcesans text-text-secondary text-xs">
                    Showing {filtered.length} of {appointments.length} appointments
                  </span>
                  <span className="font-dmsans font-bold text-primary text-xs">
                    Total: PKR {filtered.filter(a=>a.status==='confirmed').reduce((s,a)=>s+a.fee,0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONTENT EDITOR ──────────────────────────── */}
        {tab === 'content' && (
          <ContentEditor
            settings={siteSettings}
            saving={siteSaving}
            onSave={saveSiteSettings}
          />
        )}

        {/* ── SETTINGS ───────────────────────────────── */}
        {tab === 'settings' && (
          <div>
            <h2 className="font-merriweather font-bold text-text-primary text-xl mb-6">Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clinic settings */}
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-6">
                <h3 className="font-merriweather font-bold text-text-primary text-base mb-5">Clinic Settings</h3>

                <div className="flex items-center justify-between py-4 border-b border-border-light">
                  <div>
                    <div className="font-dmsans font-bold text-text-primary text-sm">Online Booking</div>
                    <div className="font-sourcesans text-text-secondary text-xs mt-0.5">
                      Allow patients to book appointments online
                    </div>
                  </div>
                  <button
                    onClick={() => save({ ...settings, clinicOpen: !settings.clinicOpen })}
                    className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                      settings.clinicOpen ? 'bg-success' : 'bg-gray-300'
                    }`}
                    aria-label="Toggle online booking"
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform absolute top-0.5 ${
                      settings.clinicOpen ? 'translate-x-6' : 'translate-x-0.5'
                    }`}/>
                  </button>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="font-sourcesans text-text-secondary text-xs">
                    Last updated: <span className="text-text-primary font-semibold">{new Date(settings.lastUpdated).toLocaleString('en-PK')}</span>
                  </div>
                  <div className="font-sourcesans text-text-secondary text-xs">
                    Database: <span className={`font-semibold ${isSupabaseConfigured ? 'text-success' : 'text-amber-600'}`}>
                      {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage (Supabase not configured)'}
                    </span>
                  </div>
                  <div className="font-sourcesans text-text-secondary text-xs">
                    Sync status: <span className={`font-semibold ${syncStatus === 'ok' ? 'text-success' : syncStatus === 'error' ? 'text-red-500' : 'text-amber-600'}`}>
                      {syncStatus === 'ok' ? 'Synced' : syncStatus === 'error' ? 'Sync Error' : syncStatus === 'syncing' ? 'Syncing...' : 'Ready'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-light">
                  <button
                    onClick={() => {
                      if (confirm('Reset ALL availability settings? This cannot be undone.')) {
                        save({
                          blockedDates: [],
                          partialDates: [],
                          blockedTimeSlots: {},
                          clinicOpen: true,
                          lastUpdated: new Date().toISOString(),
                        });
                      }
                    }}
                    className="text-red-500 hover:text-red-700 font-sourcesans text-sm transition-colors"
                  >
                    Reset all availability settings
                  </button>
                </div>
              </div>

              {/* Database info */}
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-6">
                <h3 className="font-merriweather font-bold text-text-primary text-base mb-5">Database Info</h3>
                <div className="space-y-3">
                  <InfoRow label="Total Appointments" value={String(appointments.length)} />
                  <InfoRow label="Confirmed"           value={String(confirmed.length)} />
                  <InfoRow label="Completed"           value={String(appointments.filter(a=>a.status==='completed').length)} />
                  <InfoRow label="Cancelled"           value={String(appointments.filter(a=>a.status==='cancelled').length)} />
                  <InfoRow label="Total Revenue"       value={`PKR ${revenue.toLocaleString()}`} />
                  <InfoRow label="Supabase"            value={isSupabaseConfigured ? 'Connected' : 'Not configured'} />
                </div>

                {!isSupabaseConfigured && (
                  <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="font-dmsans font-bold text-amber-800 text-xs uppercase tracking-wide mb-1">
                      Setup Supabase
                    </div>
                    <p className="font-sourcesans text-amber-700 text-xs leading-relaxed">
                      Create a <code className="bg-amber-100 px-1 rounded">.env</code> file with your Supabase URL and anon key to enable the central database. See <code className="bg-amber-100 px-1 rounded">SUPABASE_SETUP.md</code> for instructions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Small stat icons ─────────────────────────────────────
const CalIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/><path d="M3 9H21M8 2V6M16 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/><path d="M12 7V12L15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const PKRIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/><path d="M9 8H14C15.1 8 16 8.9 16 10C16 11.1 15.1 12 14 12H9V8ZM9 12H15M9 12V16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>;

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
    <span className="font-sourcesans text-text-secondary text-sm">{label}</span>
    <span className="font-dmsans font-bold text-text-primary text-sm">{value}</span>
  </div>
);

// ── Status pill component ─────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  pending:       { label: 'Pending',       bg: 'bg-red-100',    text: 'text-red-700' },
  confirmed:     { label: 'Confirmed',     bg: 'bg-green-100',  text: 'text-green-700' },
  completed:     { label: 'Completed',     bg: 'bg-blue-100',   text: 'text-blue-700' },
  cancelled:     { label: 'Cancelled',     bg: 'bg-gray-100',   text: 'text-gray-600' },
  not_confirmed: { label: 'Not Confirmed', bg: 'bg-red-100',    text: 'text-red-700' },
  not_arrived:   { label: 'Not Arrived',   bg: 'bg-amber-100',  text: 'text-amber-700' },
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_MAP[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-dmsans font-bold whitespace-nowrap ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

export default AdminPanel;
