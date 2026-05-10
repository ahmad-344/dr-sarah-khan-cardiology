# Supabase Setup Guide
## Dr. Sarah Khan — Database Connection

---

## Step 1: Supabase Account Banao

1. Jao: **https://supabase.com**
2. "Start your project" click karo
3. GitHub se sign up karo (free)

---

## Step 2: New Project Banao

1. Dashboard pe "New Project" click karo
2. Organization select karo (apna naam)
3. Project details:
   - **Name:** `dr-sarah-khan`
   - **Database Password:** ek strong password (save kar lo)
   - **Region:** `Southeast Asia (Singapore)` — Pakistan ke liye closest
4. "Create new project" click karo
5. **1-2 minute wait karo** — project ready ho raha hai

---

## Step 3: Database Tables Banao

1. Left sidebar mein **"SQL Editor"** click karo
2. **"New query"** click karo
3. `supabase-schema.sql` file ka **poora content** copy karo
4. SQL Editor mein paste karo
5. **"Run"** button click karo (ya Ctrl+Enter)
6. "Success" message aaye ga — tables ban gayi hain

---

## Step 4: API Keys Lo

1. Left sidebar mein **"Project Settings"** (gear icon) click karo
2. **"API"** section mein jao
3. Do cheezein copy karo:
   - **Project URL** → looks like: `https://abcdefgh.supabase.co`
   - **anon public key** → long string starting with `eyJ...`

---

## Step 5: .env File Banao

Project folder mein `.env` naam ki file banao aur yeh likho:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** `.env.example` file already mojood hai — isko copy karke `.env` banao:
```bash
copy .env.example .env
# Windows mein
# Mac/Linux mein: cp .env.example .env
```

Phir apni real values daal do.

---

## Step 6: Server Restart Karo

```bash
# Server band karo (Ctrl+C)
# Dobara start karo:
npm run dev
```

---

## Verify Ho Gaya?

Admin Panel kholo: **http://localhost:5173/#admin**

Login karo (password: `admin@2025`)

Agar sab theek hai to header mein:
- **"Live DB"** green badge dikh raha hoga
- Settings tab mein "Supabase Connected" dikh raha hoga

---

## Ab Kya Hoga?

- Koi bhi patient **kisi bhi computer** se booking kare ga
- Booking **Supabase database** mein save ho gi
- Aap **admin panel** mein sab ki bookings real-time dekh sako ge
- Ek computer se settings change karo (date block karo) → **sab users ke liye instantly update**
- Real-time notifications: naya booking aate hi admin panel mein **"New"** badge aata hai

---

## Troubleshooting

**"Local mode" dikh raha hai?**
→ `.env` file check karo, values sahi hain?
→ `npm run dev` dobara start karo

**"Sync Error" dikh raha hai?**
→ Supabase project active hai? (free tier 7 din baad pause ho jata hai)
→ SQL schema sahi se run hua? SQL Editor mein dobara run karo

**Koi booking nahi dikh rahi?**
→ Pehle ek test booking karo website se
→ Admin panel mein "Refresh" button dabao

---

## Important Notes

- Supabase **free tier** mein 50,000 database rows free hain
- Free tier project **7 din inactivity** ke baad pause ho jata hai (dobara activate karo)
- Production ke liye Pro plan ($25/month) recommend hai
- `.env` file kabhi GitHub pe push mat karo — `.gitignore` mein already hai
