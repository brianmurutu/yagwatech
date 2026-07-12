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

export const SirBrianLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 190 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Dev / engineering icon */}
    <rect x="4" y="6" width="28" height="28" rx="6" fill="#F47B20" />
    <path d="M12 14L8 20L12 26M24 14L28 20L24 26" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 13L17 27" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
    <text x="42" y="26" fill="currentColor" fontSize="16" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.2">Sir. Brian & Co.</text>
  </svg>
);

export const TechlinkLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 190 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Virtualization server stack icon */}
    <rect x="4" y="7" width="28" height="6" rx="1.5" fill="#8B2FC9" />
    <rect x="4" y="17" width="28" height="6" rx="1.5" fill="#A855E8" />
    <rect x="4" y="27" width="28" height="6" rx="1.5" fill="#0B3D91" />
    <circle cx="8" cy="10" r="1.5" fill="#ffffff" />
    <circle cx="8" cy="20" r="1.5" fill="#ffffff" />
    <circle cx="8" cy="30" r="1.5" fill="#ffffff" />
    <circle cx="28" cy="10" r="1.5" fill="#00FF66" />
    <circle cx="28" cy="20" r="1.5" fill="#00FF66" />
    <circle cx="28" cy="30" r="1.5" fill="#00FF66" />
    <text x="42" y="26" fill="currentColor" fontSize="16" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.2">Techlink Systems</text>
  </svg>
);

export const PaystackLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Paystack inspired modern interlocking ovals/circles */}
    <circle cx="18" cy="20" r="14" fill="#3EBB8C" />
    <path d="M12 16H24M12 20H20M12 24H22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
    <text x="40" y="26" fill="currentColor" fontSize="18" fontWeight="bold" fontFamily="sans-serif" letterSpacing="-0.5">paystack</text>
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
