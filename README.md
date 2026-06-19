# 🏥 Dr. Sarah Khan — Interventional Cardiologist Portfolio

> A full-stack, production-ready medical portfolio and appointment booking platform built with React, TypeScript, and Supabase. Features a complete patient booking flow, real-time slot management, PDF generation, and a comprehensive admin panel.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🌐 Live Demo

| Link | URL |
|------|-----|
| 🔗 Website | [dr-sarah-khan.vercel.app](https://dr-sarah-khan-cardiology.vercel.app/) |
| 🔐 Admin Panel | `yoursite.vercel.app/#admin` — Password: `admin@2025` |

---

## 📸 Screenshots

> Hero section, booking wizard, admin dashboard, and PDF confirmation all in one polished UI.

---

## ✨ Features

### 👤 Patient Side
| Feature | Description |
|---------|-------------|
| 🗓️ Appointment Booking | 4-step wizard: type → date → time → patient details |
| ⏱️ Real-time Slots | Booked slots marked instantly without page reload |
| 📋 My Appointments | Phone-based lookup — view, cancel, reschedule |
| 📄 PDF Confirmation | Download appointment with doctor photo, badge, details |
| 📅 Calendar Export | Google Calendar direct link + Apple/Outlook .ics file |
| 🏥 6 Specialty Pages | Detailed pages for each medical specialty |
| 🗺️ Google Maps | Embedded hospital location map |
| 📱 Fully Responsive | Works perfectly on mobile, tablet, and desktop |

### 🔧 Admin Panel (`/#admin`)
| Feature | Description |
|---------|-------------|
| 📊 Dashboard | Date selector — view any day's appointments with color-coded statuses |
| ✅ Status Management | Pending → Confirmed → Completed / Not Arrived (full flow) |
| 🤖 Auto Status | Appointments auto-escalate when time passes without action |
| 📆 Availability | Block specific dates or time slots for any date |
| ✏️ Content Editor | Edit ALL website content from admin — no code needed |
| 🔄 Real-time Sync | Admin changes reflect on website instantly via Supabase Realtime |
| 🔒 Password Protected | Secure login with configurable password |
| 📈 Stats | Total bookings, pending, confirmed, revenue tracking |

### 📝 Content Editor (Admin → Content Tab)
Everything on the website is editable from the admin panel:
- Doctor name, title, tagline, experience, education, awards, memberships
- Contact info, phone, email, address, Google Maps URL
- Clinic hours (weekdays, Saturday, Sunday, emergency)
- Consultation fees (all 4 types)
- Services / Specialties titles and descriptions
- Patient reviews and ratings
- Insurance providers list

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Frontend | React 18 + TypeScript | UI components and type safety |
| Bundler | Vite 4 | Fast dev server and build |
| Styling | Tailwind CSS 3 | Utility-first responsive design |
| Database | Supabase (PostgreSQL) | Appointments, settings, content storage |
| Realtime | Supabase Realtime | Live updates across browser tabs |
| PDF | jsPDF 2 + HTML Canvas | Appointment confirmation PDFs |
| State | React Context + Hooks | Global settings, local state |
| Hosting | Vercel | Zero-config deployment |

---

## 📁 Project Structure

```
dr-sarah-khan/
├── public/
│   └── images/
│       ├── doctor-profile.jpg     ← Hero circle photo
│       ├── doctor-about.jpg       ← About section photo
│       └── hospital-exterior.jpg  ← Hospital section
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── ContentEditor.tsx  ← Full website content editor
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         ← Sticky nav with scroll highlight
│   │   │   └── Footer.tsx         ← Dynamic footer with all contact info
│   │   ├── sections/
│   │   │   ├── Hero.tsx           ← Landing section
│   │   │   ├── About.tsx          ← Doctor credentials
│   │   │   ├── Specialties.tsx    ← 6 specialty cards
│   │   │   ├── AppointmentsBooking.tsx  ← 4-step booking wizard
│   │   │   ├── MyAppointments.tsx ← Patient portal
│   │   │   ├── Testimonials.tsx   ← Patient reviews
│   │   │   └── HospitalInfo.tsx   ← Location + Google Maps
│   │   └── ui/
│   │       ├── Calendar.tsx       ← Custom calendar (admin-aware)
│   │       ├── TimeSlotPicker.tsx ← Live slot availability
│   │       └── ConfirmationCard.tsx ← Booking confirmation + PDF
│   ├── hooks/
│   │   ├── useAppointments.ts     ← CRUD + Supabase sync
│   │   ├── useAdminSettings.ts    ← Availability management
│   │   └── useSiteSettings.ts     ← Content + Realtime subscription
│   ├── lib/
│   │   ├── supabase.ts            ← Supabase client
│   │   └── db.ts                  ← All database operations
│   ├── pages/
│   │   ├── AdminPanel.tsx         ← Full admin dashboard
│   │   ├── PrivacyPolicy.tsx
│   │   └── TermsOfService.tsx
│   ├── types/                     ← TypeScript interfaces
│   └── utils/
│       ├── helpers.ts             ← Date/time helpers
│       └── generatePDF.ts         ← PDF generation with canvas
├── supabase-schema.sql            ← Run this in Supabase SQL editor
├── .env.example                   ← Copy to .env and add your keys
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** → [nodejs.org](https://nodejs.org)
- **Supabase account** → [supabase.com](https://supabase.com) (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/ahmad-344/dr-sarah-khan-cardiology.git
cd dr-sarah-khan-cardiology
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase Database
1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Copy the contents of `supabase-schema.sql` and run it
4. Go to **Project Settings** → **API** and copy:
   - Project URL
   - anon/public key

### 4. Configure Environment Variables
```bash
cp .env.example .env
```
Open `.env` and fill in:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run Development Server
```bash
npm run dev
```
Open **http://localhost:5173**

### 6. Access Admin Panel
Go to **http://localhost:5173/#admin**
Password: `admin@2025`

---

## 🌍 Deploying to Vercel

### Option A — Via Vercel Dashboard (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**

### Option B — Via CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts — Vercel auto-detects Vite.

### Build Settings (auto-detected)
| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## 🔐 Appointment Status Flow

```
Patient books
     ↓
  PENDING  ──── time passes without action ──→  NOT CONFIRMED
     ↓ admin confirms
  CONFIRMED ─── patient doesn't show ─────────→  NOT ARRIVED
     ↓ patient arrives
  COMPLETED

  Any status ──── admin cancels ──────────────→  CANCELLED
```

| Status | Color | Meaning |
|--------|-------|---------|
| 🔴 Pending | Red | New booking, awaiting admin confirmation |
| 🟢 Confirmed | Green | Admin confirmed the appointment |
| 🔵 Completed | Blue | Patient visited, appointment done |
| 🟡 Not Arrived | Amber | Patient didn't show up |
| 🔴 Not Confirmed | Red | Time passed without confirmation |
| ⬛ Cancelled | Grey | Cancelled by patient or admin |

---

## ⚙️ Customization

### Change Admin Password
Open `src/hooks/useAdminSettings.ts` → Line 6:
```ts
const ADMIN_PASSWORD = 'admin@2025'; // ← Change this
```

### Update Doctor Information
Go to **Admin Panel → Content Tab** — no code needed.
All content is editable from the UI and saves to the database.

### Add Your Own Images
Replace these files in `public/images/`:
- `doctor-profile.jpg` — 1:1 ratio, for the hero circle
- `doctor-about.jpg` — 4:3 ratio, for the about section
- `hospital-exterior.jpg` — 16:9 ratio, for hospital section

---

## 📄 License

MIT License — free to use, modify, and deploy for personal and commercial projects.

---

## 👨‍💻 Built By

**Ahmad** — Full-stack developer  
📧 contactahmad.services@gmail.com  
🐙 [github.com/ahmad-344](https://github.com/ahmad-344)

---

*Built with ❤️ using React + TypeScript + Supabase*
