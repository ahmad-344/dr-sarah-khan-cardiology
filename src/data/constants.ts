import type { TimeSlot, Specialty, Testimonial, FAQ, NavLink } from '../types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Specialties', href: '#specialties' },
  { label: 'Appointments', href: '#appointments' },
  { label: 'Patient Info', href: '#patient-info' },
  { label: 'Contact', href: '#contact' },
];

export const APPOINTMENT_FEES: Record<string, number> = {
  'in-clinic': 3000,
  'teleconsultation': 2000,
  'follow-up': 1500,
  'urgent': 5000,
};

export const TIME_SLOTS: TimeSlot[] = [
  { time: '09:00', label: '9:00 AM',  available: true, period: 'morning' },
  { time: '09:30', label: '9:30 AM',  available: true, period: 'morning' },
  { time: '10:00', label: '10:00 AM', available: true, period: 'morning' },
  { time: '10:30', label: '10:30 AM', available: true, period: 'morning' },
  { time: '11:00', label: '11:00 AM', available: true, period: 'morning' },
  { time: '11:30', label: '11:30 AM', available: true, period: 'morning' },
  { time: '14:00', label: '2:00 PM',  available: true, period: 'afternoon' },
  { time: '14:30', label: '2:30 PM',  available: true, period: 'afternoon' },
  { time: '15:00', label: '3:00 PM',  available: true, period: 'afternoon' },
  { time: '15:30', label: '3:30 PM',  available: true, period: 'afternoon' },
  { time: '16:00', label: '4:00 PM',  available: true, period: 'evening' },
  { time: '16:30', label: '4:30 PM',  available: true, period: 'evening' },
];

// UNAVAILABLE_DATES is kept empty here — admin panel controls blocked dates via Supabase/localStorage
export const UNAVAILABLE_DATES: string[] = [];

export const SPECIALTIES: Specialty[] = [
  {
    title: 'Interventional Cardiology',
    description: 'Coronary angiography, stenting, and advanced catheter-based heart procedures using state-of-the-art technology.',
    icon: 'heart-pulse',
  },
  {
    title: 'Heart Failure Management',
    description: 'Comprehensive, multidisciplinary care for acute and chronic heart failure with personalised treatment plans.',
    icon: 'heart',
  },
  {
    title: 'Preventive Cardiology',
    description: 'Evidence-based risk assessment, lifestyle modification programmes, and prevention of future cardiac events.',
    icon: 'shield-check',
  },
  {
    title: 'Cardiac Electrophysiology',
    description: 'Arrhythmia diagnosis, ablation procedures, and pacemaker implantation with high procedural success rates.',
    icon: 'activity',
  },
  {
    title: 'Echocardiography',
    description: 'Advanced cardiac imaging including 2D, 3D echo and stress echocardiography for precise diagnostics.',
    icon: 'scan',
  },
  {
    title: 'Hypertension & Lipid Management',
    description: 'Evidence-based management of blood pressure disorders and lipid abnormalities to reduce cardiovascular risk.',
    icon: 'bar-chart',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Fatima Malik',
    rating: 5,
    review: 'Dr. Sarah Khan saved my father\'s life. Her expertise in interventional cardiology is exceptional. She explained every step of the procedure with patience and genuine care. We are forever grateful.',
    date: 'January 2025',
    condition: 'Coronary Angioplasty Patient',
  },
  {
    name: 'Ahmed Raza',
    rating: 5,
    review: 'I have been a patient for three years now. Dr. Khan\'s thoroughness and her ability to explain complex cardiac conditions in simple terms gives me confidence in my treatment. Highly recommended.',
    date: 'February 2025',
    condition: 'Heart Failure Management',
  },
  {
    name: 'Sana Qureshi',
    rating: 5,
    review: 'The online booking system made everything so convenient. The clinic is immaculate, the staff are professional, and Dr. Khan is outstanding. She genuinely listens and does not rush consultations.',
    date: 'December 2024',
    condition: 'Preventive Cardiology',
  },
  {
    name: 'Usman Tariq',
    rating: 4,
    review: 'Very professional and knowledgeable doctor. The appointment was on time and the consultation was thorough. I appreciated the follow-up call from her team to check on my progress.',
    date: 'March 2025',
    condition: 'Hypertension Management',
  },
  {
    name: 'Zainab Hussain',
    rating: 5,
    review: 'After years of misdiagnosis elsewhere, Dr. Khan identified my condition immediately. Her diagnostic skills and the use of advanced echocardiography made all the difference. Exceptional physician.',
    date: 'February 2025',
    condition: 'Echocardiography & Diagnosis',
  },
];

export const FAQS: FAQ[] = [
  {
    question: 'What should I bring to my first visit?',
    answer: 'Please bring a valid CNIC or passport, your complete medical history, previous ECGs, echo reports, blood tests, and a list of all current medications including dosages. If you are referred by another doctor, please bring the referral letter. Arriving 15 minutes early allows our team to complete initial paperwork.',
  },
  {
    question: 'How do I prepare for an echocardiogram?',
    answer: 'For a standard transthoracic echocardiogram, no special preparation is required. You may eat and drink normally and take your regular medications. Wear comfortable, loose-fitting clothing. For a stress echocardiogram, avoid eating for at least 3 hours beforehand and wear comfortable exercise clothes. Our cardiac sonographers will guide you through the procedure.',
  },
  {
    question: 'What insurance panels does the clinic accept?',
    answer: 'We accept all major insurance providers in Pakistan including Jubilee Life Insurance, EFU Health Insurance, State Life Corporation, Sehat Sahulat Programme (Government employees), Adamjee Insurance, and most corporate health schemes. Please carry your insurance card and policy documents. Our billing team will verify your coverage before your appointment.',
  },
  {
    question: 'How do I set up a teleconsultation?',
    answer: 'After booking a teleconsultation appointment online, you will receive a confirmation SMS and email with a secure video link (Google Meet). Ensure you have a stable internet connection, a quiet environment, and your medical reports ready. You can also share documents digitally before the session. The link activates 10 minutes before your appointment time.',
  },
  {
    question: 'What should I do in a cardiac emergency after hours?',
    answer: 'If you experience severe chest pain, shortness of breath, sudden dizziness, palpitations, or any acute cardiac symptoms — call 1122 (Rescue) immediately or go to the nearest emergency room. Do not drive yourself. The Islamabad Heart Institute emergency department is available 24/7 at +92-319-0539976 (emergency line). Dr. Khan\'s on-call team is always available for existing patients.',
  },
];

export const INSURANCE_PROVIDERS = [
  'Jubilee Health',
  'EFU Insurance',
  'State Life',
  'Sehat Sahulat',
  'Adamjee',
  'Nayatel Health',
];
