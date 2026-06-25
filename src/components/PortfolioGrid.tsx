"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { projects, portfolioCategories } from "@/lib/projects";

const gradients = [
  "from-brand-blue to-brand-blueLight",
  "from-brand-blueDark to-brand-blue",
  "from-brand-orange to-brand-orangeLight",
];

export default function PortfolioGrid() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(active));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {portfolioCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-1.5 text-[12.5px] transition-colors ${
              active === cat
                ? "bg-brand-blue text-white border-brand-blue"
                : "border-black/10 text-ink-400 hover:border-brand-blue"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project, i) => (
          <Link
            key={project.slug}
            href={`/portfolio/${project.slug}`}
            className="group rounded-xl border border-black/5 bg-white overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className={`h-40 flex items-center justify-center bg-gradient-to-br ${
                gradients[i % gradients.length]
              }`}
            >
              <Building2 className="h-9 w-9 text-white/40" />
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-brand-orange">
                {project.categories.join(" / ")}
              </p>
              <h3 className="mt-1.5 text-base font-medium text-ink-900 leading-snug">
                {project.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-400 line-clamp-2">
                {project.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-400">
          No projects found in this category yet.
        </p>
      )}
    </div>
  );
}
