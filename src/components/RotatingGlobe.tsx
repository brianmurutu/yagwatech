'use client';

import React from 'react';

export default function RotatingGlobe() {
  return (
    <div className="relative flex items-center justify-center w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] aspect-square mx-auto lg:mr-0 select-none overflow-visible">
      {/* Background Outer Glows */}
      <div className="absolute inset-4 rounded-full bg-brand-blue/15 blur-2xl animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
      <div className="absolute inset-16 rounded-full bg-brand-purple/10 blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />

      {/* Main Globe SVG */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(11,61,145,0.25)]"
      >
        <defs>
          {/* Radial Gradient for 3D Sphere Depth */}
          <radialGradient id="sphereShading" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="55%" stopColor="#0B3D91" stopOpacity="0.65" />
            <stop offset="85%" stopColor="#051636" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#020818" stopOpacity="0.98" />
          </radialGradient>

          {/* Outer Atmosphere Glow */}
          <radialGradient id="atmosphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="96%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
          </radialGradient>

          {/* Dynamic Grid Pattern for Continent Particles */}
          <pattern id="globeDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            {/* Continent particle clusters */}
            <circle cx="5" cy="5" r="0.9" fill="#F47B20" fillOpacity="0.75" />
            <circle cx="8" cy="8" r="1.3" fill="#3B82F6" fillOpacity="0.7" />
            <circle cx="12" cy="6" r="0.8" fill="#ffffff" fillOpacity="0.5" />
            <circle cx="16" cy="10" r="1.1" fill="#3B82F6" fillOpacity="0.6" />
            <circle cx="4" cy="14" r="0.7" fill="#ffffff" fillOpacity="0.4" />
            
            <circle cx="24" cy="24" r="1.2" fill="#ffffff" fillOpacity="0.65" />
            <circle cx="28" cy="21" r="0.8" fill="#F47B20" fillOpacity="0.75" />
            <circle cx="32" cy="27" r="1.4" fill="#3B82F6" fillOpacity="0.8" />
            <circle cx="20" cy="29" r="0.9" fill="#ffffff" fillOpacity="0.45" />
            <circle cx="36" cy="22" r="0.7" fill="#ffffff" fillOpacity="0.35" />
            
            <circle cx="12" cy="34" r="1.0" fill="#ffffff" fillOpacity="0.5" />
            <circle cx="16" cy="32" r="0.8" fill="#3B82F6" fillOpacity="0.6" />
            <circle cx="6" cy="28" r="1.2" fill="#F47B20" fillOpacity="0.7" />
            
            <circle cx="34" cy="8" r="1.1" fill="#ffffff" fillOpacity="0.6" />
            <circle cx="38" cy="12" r="0.8" fill="#F47B20" fillOpacity="0.5" />
            <circle cx="30" cy="2" r="1.0" fill="#3B82F6" fillOpacity="0.6" />
            
            {/* Networking mesh lines inside the grid */}
            <path d="M 5,5 Q 12,6 8,8" stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="0.25" fill="none" />
            <path d="M 24,24 Q 28,21 32,27" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="0.25" fill="none" />
            <path d="M 16,32 Q 12,34 6,28" stroke="#F47B20" strokeOpacity="0.25" strokeWidth="0.25" fill="none" />
          </pattern>

          {/* Mask to clip scrolling pattern to a sphere */}
          <mask id="sphereMask">
            <circle cx="50" cy="50" r="39.5" fill="#ffffff" />
          </mask>
        </defs>

        {/* 1. Outer Orbiting Ring 1 (Dashed purple) */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="#9333EA"
          strokeOpacity="0.25"
          strokeWidth="0.3"
          strokeDasharray="4 12"
          className="animate-spin-slow origin-center"
        />

        {/* 2. Outer Orbiting Ring 2 (Orange HUD ring) */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#F47B20"
          strokeOpacity="0.35"
          strokeWidth="0.4"
          strokeDasharray="40 10 5 10 120 15"
          className="animate-spin-reverse-slow origin-center"
        />

        {/* 3. Globe Sphere Base Fill */}
        <circle cx="50" cy="50" r="40" fill="#060C1E" />

        {/* 4. Scrolling Continent Particle Grid (Masked to sphere) */}
        <g mask="url(#sphereMask)">
          <rect
            x="-400"
            y="0"
            width="800"
            height="100"
            fill="url(#globeDots)"
            className="animate-globe-translation origin-center"
          />
        </g>

        {/* 5. Static 3D Grid Lines (Gives depth over the scrolling land) */}
        <g pointerEvents="none">
          {/* Longitudes */}
          <ellipse cx="50" cy="50" rx="38" ry="40" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.35" />
          <ellipse cx="50" cy="50" rx="28" ry="40" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.35" />
          <ellipse cx="50" cy="50" rx="16" ry="40" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.35" />
          <ellipse cx="50" cy="50" rx="5" ry="40" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.35" />
          
          {/* Latitudes */}
          <ellipse cx="50" cy="50" rx="40" ry="28" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.35" />
          <ellipse cx="50" cy="50" rx="40" ry="16" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.35" />
          <ellipse cx="50" cy="50" rx="40" ry="5" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.35" />
          
          {/* Equator */}
          <line x1="10" y1="50" x2="90" y2="50" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="0.4" />
        </g>

        {/* 6. 3D Shading Overlay (Darkens edges to curve the flat pattern) */}
        <circle cx="50" cy="50" r="40.2" fill="url(#sphereShading)" pointer-events="none" />

        {/* 7. Atmosphere Edge Glow Overlay */}
        <circle cx="50" cy="50" r="40" fill="url(#atmosphereGlow)" pointer-events="none" />

        {/* 8. Pulsing Hub Markers on Surface */}
        {/* Nairobi Hub (Main) */}
        <g className="origin-center">
          <circle cx="48" cy="55" r="1.8" fill="#F47B20" className="animate-ping origin-center" style={{ animationDuration: '2.5s' }} />
          <circle cx="48" cy="55" r="1.1" fill="#F47B20" />
          <text x="51.5" y="56" fill="#ffffff" fillOpacity="0.95" fontSize="2.2" fontFamily="Inter, sans-serif" fontWeight="bold">Nairobi</text>
        </g>

        {/* Mombasa Hub */}
        <g>
          <circle cx="55" cy="61" r="1.3" fill="#3B82F6" className="animate-ping origin-center" style={{ animationDuration: '3s' }} />
          <circle cx="55" cy="61" r="0.8" fill="#3B82F6" />
        </g>

        {/* Kisumu Hub */}
        <g>
          <circle cx="41" cy="52" r="1.3" fill="#3B82F6" className="animate-ping origin-center" style={{ animationDuration: '3.5s' }} />
          <circle cx="41" cy="52" r="0.8" fill="#3B82F6" />
        </g>

        {/* London Hub */}
        <g>
          <circle cx="46" cy="26" r="0.9" fill="#ffffff" fillOpacity="0.75" />
          <text x="49.5" y="27" fill="#ffffff" fillOpacity="0.5" fontSize="1.8" fontFamily="Inter, sans-serif">London</text>
        </g>

        {/* New York Hub */}
        <g>
          <circle cx="25" cy="36" r="0.9" fill="#ffffff" fillOpacity="0.75" />
          <text x="28.5" y="37" fill="#ffffff" fillOpacity="0.5" fontSize="1.8" fontFamily="Inter, sans-serif">New York</text>
        </g>
      </svg>
    </div>
  );
}
