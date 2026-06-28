import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  Compass,
  Lightbulb,
  Trophy,
  Star,
} from "lucide-react";
import { site, stats } from "@/lib/site";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { team, testimonials, clients } from "@/lib/team";
import { getRecentPosts } from "@/lib/blog";
import { getServiceIcon } from "@/lib/icons";
import { buildMetadata } from "@/lib/seo";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCounter from "@/components/AnimatedCounter";

export const metadata = buildMetadata({
  title: `${site.name} | IT Services and Digital Solutions in Kenya`,
  description: site.description,
  path: "/",
});

// Per-project images
const projectImages: Record<string, string> = {
  "rusinga-digital-empowerment-initiative": "/images/portfolio-community.png",
  "business-matching": "/images/portfolio-branding.png",
  "assets-for-technology": "/images/portfolio-development.png",
  "merger-acquisition": "/images/portfolio-secure.png",
  "startup-funding": "/images/portfolio-finance.png",
};

// Blog image rotation by category keywords
function getBlogImage(category: string, index: number): string {
  const c = category.toLowerCase();
  if (c.includes("cloud") || c.includes("infrastructure")) return "/images/blog-cloud.png";
  if (c.includes("security") || c.includes("cyber")) return "/images/blog-cybersecurity.png";
  if (c.includes("startup") || c.includes("business")) return "/images/blog-startup.png";
  const fallbacks = ["/images/blog-cloud.png", "/images/blog-cybersecurity.png", "/images/blog-startup.png"];
  return fallbacks[index % 3];
}

// WebPage JSON-LD
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `${site.name} | IT Services and Digital Solutions in Kenya`,
  description: site.description,
  url: site.url,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.url }],
  },
};

export default function HomePage() {
  const recentPosts = getRecentPosts(undefined, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blueDark via-brand-blue to-[#1A3F8F] py-20 lg:py-28">
        {/* Animated orbs */}
        <div className="hero-orb absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-orange/10" />
        <div className="hero-orb absolute right-24 -bottom-32 h-72 w-72 rounded-full bg-white/5" style={{ animationDelay: "3s" }} />
        <div className="hero-orb absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-brand-orange/5" style={{ animationDelay: "1.5s" }} />

        <div className="container-wrap relative z-10">
          <div className="max-w-2xl">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/35 bg-brand-orange/15 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-xs font-medium text-brand-orangeLight">
                  Kenya&apos;s leading digital solutions agency
                </span>
              </span>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h1 className="mt-6 text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
                Build. Secure. Scale.{" "}
                <span className="text-brand-orange">With Yagwa Tech</span> Solutions.
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="mt-5 text-base lg:text-lg text-white/80 leading-relaxed max-w-xl">
                From custom software and cloud infrastructure to cybersecurity, branding,
                and automation, we deliver smart, scalable IT solutions that move your
                business forward across Kenya and beyond.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/get-quote"
                  className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white hover:bg-brand-orangeLight transition-all hover:-translate-y-0.5 shadow-lg shadow-brand-orange/25"
                >
                  Get a free quote <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-md border border-white/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  View our work
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8 stagger">
                {stats.map((stat) => (
                  <div key={stat.label} className="reveal visible">
                    <AnimatedCounter
                      value={stat.value}
                      className="text-2xl lg:text-3xl font-bold text-brand-orange"
                    />
                    <div className="mt-1 text-xs text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Trusted by ────────────────────────────────────────────────── */}
      <div className="border-b border-black/5 bg-white py-5">
        <div className="container-wrap flex flex-wrap items-center gap-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-ink-400">
            Trusted by
          </span>
          <div className="flex flex-wrap gap-10 stagger">
            {clients.map((c) => (
              <span key={c} className="text-sm font-semibold text-ink-400/60 hover:text-ink-400 transition-colors">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── About ─────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection type="scale">
              <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl shadow-brand-blue/20">
                <Image
                  src="/images/about-office.png"
                  alt="Yagwa Tech Solutions office in Nairobi, Kenya — modern workspace with African professionals"
                  fill
                  className="object-cover img-zoom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 rounded-xl bg-brand-orange px-4 py-3 text-white shadow-lg">
                  <div className="text-2xl font-bold">5+ yrs</div>
                  <div className="text-xs opacity-90">Industry experience</div>
                </div>
                <div className="absolute top-4 right-4 rounded-lg bg-brand-blueDark/80 backdrop-blur-sm px-3 py-2 text-white text-xs font-medium">
                  📍 Nairobi, Kenya
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                Who we are
              </p>
              <h2 className="mt-2 text-3xl font-bold text-ink-900">
                Your partner in{" "}
                <span className="text-brand-blue">digital transformation</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-400">
                Yagwa Tech Solutions is a forward thinking digital agency committed to
                delivering comprehensive IT services that drive innovation, efficiency,
                and growth. We serve startups, SMEs, and enterprises across Kenya and
                beyond, blending technical expertise with strategic insight to craft
                solutions tailored to each client&apos;s unique needs.
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-lg border-l-4 border-brand-blue bg-ink-50 px-4 py-3">
                  <h4 className="text-sm font-semibold text-brand-blue">Our mission</h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
                    To provide end to end IT and digital solutions that enable businesses
                    to scale, innovate, and lead with confidence, through technology that
                    is secure, efficient, and future ready.
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-brand-orange bg-ink-50 px-4 py-3">
                  <h4 className="text-sm font-semibold text-brand-orange">Our vision</h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
                    To become a globally recognized digital solutions agency that sets the
                    standard for excellence in IT services across Africa and beyond.
                  </p>
                </div>
              </div>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueLight transition-all hover:-translate-y-0.5 shadow-md shadow-brand-blue/20"
              >
                Learn more about us <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-wrap">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              What we do
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink-900">
              Our <span className="text-brand-blue">services</span>
            </h2>
            <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
              Discover the solutions we offer to help your business grow, adapt, and
              succeed in a digital first world.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {services.map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <AnimatedSection key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-black/5 bg-white p-6 hover:border-brand-blue hover:shadow-lg hover:shadow-brand-blue/8 transition-all hover:-translate-y-1"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue/8 group-hover:bg-brand-blue/15 transition-colors">
                      <Icon className="h-5 w-5 text-brand-blue" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-ink-900 leading-snug">
                      {service.name}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-400">
                      {service.tagline}
                    </p>
                    <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-blue">
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <div className="bg-brand-blueDark py-14">
        <div className="container-wrap grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i !== stats.length - 1 ? "lg:border-r border-white/10" : ""
              }`}
            >
              <AnimatedCounter
                value={stat.value}
                className="text-3xl lg:text-4xl font-bold text-brand-orange"
              />
              <div className="mt-1 text-sm text-white/65">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-wrap text-center">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Our process
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink-900">
              How we make work <span className="text-brand-blue">successful</span>
            </h2>
            <p className="mt-3 mx-auto text-[15px] text-ink-400 max-w-xl leading-relaxed">
              We focus on results, not just tasks, following a proven process that
              delivers real impact every time.
            </p>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 stagger">
            {[
              { icon: Search, title: "Analyse", step: "01", desc: "We use creative, customized methods tailored to your environment to understand your exact needs." },
              { icon: Compass, title: "Advise", step: "02", desc: "We identify where your business needs to go and map a clear roadmap to get there." },
              { icon: Lightbulb, title: "Strategy", step: "03", desc: "We deliver results through hands on execution, leading teams through complex change." },
              { icon: Trophy, title: "Result", step: "04", desc: "We provide ongoing guidance so you run a successful, future ready business." },
            ].map((item) => (
              <AnimatedSection key={item.title}>
                <div className="relative group">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-5xl font-black text-ink-100 select-none">
                    {item.step}
                  </div>
                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg shadow-brand-blue/25 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-5 text-sm font-semibold text-ink-900">{item.title}</h4>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-400">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Our work
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink-900">
              Featured <span className="text-brand-blue">portfolio</span>
            </h2>
            <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
              From scalable enterprise technology to community centered digital literacy
              programs, projects that drive transformation across Kenya and beyond.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((project) => (
              <AnimatedSection key={project.slug} type="scale">
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-black/5 bg-white overflow-hidden hover:shadow-xl hover:shadow-black/10 transition-all hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={projectImages[project.slug] ?? "/images/portfolio-development.png"}
                      alt={`${project.title} — Yagwa Tech Solutions project`}
                      fill
                      className="object-cover img-zoom"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-brand-orange/90 px-2.5 py-1 text-[11px] font-semibold text-white">
                        {project.categories[0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="text-sm font-semibold text-ink-900 leading-snug">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-400 line-clamp-2">
                      {project.summary}
                    </p>
                    <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-blue">
                      View project <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueLight transition-all hover:-translate-y-0.5 shadow-md shadow-brand-blue/20"
            >
              View all projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-wrap text-center">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              The people
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink-900">
              Meet our <span className="text-brand-blue">team</span>
            </h2>
            <p className="mt-3 mx-auto text-[15px] text-ink-400 max-w-xl leading-relaxed">
              Strategists, developers, designers, and problem solvers working together to
              turn ideas into impact.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger">
            {team.map((member) => (
              <AnimatedSection key={member.name} type="scale">
                <div className="group rounded-xl border border-black/5 p-5 text-center hover:shadow-md hover:border-brand-blue/20 transition-all hover:-translate-y-1">
                  <div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-base font-bold text-white shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${member.colorFrom}, ${member.colorTo})`,
                    }}
                  >
                    {member.initials}
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-ink-900">{member.name}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">{member.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Client reviews
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink-900">
              What our <span className="text-brand-blue">clients say</span>
            </h2>
            <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
              Real feedback, real results, hear directly from businesses we have worked
              with.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <AnimatedSection key={t.name} type="scale">
                <div className="flex h-full flex-col rounded-xl border border-black/5 bg-white p-6 hover:shadow-lg hover:shadow-black/5 transition-shadow">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                    ))}
                  </div>
                  <p className="flex-1 text-[13.5px] italic leading-relaxed text-ink-900">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ background: t.color }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink-900">{t.name}</div>
                      <div className="text-xs text-ink-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-wrap">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Insights
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink-900">
              Latest from our <span className="text-brand-blue">blog</span>
            </h2>
            <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
              Tech insights, business tips, and digital transformation stories written for
              people who build things.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {recentPosts.map((post, i) => (
              <AnimatedSection key={post.slug} type="scale">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-black/5 overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all hover:-translate-y-1"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={getBlogImage(post.category, i)}
                      alt={`${post.title} — Yagwa Tech blog`}
                      fill
                      className="object-cover img-zoom"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/50 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2.5 py-1 text-[11px] font-semibold text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 bg-white p-4">
                    <h3 className="text-sm font-semibold text-ink-900 leading-snug group-hover:text-brand-blue transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-auto pt-3 text-xs text-ink-400">
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orangeLight transition-all hover:-translate-y-0.5 shadow-md shadow-brand-orange/20"
            >
              View all articles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-orange to-brand-orangeDark py-16 lg:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="hero-orb absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white" />
          <div className="hero-orb absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-white" style={{ animationDelay: "2s" }} />
        </div>
        <div className="container-wrap relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white">
              Ready to transform your business with tech?
            </h2>
            <p className="mt-3 text-[15px] text-white/85 max-w-lg mx-auto">
              Let&apos;s build something great together. Our team is ready to bring your vision
              to life.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/get-quote"
                className="rounded-md bg-white px-7 py-3.5 text-sm font-bold text-brand-orange hover:bg-white/90 transition-all hover:-translate-y-0.5 shadow-lg"
              >
                Get a free quote
              </Link>
              <Link
                href="/contact"
                className="rounded-md border-2 border-white/60 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/15 transition-all hover:-translate-y-0.5"
              >
                Schedule a call
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
