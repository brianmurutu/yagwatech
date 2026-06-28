import React from "react";

// Crisp inline SVG logo representations for Kenyan clients
export const SafaricomLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Iconic green/red swoosh circle */}
    <circle cx="20" cy="20" r="16" fill="#09B83E" />
    <path d="M12 20C12 24.4183 15.5817 28 20 28C24.4183 28 28 24.4183 28 20" stroke="#E31E24" strokeWidth="3" strokeLinecap="round" />
    <circle cx="20" cy="20" r="8" fill="#ffffff" />
    <circle cx="20" cy="20" r="4" fill="#E31E24" />
    {/* Typography */}
    <text x="44" y="26" fill="currentColor" fontSize="19" fontWeight="bold" fontFamily="sans-serif">Safaricom</text>
  </svg>
);

export const KcbLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* KCB Green & Golden Shield Badge */}
    <rect x="4" y="4" width="32" height="32" rx="6" fill="#00833F" />
    {/* Lion silhouette key shape inside shield */}
    <path d="M20 10C24 10 26 12 26 16C26 22 20 28 20 28C20 28 14 22 14 16C14 12 16 10 20 10Z" fill="#F9A825" />
    <circle cx="20" cy="16" r="3" fill="#00833F" />
    <text x="46" y="27" fill="currentColor" fontSize="23" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">KCB</text>
  </svg>
);

export const EquityLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Equity Brown/Red House Icon */}
    <path d="M6 14L20 4L34 14V34H6V14Z" fill="#A16B56" />
    <rect x="13" y="18" width="14" height="16" fill="#ffffff" />
    <path d="M6 14L20 4L34 14" stroke="#C62828" strokeWidth="3" strokeLinecap="round" />
    <text x="44" y="26" fill="currentColor" fontSize="20" fontWeight="bold" fontFamily="sans-serif">EQUITY</text>
  </svg>
);

export const CoopLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Co-op Bank Green Bold Monogram */}
    <rect x="4" y="8" width="40" height="24" rx="4" fill="#00A859" />
    <text x="10" y="25" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">CO-OP</text>
    <text x="52" y="22" fill="currentColor" fontSize="14" fontWeight="bold" fontFamily="sans-serif">THE CO-OPERATIVE</text>
    <text x="52" y="32" fill="currentColor" fontSize="10" fontWeight="medium" fontFamily="sans-serif" letterSpacing="0.8">BANK OF KENYA</text>
  </svg>
);

// Crisp inline SVG logo representations for tech partners
export const AwsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* AWS Text */}
    <text x="10" y="28" fill="currentColor" fontSize="26" fontWeight="bold" fontFamily="sans-serif">aws</text>
    {/* Smiling curved orange arrow */}
    <path d="M12 32C24 38 42 38 52 32" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M52 32L47 28M52 32L49 36" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const MicrosoftLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Four colored squares grid */}
    <rect x="4" y="6" width="13" height="13" fill="#F25022" />
    <rect x="19" y="6" width="13" height="13" fill="#7FBA00" />
    <rect x="4" y="21" width="13" height="13" fill="#00A4EF" />
    <rect x="19" y="21" width="13" height="13" fill="#FFB900" />
    <text x="40" y="27" fill="currentColor" fontSize="19" fontWeight="semibold" fontFamily="sans-serif" letterSpacing="-0.5">Microsoft</text>
  </svg>
);

export const CiscoLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Cisco bar waves */}
    <line x1="12" y1="22" x2="12" y2="12" stroke="#00BCEB" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="18" y1="22" x2="18" y2="8" stroke="#00BCEB" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="22" x2="24" y2="4" stroke="#00BCEB" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="30" y1="22" x2="30" y2="8" stroke="#00BCEB" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="36" y1="22" x2="36" y2="12" stroke="#00BCEB" strokeWidth="2.5" strokeLinecap="round" />
    <text x="48" y="25" fill="currentColor" fontSize="19" fontWeight="bold" fontFamily="sans-serif" letterSpacing="-0.2">CISCO</text>
  </svg>
);

export const GcpLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Hexagonal Google Cloud Platform Symbol */}
    <path d="M12 14L22 8L32 14V26L22 32L12 26V14Z" fill="#4285F4" stroke="#4285F4" strokeWidth="2" />
    <path d="M22 8V20L12 14M22 20L32 14M22 20V32" stroke="#ffffff" strokeWidth="2.5" />
    <circle cx="22" cy="20" r="3" fill="#EA4335" />
    <text x="40" y="26" fill="currentColor" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Google Cloud</text>
  </svg>
);
