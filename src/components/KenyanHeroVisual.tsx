"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ─── Slide data ─────────────────────────────────────────────────────── */
const slides = [
  {
    img: "/images/portfolio-development.png",
    label: "Software Development",
    tag: "Custom Systems",
    color: "#1a56db",
  },
  {
    img: "/images/portfolio-secure.png",
    label: "Cybersecurity",
    tag: "Threat Protection",
    color: "#BB0000",
  },
  {
    img: "/images/portfolio-branding.png",
    label: "UI/UX & Branding",
    tag: "Identity Design",
    color: "#7c3aed",
  },
  {
    img: "/images/portfolio-community.png",
    label: "Training & Capacity",
    tag: "Empowering Teams",
    color: "#006600",
  },
  {
    img: "/images/portfolio-finance.png",
    label: "Data Analytics",
    tag: "Business Intelligence",
    color: "#d97706",
  },
  {
    img: "/images/blog-cloud.png",
    label: "Cloud Infrastructure",
    tag: "AWS · Azure · GCP",
    color: "#0e7490",
  },
];

const AUTO_DURATION = 4500;

/**
 * Simplified Kenya outline path in a 300×360 viewBox.
 * Clockwise from the NW corner (Lokichoggio/Sudan border),
 * preserving the key recognisable features:
 *   - NE protrusion toward Mandera (Somalia/Ethiopia)
 *   - SE coast line down to Mombasa
 *   - Straight Tanzania southern border
 *   - Lake Victoria indent on the SW
 *   - Uganda/Sudan border back up the west side
 */
const KENYA_PATH = `
  M 55,58
  L 68,32
  L 95,14
  L 130,8
  L 165,12
  L 196,28
  L 228,22
  L 256,52
  L 264,82
  L 260,118
  L 252,155
  L 246,192
  L 238,225
  L 228,256
  L 212,278
  L 190,294
  L 162,300
  L 134,296
  L 106,286
  L 82,274
  L 62,258
  L 48,240
  L 52,222
  L 42,208
  L 36,182
  L 30,152
  L 28,120
  L 32,90
  L 45,70
  Z
`;

/* ─── City dots ──────────────────────────────────────────────────────── */
const cities = [
  { name: "Nairobi", x: 148, y: 220, primary: true },
  { name: "Mombasa", x: 210, y: 270 },
  { name: "Kisumu", x: 70, y: 220 },
  { name: "Nakuru", x: 110, y: 200 },
  { name: "Eldoret", x: 80, y: 175 },
  { name: "Garissa", x: 210, y: 175 },
  { name: "Meru", x: 175, y: 195 },
];

/* ─── Main component ─────────────────────────────────────────────────── */
export default function KenyanHeroVisual() {
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev" = "next") => {
      if (idx === current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      setDirection(dir);
      setExiting(current);
      setTimeout(() => setExiting(null), 450);
      setCurrent(idx);
      setProgressKey((k) => k + 1);
    },
    [current]
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length, "next"),
    [current, goTo]
  );
  const prevSlide = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length, "prev"),
    [current, goTo]
  );

  useEffect(() => {
    timerRef.current = setTimeout(next, AUTO_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [next]);

  const slide = slides[current];
  const exitSlide = exiting !== null ? slides[exiting] : null;

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none gap-4">

      {/* ── Kenya map SVG container ── */}
      <div className="relative w-full max-w-[340px]">
        <svg
          viewBox="0 0 300 360"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
          aria-label="Kenya map showing Yagwa Tech services"
          role="img"
        >
          <defs>
            {/* Clip path = Kenya map silhouette */}
            <clipPath id="kenya-clip">
              <path d={KENYA_PATH} />
            </clipPath>

            {/* Animated flag gradient border */}
            <linearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111111" />
              <stop offset="33%" stopColor="#BB0000" />
              <stop offset="66%" stopColor="#006600" />
              <stop offset="100%" stopColor="#111111" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 150 180"
                to="360 150 180"
                dur="5s"
                repeatCount="indefinite"
              />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* City pulse filter */}
            <filter id="cityGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Shadow / deep background ── */}
          <path
            d={KENYA_PATH}
            fill="rgba(0,0,0,0.5)"
            transform="translate(4,6)"
            opacity="0.6"
          />

          {/* ── Exiting slide (clip to Kenya) ── */}
          {exitSlide && (
            <g clipPath="url(#kenya-clip)">
              <image
                href={exitSlide.img}
                x="-20"
                y="-20"
                width="340"
                height="400"
                preserveAspectRatio="xMidYMid slice"
                style={{
                  animation: `kenyanSlideOut-${direction} 0.45s cubic-bezier(0.4,0,0.6,1) forwards`,
                }}
              />
            </g>
          )}

          {/* ── Current slide image (clip to Kenya) ── */}
          <g clipPath="url(#kenya-clip)" key={current}>
            <image
              href={slide.img}
              x="-20"
              y="-20"
              width="340"
              height="400"
              preserveAspectRatio="xMidYMid slice"
              style={{
                animation: `kenyanSlideIn-${direction} 0.45s cubic-bezier(0.22,1,0.36,1) forwards`,
              }}
            />
            {/* Dark overlay for readability */}
            <path
              d={KENYA_PATH}
              fill="url(#imgOverlay)"
            />
          </g>

          {/* Image dark overlay gradient definition */}
          <defs>
            <radialGradient id="imgOverlay" cx="50%" cy="65%" r="70%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
            </radialGradient>
          </defs>

          {/* ── Animated flag-coloured border ── */}
          <path
            d={KENYA_PATH}
            fill="none"
            stroke="url(#flagGrad)"
            strokeWidth="3"
            filter="url(#glow)"
            opacity="0.9"
          />

          {/* ── Inner thin white border ── */}
          <path
            d={KENYA_PATH}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />

          {/* ── Auto-progress arc drawn along the border ── */}
          <path
            key={`progress-${progressKey}`}
            d={KENYA_PATH}
            fill="none"
            stroke="#F47B20"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength="1000"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            opacity="0.9"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1000"
              to="0"
              dur={`${AUTO_DURATION}ms`}
              fill="freeze"
            />
          </path>

          {/* ── City dots ── */}
          {cities.map((city) => (
            <g key={city.name} filter="url(#cityGlow)">
              {city.primary ? (
                <>
                  {/* Nairobi - pulsing star */}
                  <circle cx={city.x} cy={city.y} r="10" fill={`${slide.color}33`}>
                    <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={city.x} cy={city.y} r="5" fill={slide.color} opacity="0.95" />
                  <circle cx={city.x} cy={city.y} r="3" fill="white" opacity="0.9" />
                </>
              ) : (
                <>
                  <circle cx={city.x} cy={city.y} r="3.5" fill="white" opacity="0.5" />
                  <circle cx={city.x} cy={city.y} r="1.8" fill={slide.color} opacity="0.8" />
                </>
              )}
            </g>
          ))}

          {/* ── Nairobi label ── */}
          <text
            x={cities[0].x + 8}
            y={cities[0].y + 4}
            fill="white"
            fontSize="9"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="600"
            opacity="0.9"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
          >
            Nairobi
          </text>

          {/* ── Mombasa label ── */}
          <text
            x={cities[1].x + 7}
            y={cities[1].y + 3}
            fill="white"
            fontSize="7.5"
            fontFamily="Inter, system-ui, sans-serif"
            opacity="0.75"
          >
            Mombasa
          </text>

          {/* ── Kisumu label ── */}
          <text
            x={cities[2].x - 40}
            y={cities[2].y + 3}
            fill="white"
            fontSize="7.5"
            fontFamily="Inter, system-ui, sans-serif"
            opacity="0.75"
          >
            Kisumu
          </text>

          {/* ── Service tag inside map ── */}
          <g>
            <rect
              x="88"
              y="252"
              width="100"
              height="18"
              rx="9"
              fill={slide.color}
              opacity="0.88"
            />
            <text
              x="138"
              y="264"
              textAnchor="middle"
              fill="white"
              fontSize="7.5"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="700"
              letterSpacing="0.5"
            >
              {slide.tag.toUpperCase()}
            </text>
          </g>
        </svg>

        {/* ── Floating service label card ── */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div
            key={current}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 backdrop-blur-md border border-white/15 shadow-lg animate-slide-in-next"
            style={{ background: `${slide.color}CC` }}
          >
            <span className="text-white font-bold text-sm">{slide.label}</span>
          </div>
        </div>

        {/* ── "Kenya & East Africa" badge – top right ── */}
        <div className="absolute -top-3 -right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10 shadow-md">
          {/* Mini flag */}
          <div className="flex h-3 w-5 rounded-[2px] overflow-hidden flex-shrink-0 shadow-sm">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-[#BB0000]" />
            <div className="flex-1 bg-[#006600]" />
          </div>
          <span className="text-[10px] text-white/80 font-medium tracking-wide">Kenya</span>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between w-full max-w-[340px] px-1">
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              aria-label={`Go to: ${s.label}`}
              style={i === current ? { background: slide.color } : {}}
              className={[
                "rounded-full transition-all duration-300",
                i === current ? "w-6 h-2 shadow-md" : "w-2 h-2 bg-white/25 hover:bg-white/55",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/20 hover:scale-110 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/20 hover:scale-110 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4.5 2L8 6l-3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      <div className="grid grid-cols-6 gap-1.5 w-full max-w-[340px]">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            aria-label={`View: ${s.label}`}
            className={[
              "relative aspect-square rounded-lg overflow-hidden transition-all duration-300",
              i === current ? "scale-105 shadow-lg" : "opacity-40 hover:opacity-75 hover:scale-105",
            ].join(" ")}
            style={i === current ? { boxShadow: `0 4px 14px ${s.color}60` } : {}}
          >
            <Image
              src={s.img}
              alt={s.label}
              fill
              className="object-cover"
              sizes="56px"
            />
            {i === current && (
              <div
                className="absolute inset-0 border-2 rounded-lg pointer-events-none"
                style={{ borderColor: s.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide-animation styles */}
      <style>{`
        @keyframes kenyanSlideIn-next {
          from { opacity: 0; transform: translateX(40px) scale(1.05); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes kenyanSlideIn-prev {
          from { opacity: 0; transform: translateX(-40px) scale(1.05); }
          to   { opacity: 1; transform: translateX(0)     scale(1); }
        }
        @keyframes kenyanSlideOut-next {
          from { opacity: 1; transform: translateX(0)    scale(1); }
          to   { opacity: 0; transform: translateX(-40px) scale(0.96); }
        }
        @keyframes kenyanSlideOut-prev {
          from { opacity: 1; transform: translateX(0)   scale(1); }
          to   { opacity: 0; transform: translateX(40px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}
