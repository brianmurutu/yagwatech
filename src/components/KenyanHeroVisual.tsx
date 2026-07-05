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

/* ─── Maasai shield + spears SVG ─────────────────────────────────────── */
function MaasaiShield() {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full animate-shield-float"
      aria-hidden="true"
    >
      {/* Shield body */}
      <path
        d="M40 4C62 4 74 24 74 50C74 76 56 93 40 97C24 93 6 76 6 50C6 24 18 4 40 4Z"
        fill="#1a3a1a"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
      />
      {/* Top red zone */}
      <path d="M40 4C54 4 65 16 70 30L10 30C15 16 26 4 40 4Z" fill="#B22222" />
      {/* Bottom red zone */}
      <path d="M10 70C15 84 26 93 40 97C54 93 65 84 70 70H10Z" fill="#B22222" />
      {/* White separators */}
      <rect x="10" y="30" width="60" height="6" fill="white" opacity="0.9" />
      <rect x="10" y="64" width="60" height="6" fill="white" opacity="0.9" />
      {/* Green mid zone */}
      <rect x="10" y="36" width="60" height="28" fill="#006600" />
      {/* Inner shield oval */}
      <ellipse cx="40" cy="50" rx="13" ry="20" fill="#111" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      <ellipse cx="40" cy="50" rx="8" ry="13" fill="#B22222" />
      {/* Centre vertical bar */}
      <rect x="38.5" y="30" width="3" height="40" fill="white" opacity="0.6" />
      {/* Horizontal chevrons */}
      <path d="M28 44L40 40L52 44" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M28 56L40 60L52 56" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Spears */}
      <line x1="27" y1="0" x2="27" y2="100" stroke="#C8A820" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="53" y1="0" x2="53" y2="100" stroke="#C8A820" strokeWidth="2.5" strokeLinecap="round" />
      {/* Spear tips */}
      <polygon points="27,0 22,13 32,13" fill="#C8A820" />
      <polygon points="53,0 48,13 58,13" fill="#C8A820" />
      {/* Spear butts */}
      <polygon points="27,100 23,90 31,90" fill="#C8A820" />
      <polygon points="53,100 49,90 57,90" fill="#C8A820" />
    </svg>
  );
}

/* ─── Kenyan flag stripe bar ─────────────────────────────────────────── */
function FlagBar({ flip = false }: { flip?: boolean }) {
  const order = flip
    ? ["#006600", "rgba(255,255,255,0.8)", "#BB0000", "rgba(255,255,255,0.8)", "#111111"]
    : ["#111111", "rgba(255,255,255,0.8)", "#BB0000", "rgba(255,255,255,0.8)", "#006600"];
  return (
    <div className="flex h-2.5 w-full" aria-hidden="true">
      {order.map((c, i) =>
        i % 2 === 1 ? (
          <div key={i} style={{ width: "2px", background: c, flexShrink: 0 }} />
        ) : (
          <div key={i} style={{ flex: 1, background: c }} />
        )
      )}
    </div>
  );
}

/* ─── Vertical flag side strip ───────────────────────────────────────── */
function FlagStripe({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-0 ${className ?? ""}`} aria-hidden="true">
      <div className="flex-1 rounded-full" style={{ background: "#111111" }} />
      <div style={{ height: "2px", background: "rgba(255,255,255,0.7)" }} />
      <div className="flex-1 rounded-full" style={{ background: "#BB0000" }} />
      <div style={{ height: "2px", background: "rgba(255,255,255,0.7)" }} />
      <div className="flex-1 rounded-full" style={{ background: "#006600" }} />
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function KenyanHeroVisual() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (idx: number, dir: "next" | "prev" = "next") => {
      if (idx === current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      setDirection(dir);
      setPrev(current);
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

  /* Auto-advance */
  useEffect(() => {
    timerRef.current = setTimeout(next, AUTO_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [next]);

  /* Clear exiting slide after transition */
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 420);
    return () => clearTimeout(t);
  }, [prev]);

  const slide = slides[current];
  const prevSlideData = prev !== null ? slides[prev] : null;

  return (
    <div className="relative w-full flex items-center justify-center select-none">
      <div className="relative w-full max-w-[500px]">

        {/* Side flag strips */}
        <FlagStripe className="absolute -left-3 top-10 bottom-10 w-2 rounded-full overflow-hidden shadow-md" />
        <FlagStripe className="absolute -right-3 top-10 bottom-10 w-2 rounded-full overflow-hidden shadow-md" />

        {/* ── Main card ── */}
        <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10">

          {/* Top flag bar */}
          <FlagBar />

          {/* Slide viewport */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#0b1f3a]">

            {/* Exiting slide */}
            {prevSlideData && (
              <div
                key={`prev-${prev}`}
                className={
                  direction === "next"
                    ? "absolute inset-0 animate-slide-out-prev"
                    : "absolute inset-0 animate-slide-out-next"
                }
                style={
                  {
                    "--slide-out-prev": "translateX(-100%) scale(0.96)",
                    "--slide-out-next": "translateX(100%) scale(0.96)",
                  } as React.CSSProperties
                }
              >
                <Image
                  src={prevSlideData.img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 500px"
                  aria-hidden="true"
                />
              </div>
            )}

            {/* Entering slide */}
            <div
              key={`curr-${current}`}
              className={
                direction === "next"
                  ? "absolute inset-0 animate-slide-in-next"
                  : "absolute inset-0 animate-slide-in-prev"
              }
            >
              <Image
                src={slide.img}
                alt={slide.label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 500px"
                priority={current === 0}
              />
            </div>

            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Kenyan shield watermark */}
            <div className="absolute top-3 right-3 w-[52px] h-[65px] drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] pointer-events-none">
              <MaasaiShield />
            </div>

            {/* Auto-progress bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 pointer-events-none">
              <div
                key={progressKey}
                className="h-full bg-brand-orange animate-slide-progress"
                style={{ animationDuration: `${AUTO_DURATION}ms` }}
              />
            </div>

            {/* Slide info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between pointer-events-none">
              <div>
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white mb-1.5 backdrop-blur-sm"
                  style={{ background: `${slide.color}cc` }}
                >
                  {slide.tag}
                </span>
                <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                  {slide.label}
                </h3>
              </div>
              <span className="text-white/50 text-xs font-mono tabular-nums">
                {String(current + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Bottom flag bar (mirrored) */}
          <FlagBar flip />
        </div>

        {/* ── Controls row ── */}
        <div className="mt-3.5 flex items-center justify-between px-0.5">

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                aria-label={`Go to slide: ${s.label}`}
                style={i === current ? { background: slide.color } : {}}
                className={[
                  "rounded-full transition-all duration-300",
                  i === current
                    ? "w-6 h-2 shadow-md"
                    : "w-2 h-2 bg-white/25 hover:bg-white/55",
                ].join(" ")}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/18 hover:scale-110 transition-all backdrop-blur-sm"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/18 hover:scale-110 transition-all backdrop-blur-sm"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.5 2L8 6l-3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="mt-2.5 grid grid-cols-6 gap-1.5">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              aria-label={`View service: ${s.label}`}
              className={[
                "relative aspect-square rounded-lg overflow-hidden transition-all duration-300",
                i === current
                  ? "scale-105 shadow-lg"
                  : "opacity-45 hover:opacity-75 hover:scale-105",
              ].join(" ")}
              style={i === current ? { boxShadow: `0 4px 16px ${s.color}60` } : {}}
            >
              <Image
                src={s.img}
                alt={s.label}
                fill
                className="object-cover"
                sizes="80px"
              />
              {i === current && (
                <div
                  className="absolute inset-0 border-2 rounded-lg pointer-events-none"
                  style={{ borderColor: slide.color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── "Proudly built in Kenya" badge ── */}
        <div className="mt-4 flex items-center justify-center gap-2.5">
          {/* Mini Kenyan flag */}
          <div className="flex h-3.5 w-6 rounded-sm overflow-hidden shadow-sm flex-shrink-0 border border-white/10" aria-hidden="true">
            <div className="flex-1" style={{ background: "#111111" }} />
            <div className="flex-1" style={{ background: "#BB0000" }} />
            <div className="flex-1" style={{ background: "#006600" }} />
          </div>
          <span className="text-[11px] text-white/45 tracking-wide">
            Proudly serving{" "}
            <span className="text-white/75 font-semibold">Kenya & East Africa</span>
          </span>
        </div>
      </div>

      {/* Slide-out animation styles injected inline */}
      <style>{`
        @keyframes slideOutPrev {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(-80px) scale(0.96); }
        }
        @keyframes slideOutNext {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(80px) scale(0.96); }
        }
        .animate-slide-out-prev {
          animation: slideOutPrev 0.4s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }
        .animate-slide-out-next {
          animation: slideOutNext 0.4s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }
      `}</style>
    </div>
  );
}
