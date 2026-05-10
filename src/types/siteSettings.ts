// ── All editable website content ────────────────────────────

export interface DoctorInfo {
  name: string;
  title: string;
  tagline: string;
  experience: string;
  credentials: string;   // e.g. "MBBS | FCPS | Mayo Clinic Fellow"
  education: { year: string; degree: string; institution: string }[];
  awards: { title: string; body: string }[];
  memberships: string[];
  publications: string;
  philosophy: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  emergencyLine: string;
}

export interface ClinicHours {
  weekdays: string;   // e.g. "9:00 AM – 5:00 PM"
  saturday: string;
  sunday: string;
  emergency: string;
}

export interface ConsultationFees {
  inClinic: number;
  followUp: number;
  teleconsultation: number;
  urgent: number;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface ReviewItem {
  name: string;
  rating: number;
  review: string;
  date: string;
  condition: string;
}

export interface SiteSettings {
  doctor: DoctorInfo;
  contact: ContactInfo;
  clinicHours: ClinicHours;
  fees: ConsultationFees;
  services: ServiceItem[];
  reviews: ReviewItem[];
  insuranceProviders: string[];
  lastUpdated: string;
}

// ── Default (current hardcoded) values ───────────────────────
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  doctor: {
    name: 'Dr. Sarah Khan',
    title: 'Interventional Cardiologist',
    tagline: '18 years of saving hearts and changing lives. I believe every patient deserves not just excellent treatment — but genuine compassion.',
    experience: '18',
    credentials: 'MBBS (KEMU) | FCPS Cardiology | Mayo Clinic Fellow',
    education: [
      { year: '2005',      degree: 'MBBS',                          institution: 'King Edward Medical University (KEMU), Lahore' },
      { year: '2011',      degree: 'FCPS Cardiology',               institution: 'College of Physicians & Surgeons Pakistan (CPSP)' },
      { year: '2013–2015', degree: 'Fellowship — Interventional Cardiology', institution: 'Mayo Clinic, Rochester, USA' },
      { year: '2016',      degree: 'Post-Doctoral Research',        institution: 'Cleveland Clinic, Cleveland, USA' },
    ],
    awards: [
      { title: 'Best Cardiologist Award',  body: 'Higher Education Commission (HEC) — 2022' },
      { title: 'Research Excellence Award', body: 'Pakistan Society of Interventional Cardiology (PSIC) — 2021' },
      { title: 'Top Doctor — Islamabad',   body: 'Health Magazine Pakistan — 2023' },
    ],
    memberships: [
      'Pakistan Cardiac Society (Fellow)',
      'American College of Cardiology (International Member)',
      'European Society of Cardiology',
      'Pakistan Medical & Dental Council (Licensed)',
    ],
    publications: '28+',
    philosophy: 'I treat the whole person, not just the condition. Every patient who walks through my door has a story, a family, a life they want to return to.',
  },
  contact: {
    phone: '+92-319-0539976',
    email: 'contactahmad.services@gmail.com',
    address: 'Islamabad Heart Institute, G-8/4, Islamabad 44000, Pakistan',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3322.0!2d73.0621!3d33.6960!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbef5d5c95bc3%3A0x67fce8a74f1f5421!2sG-8%2F4%2C%20Islamabad!5e0!3m2!1sen!2s!4v1711617600000!5m2!1sen!2s',
    emergencyLine: '1122',
  },
  clinicHours: {
    weekdays: '9:00 AM – 5:00 PM',
    saturday: '9:00 AM – 1:00 PM',
    sunday:   'Closed',
    emergency:'24 / 7',
  },
  fees: {
    inClinic:        3000,
    followUp:        1500,
    teleconsultation:2000,
    urgent:          5000,
  },
  services: [
    { title: 'Interventional Cardiology',       description: 'Coronary angiography, stenting, and advanced catheter-based heart procedures using state-of-the-art technology.', icon: 'heart-pulse' },
    { title: 'Heart Failure Management',         description: 'Comprehensive, multidisciplinary care for acute and chronic heart failure with personalised treatment plans.',        icon: 'heart' },
    { title: 'Preventive Cardiology',            description: 'Evidence-based risk assessment, lifestyle modification programmes, and prevention of future cardiac events.',         icon: 'shield-check' },
    { title: 'Cardiac Electrophysiology',        description: 'Arrhythmia diagnosis, ablation procedures, and pacemaker implantation with high procedural success rates.',           icon: 'activity' },
    { title: 'Echocardiography',                 description: 'Advanced cardiac imaging including 2D, 3D echo and stress echocardiography for precise diagnostics.',                icon: 'scan' },
    { title: 'Hypertension & Lipid Management',  description: 'Evidence-based management of blood pressure disorders and lipid abnormalities to reduce cardiovascular risk.',         icon: 'bar-chart' },
  ],
  reviews: [
    { name: 'Fatima Malik',   rating: 5, review: 'Dr. Sarah Khan saved my father\'s life. Her expertise in interventional cardiology is exceptional. She explained every step with patience and genuine care.',  date: 'January 2025',  condition: 'Coronary Angioplasty Patient' },
    { name: 'Ahmed Raza',     rating: 5, review: 'I have been a patient for three years. Dr. Khan\'s thoroughness and ability to explain complex cardiac conditions in simple terms gives me confidence in my treatment.', date: 'February 2025', condition: 'Heart Failure Management' },
    { name: 'Sana Qureshi',   rating: 5, review: 'The online booking made everything convenient. The clinic is immaculate, staff professional, and Dr. Khan is outstanding. She genuinely listens.',                 date: 'December 2024', condition: 'Preventive Cardiology' },
    { name: 'Usman Tariq',    rating: 4, review: 'Very professional and knowledgeable. The appointment was on time and thorough. I appreciated the follow-up call from her team.',                                    date: 'March 2025',    condition: 'Hypertension Management' },
    { name: 'Zainab Hussain', rating: 5, review: 'After years of misdiagnosis elsewhere, Dr. Khan identified my condition immediately. Her diagnostic skills and use of advanced echocardiography made all the difference.', date: 'February 2025', condition: 'Echocardiography & Diagnosis' },
  ],
  insuranceProviders: ['Jubilee Health', 'EFU Insurance', 'State Life', 'Sehat Sahulat', 'Adamjee', 'Nayatel Health'],
  lastUpdated: new Date().toISOString(),
};
