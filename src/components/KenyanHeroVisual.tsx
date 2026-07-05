"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ─── Slides ─────────────────────────────────────────────────────────── */
const slides = [
  { img: "/images/portfolio-development.png", label: "Software Development",  tag: "Custom Systems",      color: "#F47B20" },
  { img: "/images/portfolio-secure.png",      label: "Cybersecurity",          tag: "Threat Protection",   color: "#BB0000" },
  { img: "/images/portfolio-branding.png",    label: "UI/UX & Branding",       tag: "Identity Design",     color: "#7c3aed" },
  { img: "/images/portfolio-community.png",   label: "Training & Capacity",    tag: "Empowering Teams",    color: "#006600" },
  { img: "/images/portfolio-finance.png",     label: "Data Analytics",         tag: "Business Intelligence",color: "#0e7490" },
  { img: "/images/blog-cloud.png",            label: "Cloud Infrastructure",   tag: "AWS · Azure · GCP",  color: "#1a56db" },
];

const AUTO_MS = 4500;

/**
 * Accurate Kenya SVG path — derived from Natural Earth GeoJSON coordinates,
 * projected & normalised to a 400 × 480 viewport.
 * Preserves all geographic features: NE Mandera horn, Indian Ocean coastline,
 * Tanzania border, Lake Victoria SW notch, Uganda + South Sudan NW borders.
 */
const KE = `M 90.3,18.8 L 90.6,16.7 L 92,15.8 L 93.9,15.9 L 94.1,18.8 L 97.8,18.8 L 101,18.8 L 101.1,19.7 L 101.8,20.9 L 101.9,21.8 L 101.7,22.8 L 101.7,23.6 L 102,24.3 L 102.9,24.9 L 104.9,26.6 L 105.9,27.3 L 107.1,27.5 L 107.3,27.5 L 114.6,27.5 L 116.3,27.2 L 116.8,27.2 L 117.3,27.4 L 118.2,27.8 L 118.9,27.9 L 128.2,27.7 L 136,27.5 L 136.4,27.6 L 137.1,28.1 L 137.4,28.1 L 137.6,28.2 L 147.2,28.1 L 150.2,28.9 L 153.7,30.7 L 155.8,31.1 L 156.3,31.5 L 157.1,32.8 L 157.4,33.1 L 158.4,33 L 158.8,33.1 L 159.1,33.5 L 159.3,34 L 159.6,35.1 L 159.7,35.4 L 160,35.4 L 160.3,35.4 L 160.6,35.5 L 163.3,37.2 L 168.2,40.3 L 173,43.4 L 178.8,47.1 L 182.8,49.6 L 187.4,52.6 L 192.6,55.8 L 197.3,58.9 L 202.3,62 L 203.8,63 L 204.8,63.9 L 206,66 L 206.8,66.9 L 207.4,67.2 L 208.9,67.7 L 210.1,68.7 L 210.7,68.8 L 212.3,68.4 L 213.8,68.2 L 219.2,68.8 L 224.5,69.4 L 227.3,69.2 L 229.8,68.1 L 229.9,67.8 L 229.9,67.4 L 230,67 L 230.4,66.8 L 230.7,66.9 L 231.7,67.7 L 232.1,68.1 L 232.2,68.5 L 232.4,68.8 L 233.1,69 L 233.7,69.1 L 234,69 L 234.7,68.7 L 234.8,68.9 L 234.8,69.2 L 235.1,69.3 L 238,69.6 L 238,69.2 L 238.1,68.5 L 238.1,68.2 L 239.4,70 L 240.2,70.7 L 241.1,71.2 L 246,72.6 L 249.8,73.6 L 251.1,73.5 L 253.2,73.1 L 254,73.2 L 254.7,73.5 L 255.5,73.5 L 258.4,72.9 L 258.9,73 L 259.5,73.3 L 264,75.4 L 266,75.8 L 267.9,75.7 L 269.8,74.6 L 270.1,74.4 L 270.8,74.5 L 271,75 L 270.6,75.9 L 276.8,76.1 L 278.3,76.6 L 278.8,77.2 L 279,77.8 L 279.4,78.5 L 280.2,79 L 281.8,78.9 L 282.7,77.6 L 283.7,74.3 L 285,72.8 L 288.3,69.8 L 292.3,66.3 L 293.2,65 L 294,63.5 L 295.4,59.9 L 296.4,57.3 L 297.4,56.1 L 301.7,54 L 306,52 L 310.9,49.6 L 313.1,48.5 L 313.3,48.2 L 313.3,47.9 L 313.4,47.7 L 313.8,47.8 L 314,47.9 L 314.1,47.9 L 314.3,47.9 L 319.3,46.1 L 323.3,44.8 L 323.6,44.5 L 323.8,43.7 L 324.1,43.5 L 330.6,41 L 335.9,39 L 340,37.4 L 343.2,35.4 L 344.3,36.8 L 347.3,38.8 L 348.5,40.2 L 349.4,41.8 L 349.9,42.3 L 350.8,42.7 L 353.2,43.5 L 354,44 L 355.3,45.2 L 358.5,49.6 L 360.7,51.3 L 363.1,52.3 L 365.8,52.6 L 370.9,52.3 L 376.5,52 L 379,51.3 L 380.3,51.2 L 384.3,50.3 L 385.1,50.3 L 386.4,50.9 L 387.1,51 L 387.9,50.8 L 390,49.6 L 392.4,50.4 L 394.6,51.6 L 396.8,52 L 399.3,50.6 L 395.1,56.6 L 390.9,62.5 L 386.7,68.4 L 382.5,74.4 L 379.9,78 L 377.3,81.7 L 374.7,85.4 L 372.1,89 L 368,93 L 363.9,97.1 L 359.8,101.1 L 355.7,105.1 L 353.4,107.5 L 353.4,117.2 L 353.4,138.1 L 353.4,161 L 353.4,185.7 L 353.4,210.4 L 353.4,235.2 L 353.5,251.6 L 353.6,263.7 L 353.8,279.8 L 354,290.5 L 355.3,292.1 L 357.8,295.4 L 361.6,300.2 L 366.9,307 L 371.6,313.1 L 376.7,319.6 L 381.1,325.3 L 381.9,327.3 L 381.8,330.4 L 381.7,331.4 L 377.9,335.2 L 376.1,338 L 374.8,339.5 L 372,342.1 L 370.2,344.2 L 369.1,344.8 L 368.4,343.9 L 366.6,344.2 L 366,343.6 L 364.9,343.6 L 364.8,344.8 L 364.3,345.9 L 362.8,345.8 L 360.9,345.3 L 359.8,345.7 L 358.8,346.7 L 357.5,347.3 L 356.4,348.5 L 355.6,348.5 L 355,348.2 L 354.5,344.5 L 354.3,343.2 L 353.5,342.9 L 353.3,348.7 L 352.3,350 L 350.4,346.3 L 349,345.3 L 347.5,345.3 L 347.8,346 L 347.9,347.3 L 349.3,349.1 L 349.7,350 L 350.3,354 L 350.6,355.9 L 351.2,357.1 L 353.5,357.7 L 354,358.4 L 353.5,360.2 L 352.2,361.7 L 351.1,361.9 L 349.8,358.5 L 349.2,357.5 L 348.9,357.7 L 346.9,358.5 L 345.8,359.8 L 344.7,360.8 L 343.7,360.2 L 344.1,361.4 L 344.5,361.6 L 344.7,362.1 L 344.3,362.6 L 344.7,363.3 L 346.1,364.2 L 346.4,364.9 L 345.8,366.1 L 344.5,367.4 L 342.9,368.5 L 340.6,369.5 L 337.5,373.1 L 335.8,373.7 L 334.3,373.4 L 332.8,372.7 L 329.5,372.5 L 324.5,374.1 L 322.4,375.6 L 321.2,376 L 319.7,376.9 L 317.2,378.9 L 316.6,379.5 L 316.2,380.2 L 315.2,382.3 L 313.7,384.1 L 313.5,385 L 314.4,386.3 L 314.2,387.4 L 313.2,391 L 313.1,392.6 L 314.2,393.4 L 313.9,394.7 L 314.5,395.3 L 315.6,395.2 L 316.6,394.4 L 316.6,395 L 314.5,397.2 L 313.5,398.6 L 313,401.7 L 312.7,402.6 L 311,405 L 311.5,407.4 L 311.5,408.3 L 310.1,410.4 L 307,412 L 305.1,413.8 L 304.5,414.3 L 303.6,414.5 L 303.2,412.4 L 303.2,413.1 L 302.9,414.8 L 303.2,415.3 L 302.4,417.1 L 301.4,419.7 L 300,421.8 L 299.5,424.7 L 298.9,425.8 L 298.3,426.4 L 296.8,426 L 295.9,425.1 L 294.3,425 L 293.7,424.8 L 293.8,425.6 L 295.4,426 L 295,427.3 L 295.7,427.5 L 297.4,426.8 L 298,427.2 L 298.4,428.7 L 298.4,430.3 L 294.3,441.3 L 293,442.5 L 291.6,442.7 L 290.6,442 L 290.6,440.3 L 289.5,440.9 L 289.9,442.7 L 290.6,443.6 L 291.7,443.5 L 292.3,443.8 L 292.1,444.7 L 291.1,445.8 L 290.4,447.2 L 290,447.8 L 289.5,448 L 289.1,447.7 L 288.3,446.3 L 288.1,444.6 L 287.2,444.6 L 285.9,443.9 L 284.7,444.3 L 285.2,444.8 L 287.2,445.3 L 286.3,446.6 L 284.7,447 L 283.2,447 L 283,447.3 L 283.2,448.9 L 284.1,448.4 L 285.8,448.3 L 287.5,448.8 L 288.5,449.7 L 288.3,450.9 L 285.8,455.2 L 284.2,459.2 L 282.6,465.3 L 282,466.7 L 280.3,467.9 L 279.4,468.8 L 277.5,474.2 L 276.5,471.6 L 275.2,473.8 L 274.4,474.3 L 274.8,476.5 L 273.1,476.7 L 271.2,476.3 L 270,474.8 L 269.7,475.8 L 268.2,475.4 L 267.1,476.4 L 266.2,477.8 L 265.2,478.5 L 264.5,478.9 L 260.3,475.9 L 256,472.8 L 251.8,469.8 L 247.5,466.7 L 243.2,463.7 L 238.9,460.7 L 234.7,457.6 L 230.4,454.6 L 226.1,451.5 L 221.9,448.5 L 217.6,445.5 L 213.3,442.4 L 209.1,439.4 L 204.8,436.3 L 200.5,433.3 L 196.3,430.2 L 193.5,428.3 L 192.9,427.4 L 191.5,423.4 L 190.4,422 L 188.4,421.2 L 185,421.3 L 184.8,420.6 L 185.2,418.8 L 184.3,418.3 L 183.9,417.4 L 184.3,416.3 L 185.2,415.1 L 186.4,414.2 L 188.5,413.5 L 188.4,412.6 L 189.1,411.5 L 190,411.4 L 189,405.4 L 188,399.4 L 187.2,398.2 L 183.1,395.9 L 176.2,392.1 L 172.4,389.9 L 161.6,384 L 150.9,378.1 L 140.2,372.1 L 129.4,366.2 L 118.7,360.3 L 108,354.4 L 97.2,348.4 L 86.5,342.5 L 75.8,336.6 L 65,330.6 L 54.3,324.7 L 43.6,318.8 L 32.8,312.8 L 22.1,306.9 L 11.4,301 L 7.6,298.9 L 5.8,298.8 L 5.1,298.3 L 5,297 L 0.2,297 L -0.3,280.2 L 0.6,273.1 L 1.8,262.9 L 2.7,255.1 L 2.6,253.1 L 1.1,248.1 L -0.5,243 L -0.3,242 L 2.6,238.2 L 7,232.3 L 8.8,230.9 L 9.4,229.2 L 8.8,226.5 L 9.9,225.1 L 10.4,224.1 L 11.6,219.1 L 12.5,217.6 L 14,216.5 L 16,215.8 L 18.8,213.7 L 19.6,211.6 L 19.9,209.8 L 20.3,209.4 L 23.5,207.8 L 24.4,207.1 L 25.1,205.1 L 26.6,203.2 L 27.9,200 L 28.2,196.8 L 28.4,195.7 L 29.4,193.9 L 30.4,192.9 L 31.2,193.1 L 32,193.5 L 33.1,193.3 L 33.6,192.4 L 33.7,191.3 L 34,190.4 L 36.4,189.8 L 38.2,188.2 L 39.2,187.6 L 43.3,187.2 L 44.9,186.5 L 45.5,184.5 L 44.1,180.5 L 44,179.5 L 43.9,178.7 L 46.9,176.3 L 48,172.3 L 49.1,170.6 L 51.2,169.9 L 52,168.9 L 53.6,165.6 L 53.9,164.5 L 54,154.9 L 54.2,154.3 L 55.1,153.1 L 55.3,152.6 L 55.1,152 L 53.9,150.9 L 53.1,149.6 L 52.9,148.6 L 52.8,147.5 L 52.9,146.6 L 53.4,144.4 L 53.4,143.4 L 51.1,138 L 50.2,135.9 L 48.3,131.3 L 48,129.3 L 48.4,128.1 L 49.3,127.4 L 50.3,126.8 L 51,126 L 51.2,124.8 L 50.7,124 L 49.4,122.6 L 49.1,121.7 L 48.8,119.2 L 48.3,118.5 L 47.8,118.6 L 47.5,119 L 47.1,119.4 L 46.4,119.3 L 45.9,118.9 L 43.8,114.5 L 43.1,110.2 L 42,107.1 L 41.8,106.7 L 41.5,106.3 L 39.8,105.5 L 39.6,105.1 L 38.9,105.3 L 38,106 L 37.7,106.1 L 37,105.9 L 36.6,105.4 L 35.8,104.2 L 34.2,102.5 L 33.7,101.6 L 32.3,94.2 L 31.7,93.1 L 30.6,92.4 L 28.3,91.8 L 27.2,91.1 L 26.7,90 L 26.2,83.9 L 25.6,81.9 L 25.2,81.4 L 24.7,80.9 L 24.3,80.3 L 24.2,79.8 L 24.3,79.2 L 24.9,78 L 24.7,77 L 24.1,75.9 L 24.1,75.4 L 24.3,74.9 L 24.8,74.7 L 25.3,74.6 L 26.7,72.9 L 27.2,70.9 L 27.3,67 L 27,65.9 L 26.3,65.5 L 25.3,65.2 L 24.4,64.7 L 22.8,63 L 20.5,63 L 20,63.5 L 19.8,64 L 18.9,63.8 L 18.2,61.9 L 17.1,60.4 L 16.5,60.2 L 15.5,60.5 L 14.5,60.6 L 13.7,60.8 L 12.6,60.6 L 13,60.2 L 14,59.6 L 13.3,58.8 L 12.5,58.5 L 14.8,57 L 15.4,56.4 L 15.2,55.7 L 14.1,55.1 L 11.2,55.8 L 9.2,55.6 L 9.3,54.7 L 9.9,53.6 L 10.5,52.3 L 10.4,51.5 L 9.8,50.9 L 8.4,49.9 L 8.1,49.1 L 8.1,48.6 L 8.3,48.1 L 8.5,47.4 L 8.6,45.7 L 8.5,45.1 L 8,44.6 L 7.5,44.1 L 7,43.5 L 7,42.9 L 7.1,41.3 L 6.4,40.2 L 5.3,39.3 L 3.9,38.6 L 8.9,33.7 L 14,28.7 L 19,23.7 L 24.1,18.8 L 28,16.8 L 31.5,15 L 34.9,13.3 L 38.3,11.6 L 43.2,9.9 L 47.2,8.4 L 51,7 L 55.1,5.4 L 59.7,3.7 L 63.8,2.2 L 67.3,0.9 L 68.2,2.5 L 71.7,0.6 L 75.6,-1.5 L 76.7,-0.2 L 74.8,3.6 L 79.8,3.6 L 83.5,4.7 L 81.1,10.9 L 83.1,14.5 L 85.5,18.8 L 90,20.3 L 90.3,18.8 Z`;

/* City pins (in the 400×480 viewport) */
const CITIES = [
  { name: "Nairobi",  x: 195, y: 300, capital: true  },
  { name: "Mombasa", x: 290, y: 400, capital: false },
  { name: "Kisumu",  x:  70, y: 275, capital: false },
  { name: "Nakuru",  x: 130, y: 255, capital: false },
  { name: "Eldoret", x:  95, y: 215, capital: false },
  { name: "Garissa", x: 270, y: 230, capital: false },
  { name: "Meru",    x: 215, y: 235, capital: false },
];

/* ─── Component ──────────────────────────────────────────────────────── */
export default function KenyanHeroVisual() {
  const [cur, setCur]       = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);
  const [dir, setDir]       = useState<"next" | "prev">("next");
  const [pk, setPk]         = useState(0);
  const tRef                = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number, d: "next" | "prev" = "next") => {
    if (idx === cur) return;
    if (tRef.current) clearTimeout(tRef.current);
    setDir(d);
    setExiting(cur);
    setCur(idx);
    setPk(k => k + 1);
    setTimeout(() => setExiting(null), 500);
  }, [cur]);

  const next = useCallback(() => goTo((cur + 1) % slides.length, "next"), [cur, goTo]);
  const back = useCallback(() => goTo((cur - 1 + slides.length) % slides.length, "prev"), [cur, goTo]);

  useEffect(() => {
    tRef.current = setTimeout(next, AUTO_MS);
    return () => { if (tRef.current) clearTimeout(tRef.current); };
  }, [next]);

  const slide = slides[cur];
  const exitSlide = exiting !== null ? slides[exiting] : null;

  return (
    <div className="relative w-full flex flex-col items-center gap-4 select-none">

      {/* ── Map wrapper ── */}
      <div
        className="relative w-full max-w-[420px] mx-auto"
        style={{ filter: "drop-shadow(0 16px 48px rgba(0,0,0,0.7))" }}
      >
        <svg
          viewBox="-5 -5 410 492"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          aria-label="Kenya map – Yagwa Tech service gallery"
          role="img"
        >
          <defs>
            <clipPath id="ke-mask"><path d={KE}/></clipPath>

            {/* Spinning Kenyan flag gradient border */}
            <linearGradient id="ke-border" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#111111"/>
              <stop offset="28%"  stopColor="#BB0000"/>
              <stop offset="60%"  stopColor="#006600"/>
              <stop offset="100%" stopColor="#111111"/>
              <animateTransform attributeName="gradientTransform" type="rotate"
                from="0 200 240" to="360 200 240" dur="7s" repeatCount="indefinite"/>
            </linearGradient>

            {/* Glow */}
            <filter id="ke-glow" x="-12%" y="-12%" width="124%" height="124%">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feColorMatrix in="b" type="matrix"
                values="0 0 0 0 0.95  0 0 0 0 0.48  0 0 0 0 0.13  0 0 0 0.8 0"
                result="o"/>
              <feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* City glow */}
            <filter id="city-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Inner image vignette */}
            <radialGradient id="vignette" cx="50%" cy="55%" r="65%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0.6)"/>
            </radialGradient>
          </defs>

          {/* Drop shadow clone */}
          <path d={KE} fill="rgba(0,0,0,0.5)" transform="translate(6,10)"/>

          {/* ── Exiting image ── */}
          {exitSlide && (
            <g clipPath="url(#ke-mask)" key={`x-${exiting}`}>
              <image href={exitSlide.img} x="-5" y="-5" width="420" height="500"
                preserveAspectRatio="xMidYMid slice"
                style={{ animation: `${dir==="next"?"kOut":"kOutR"} 0.5s ease forwards` }}/>
            </g>
          )}

          {/* ── Entering image ── */}
          <g clipPath="url(#ke-mask)" key={`e-${cur}`}>
            <image href={slide.img} x="-5" y="-5" width="420" height="500"
              preserveAspectRatio="xMidYMid slice"
              style={{ animation: `${dir==="next"?"kIn":"kInR"} 0.5s cubic-bezier(0.22,1,0.36,1) forwards` }}/>
            <path d={KE} fill="url(#vignette)"/>
          </g>

          {/* ── Animated flag border (outer glow) ── */}
          <path d={KE} fill="none" stroke="url(#ke-border)" strokeWidth="4.5"
            filter="url(#ke-glow)" opacity="0.95"/>

          {/* ── Inner white hairline ── */}
          <path d={KE} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2"/>

          {/* ── Orange progress trace ── */}
          <path key={`p-${pk}`} d={KE} fill="none" stroke="#F47B20" strokeWidth="3.5"
            strokeLinecap="round" pathLength="1000"
            strokeDasharray="1000" strokeDashoffset="1000" opacity="0.9">
            <animate attributeName="stroke-dashoffset" from="1000" to="0"
              dur={`${AUTO_MS}ms`} fill="freeze"/>
          </path>

          {/* ── City markers ── */}
          {CITIES.map(c => (
            <g key={c.name} filter="url(#city-glow)">
              {c.capital ? (
                <>
                  <circle cx={c.x} cy={c.y} r="20" fill={`${slide.color}18`}>
                    <animate attributeName="r"       values="10;22;10" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx={c.x} cy={c.y} r="10" fill={`${slide.color}30`}>
                    <animate attributeName="r"       values="6;13;6"   dur="2.5s" repeatCount="indefinite" begin="0.4s"/>
                    <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.5s" repeatCount="indefinite" begin="0.4s"/>
                  </circle>
                  <circle cx={c.x} cy={c.y} r="5.5" fill={slide.color}/>
                  <circle cx={c.x} cy={c.y} r="2.5" fill="white"/>
                  <text x={c.x+9} y={c.y+4.5} fill="white" fontSize="10" fontWeight="700"
                    fontFamily="Inter,system-ui,sans-serif" opacity="0.95"
                    style={{filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.9))"}}>
                    {c.name}
                  </text>
                </>
              ) : (
                <>
                  <circle cx={c.x} cy={c.y} r="3.5" fill="white" opacity="0.4"/>
                  <circle cx={c.x} cy={c.y} r="1.8" fill={slide.color} opacity="0.85"/>
                </>
              )}
            </g>
          ))}

          {/* ── Service tag badge (bottom of map) ── */}
          <g key={`tag-${cur}`}>
            <rect x="110" y="453" width="185" height="22" rx="11"
              fill={slide.color} opacity="0.9"/>
            <text x="202" y="468" textAnchor="middle" fill="white"
              fontSize="8.5" fontWeight="700" letterSpacing="0.8"
              fontFamily="Inter,system-ui,sans-serif">
              {slide.tag.toUpperCase()}
            </text>
          </g>
        </svg>

        {/* Floating service name */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
          <div key={cur}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 border border-white/15 backdrop-blur-md shadow-xl"
            style={{ background: `${slide.color}DD`, animation: "kBadge 0.4s ease forwards" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse"/>
            <span className="text-white font-semibold text-sm">{slide.label}</span>
          </div>
        </div>

        {/* Kenya badge */}
        <div className="absolute -top-1 right-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-black/60 border border-white/10 backdrop-blur-sm shadow-md">
          <div className="flex h-3 w-5 rounded-[2px] overflow-hidden flex-shrink-0">
            <div className="flex-1 bg-black"/><div className="flex-1 bg-[#BB0000]"/><div className="flex-1 bg-[#006600]"/>
          </div>
          <span className="text-[10px] text-white/80 font-medium tracking-wide">Kenya</span>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between w-full max-w-[420px] px-1 mt-2">
        <div className="flex items-center gap-1.5">
          {slides.map((s,i) => (
            <button key={i} onClick={() => goTo(i, i>cur?"next":"prev")}
              aria-label={`Go to: ${s.label}`}
              style={i===cur ? { background: slide.color } : {}}
              className={[
                "rounded-full transition-all duration-300",
                i===cur ? "w-6 h-2 shadow-md" : "w-2 h-2 bg-white/25 hover:bg-white/55",
              ].join(" ")}/>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={back} aria-label="Previous slide"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/20 hover:scale-110 transition-all">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={next} aria-label="Next slide"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 border border-white/15 text-white hover:bg-white/20 hover:scale-110 transition-all">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2L8 6l-3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Thumbnails ── */}
      <div className="grid grid-cols-6 gap-1.5 w-full max-w-[420px]">
        {slides.map((s,i) => (
          <button key={i} onClick={() => goTo(i, i>cur?"next":"prev")}
            aria-label={`View: ${s.label}`}
            className={[
              "relative aspect-square rounded-lg overflow-hidden transition-all duration-300",
              i===cur ? "scale-105 shadow-lg" : "opacity-40 hover:opacity-75 hover:scale-105",
            ].join(" ")}
            style={i===cur ? { boxShadow: `0 4px 14px ${s.color}55` } : {}}>
            <Image src={s.img} alt={s.label} fill className="object-cover" sizes="70px"/>
            {i===cur && (
              <div className="absolute inset-0 border-2 rounded-lg pointer-events-none"
                style={{ borderColor: s.color }}/>
            )}
          </button>
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes kIn    { from{opacity:0;transform:translateX(40px) scale(1.05)} to{opacity:1;transform:none} }
        @keyframes kInR   { from{opacity:0;transform:translateX(-40px) scale(1.05)} to{opacity:1;transform:none} }
        @keyframes kOut   { from{opacity:1;transform:none} to{opacity:0;transform:translateX(-40px) scale(0.96)} }
        @keyframes kOutR  { from{opacity:1;transform:none} to{opacity:0;transform:translateX(40px) scale(0.96)} }
        @keyframes kBadge { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}
