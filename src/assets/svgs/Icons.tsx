import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const CaduceusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C12 2 9 4 9 7C9 9.5 10.5 11 12 11C13.5 11 15 9.5 15 7C15 4 12 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 7C7 8 6 10 7 12C8 14 10 14 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 7C17 8 18 10 17 12C16 14 14 14 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 13C7 14 6 16 7 18C8 20 10 20 12 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 13C17 14 18 16 17 18C16 20 14 20 12 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 22H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HeartPulseIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M19.5 12.572L12 20L4.5 12.572C3.09 11.21 3.09 9.01 4.5 7.65C5.91 6.29 8.22 6.29 9.63 7.65L12 10L14.37 7.65C15.78 6.29 18.09 6.29 19.5 7.65C20.91 9.01 20.91 11.21 19.5 12.572Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H6L8 9L10 15L12 12H16L18 10L20 13L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M19.5 12.572L12 20L4.5 12.572C3.09 11.21 3.09 9.01 4.5 7.65C5.91 6.29 8.22 6.29 9.63 7.65L12 10L14.37 7.65C15.78 6.29 18.09 6.29 19.5 7.65C20.91 9.01 20.91 11.21 19.5 12.572Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21.5C16.6 20.5 20 16.4 20 12V7L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ActivityIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ScanIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 7V5C3 3.9 3.9 3 5 3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 3H19C20.1 3 21 3.9 21 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M21 17V19C21 20.1 20.1 21 19 21H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 21H5C3.9 21 3 20.1 3 19V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const BarChartIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="10" width="4" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="10" y="6" width="4" height="15" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 21H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 2V6M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor"/>
    <rect x="14" y="13" width="3" height="3" rx="0.5" fill="currentColor"/>
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C8.69 2 6 4.69 6 8C6 12.5 12 20 12 20C12 20 18 12.5 18 8C18 4.69 15.31 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="12" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 8L12 13L22 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8.5 12L10.5 14L15.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({ className = '', size = 16, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 20C4 17.8 7.6 16 12 16C16.4 16 20 17.8 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const VideoIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 9.5L22 6V18L16 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RefreshCwIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M23 4V10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 20V14H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 9C4.01 7.54 4.87 6.23 6.01 5.18C7.15 4.13 8.54 3.38 10.04 3C11.54 2.62 13.12 2.62 14.62 3C16.12 3.38 17.51 4.13 18.65 5.18L23 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 14L5.35 18.82C6.49 19.87 7.88 20.62 9.38 21C10.88 21.38 12.46 21.38 13.96 21C15.46 20.62 16.85 19.87 17.99 18.82C19.13 17.77 19.99 16.46 20.49 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10.29 3.86L1.82 18C1.64 18.32 1.55 18.68 1.55 19.05C1.55 19.41 1.64 19.77 1.82 20.09C2 20.41 2.25 20.68 2.57 20.87C2.88 21.06 3.24 21.15 3.6 21.15H20.54C20.9 21.15 21.26 21.06 21.57 20.87C21.89 20.68 22.14 20.41 22.32 20.09C22.5 19.77 22.59 19.41 22.59 19.05C22.59 18.68 22.5 18.32 22.32 18L13.85 3.86C13.67 3.54 13.41 3.28 13.1 3.1C12.78 2.92 12.43 2.83 12.07 2.83C11.71 2.83 11.36 2.92 11.04 3.1C10.73 3.28 10.47 3.54 10.29 3.86Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HospitalIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="6" width="20" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 22V18H16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 11H14M12 9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 6V4C7 3.45 7.45 3 8 3H16C16.55 3 17 3.45 17 4V6" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const GraduationCapIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M6 10V16C6 16 8 19 12 19C16 19 18 16 18 16V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const AwardIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17 21V19C17 17.9 16.1 17 15 17H5C3.9 17 3 17.9 3 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="11" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M23 21V19C23 17.9 22.1 17 21 17H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 3.13C17.9 3.58 19.5 5.1 19.5 7C19.5 8.9 17.9 10.42 16 10.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ClipboardIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="8" y="1" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12H15M9 16H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21.5C16.6 20.5 20 16.4 20 12V7L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 3H8C9.06 3 10.08 3.42 10.83 4.17C11.58 4.92 12 5.94 12 7V21C12 20.2 11.68 19.44 11.12 18.88C10.56 18.32 9.8 18 9 18H2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M22 3H16C14.94 3 13.92 3.42 13.17 4.17C12.42 4.92 12 5.94 12 7V21C12 20.2 12.32 19.44 12.88 18.88C13.44 18.32 14.2 18 15 18H22V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
