# Dr. Sarah Khan — Interventional Cardiologist Portfolio Website

Premium, fully functional cardiologist portfolio with appointment booking system, admin panel, specialty detail pages, and patient management.

---

## PC Setup — 3 Commands

### Requirements
- Node.js 18+ → Download: https://nodejs.org (LTS version)

### Steps

```bash
# 1. Go into project folder
cd dr-sarah-khan

# 2. Install dependencies (first time only — takes 1-2 minutes)
npm install

# 3. Start development server
npm run dev
```

Open browser: **http://localhost:5173**

### Production Build
```bash
npm run build
npm run preview
```

---

## Admin Panel

URL: **http://localhost:5173/#admin**

Password: **admin@2025**

Admin panel features:
- Dashboard with today's appointments & revenue
- Calendar to block/unblock specific dates
- Block individual time slots per date
- View & cancel all appointments
- Toggle online booking on/off

---

## Project Structure

```
dr-sarah-khan/
├── public/
│   ├── favicon.svg
│   └── images/               ← Put 3 images here
│       ├── doctor-profile.jpg
│       ├── doctor-about.jpg
│       └── hospital-exterior.jpg
├── src/
│   ├── assets/svgs/
│   │   └── Icons.tsx          ← All SVG icons (30+)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     ← Sticky nav, scroll-highlight, mobile
│   │   │   └── Footer.tsx     ← Emergency banner, links
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── QuickInfoBar.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Specialties.tsx       ← Learn More → detail page
│   │   │   ├── SpecialtyDetail.tsx   ← Full page per specialty
│   │   │   ├── AppointmentsBooking.tsx ← 4-step wizard
│   │   │   ├── MyAppointments.tsx    ← Cancel/reschedule
│   │   │   ├── PatientInfo.tsx       ← FAQ accordion
│   │   │   ├── Testimonials.tsx
│   │   │   └── HospitalInfo.tsx      ← Real Google Maps
│   │   └── ui/
│   │       ├── Calendar.tsx          ← Custom calendar (admin-aware)
│   │       ├── TimeSlotPicker.tsx    ← Admin-aware time slots
│   │       └── ConfirmationCard.tsx  ← PDF download
│   ├── data/
│   │   ├── constants.ts       ← All static data & fees
│   │   └── specialtyDetails.ts ← Rich content for 6 specialties
│   ├── hooks/
│   │   ├── useAppointments.ts  ← localStorage CRUD
│   │   └── useAdminSettings.ts ← Admin availability management
│   ├── pages/
│   │   ├── AdminPanel.tsx     ← Password-protected admin
│   │   ├── PrivacyPolicy.tsx
│   │   └── TermsOfService.tsx
│   ├── types/index.ts
│   ├── utils/helpers.ts
│   ├── App.tsx                ← Router (home/specialty/admin/privacy/terms)
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## Images — Leonardo AI Prompts

Put all 3 images in: **public/images/**

### 1. doctor-profile.jpg — Hero section circle

**Prompt:**
```
Professional Pakistani female cardiologist doctor, mid 40s, 
wearing pristine white medical coat, stethoscope around neck, 
warm confident smile, looking directly at camera, 
soft professional studio lighting, clean white background, 
sharp focus, photorealistic, 8K, clinical headshot
```
**Ratio:** 1:1 (1024×1024px)
**File:** `public/images/doctor-profile.jpg`

---

### 2. doctor-about.jpg — About section

**Prompt:**
```
South Asian female doctor in her mid 40s sitting at modern 
hospital consultation desk, reviewing cardiac reports on tablet, 
white medical coat, natural clinical lighting, warm expression, 
modern hospital interior, 3/4 portrait, photorealistic, 4K
```
**Ratio:** 4:3 (1200×900px)
**File:** `public/images/doctor-about.jpg`

---

### 3. hospital-exterior.jpg — Hospital Info section

**Prompt:**
```
Modern private hospital building exterior in Islamabad Pakistan, 
contemporary glass and white architecture, clean entrance, 
manicured garden, blue sky, golden hour light, 
professional architectural photography, 4K
```
**Ratio:** 16:9 (1600×900px)
**File:** `public/images/hospital-exterior.jpg`

---

## Features Completed

- [x] Sticky Navbar with scroll-based section highlighting
- [x] Hero section with animated floating icons
- [x] Quick info bar
- [x] About section with credentials, awards, memberships
- [x] 6 Specialty cards → each opens full detail page with conditions, procedures, FAQs
- [x] 4-step appointment booking wizard with validation
- [x] Custom calendar (reads admin blocked dates)
- [x] Time slot picker (reads admin blocked times)
- [x] Appointment confirmation with PDF download (jsPDF)
- [x] Add to Calendar (.ics file)
- [x] My Appointments — view, cancel, reschedule
- [x] Patient Info FAQ accordion
- [x] Testimonials with rating breakdown
- [x] Real Google Maps iframe
- [x] Admin Panel (password: admin@2025) — block dates, time slots, view all bookings
- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Mobile responsive everywhere
- [x] Phone: +92-319-0539976 throughout
- [x] All SVG icons (no emojis)
