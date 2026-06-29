"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { projects, portfolioCategories } from "@/lib/projects";

const projectImages: Record<string, string> = {
  "ai-trainer-academy": "/images/portfolio-development.png",
  "rusinga-digital-empowerment-initiative": "/images/portfolio-community.png",
  "business-matching": "/images/portfolio-branding.png",
  "assets-for-technology": "/images/portfolio-development.png",
  "merger-acquisition": "/images/portfolio-secure.png",
  "startup-funding": "/images/portfolio-finance.png",
};

const fallbackImages = [
  "/images/portfolio-development.png",
  "/images/portfolio-community.png",
  "/images/portfolio-branding.png",
];

export default function PortfolioGrid() {
  const [active, setActive] = useState("All");
  const [animKey, setAnimKey] = useState(0);

  function handleFilter(cat: string) {
    setActive(cat);
    setAnimKey((k) => k + 1);
  }

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(active));

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {portfolioCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`rounded-full border px-4 py-1.5 text-[12.5px] font-medium transition-all ${
              active === cat
                ? "bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/20"
                : "border-black/10 text-ink-400 hover:border-brand-blue hover:text-brand-blue"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div key={animKey} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project, i) => {
          const imgSrc = projectImages[project.slug] ?? fallbackImages[i % fallbackImages.length];
          return (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col rounded-xl border border-black/5 bg-white overflow-hidden hover:shadow-xl hover:shadow-black/10 transition-all hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={imgSrc}
                  alt={`${project.title} — Yagwa Tech portfolio project`}
                  fill
                  className="object-cover img-zoom"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-full bg-brand-orange/90 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {project.categories[0]}
                  </span>
                  <span className="ml-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2.5 py-1 text-[11px] text-white">
                    {project.year}
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-base font-semibold text-ink-900 leading-snug">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-400 line-clamp-2">
                  {project.summary}
                </p>
                <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-blue">
                  View project <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-400">
          No projects found in this category yet.
        </p>
      )}
    </div>
  );
}
