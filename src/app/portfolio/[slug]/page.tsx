import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import { projects, getProjectBySlug } from "@/lib/projects";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/portfolio/${project.slug}`,
  });
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const otherProjects = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={project.categories.join(" / ")}
        title={project.title}
        description={project.summary}
        breadcrumbs={[
          { label: "Portfolio", href: "/portfolio" },
          { label: project.title, href: `/portfolio/${project.slug}` },
        ]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-wrap">
          <div className="h-64 lg:h-80 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blueDark flex items-center justify-center mb-12">
            <Building2 className="h-16 w-16 text-white/15" />
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-medium text-ink-900">The challenge</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-medium text-ink-900">Our solution</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                  {project.solution}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-medium text-ink-900">Results</h2>
                <ul className="mt-3 space-y-2.5">
                  {project.results.map((result) => (
                    <li key={result} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
                      <span className="text-[14px] leading-relaxed text-ink-400">
                        {result}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-black/5 bg-ink-50 p-6">
                <h3 className="text-sm font-medium text-ink-900">Project details</h3>
                <dl className="mt-4 space-y-3 text-[13px]">
                  <div className="flex justify-between">
                    <dt className="text-ink-400">Client</dt>
                    <dd className="font-medium text-ink-900">{project.client}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-400">Year</dt>
                    <dd className="font-medium text-ink-900">{project.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-400">Categories</dt>
                    <dd className="font-medium text-ink-900 text-right">
                      {project.categories.join(", ")}
                    </dd>
                  </div>
                </dl>
                <div className="mt-5 border-t border-black/5 pt-5">
                  <h4 className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Services provided
                  </h4>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {project.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-white border border-black/5 px-3 py-1 text-[11.5px] text-ink-900"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/get-quote"
                  className="mt-6 flex items-center justify-center gap-2 rounded-md bg-brand-orange px-5 py-3 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors"
                >
                  Start a similar project
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-black/5 pt-12">
            <h2 className="text-xl font-medium text-ink-900">More projects</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {otherProjects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/portfolio/${p.slug}`}
                  className="group rounded-xl border border-black/5 p-5 hover:border-brand-blue transition-colors"
                >
                  <p className="text-xs font-medium text-brand-orange">
                    {p.categories.join(" / ")}
                  </p>
                  <h3 className="mt-1.5 text-sm font-medium text-ink-900 leading-snug">
                    {p.title}
                  </h3>
                  <span className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-blue">
                    View project <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
