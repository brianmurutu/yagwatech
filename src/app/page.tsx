import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Search,
  Compass,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { site, stats } from "@/lib/site";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { team, testimonials, clients } from "@/lib/team";
import { getRecentPosts } from "@/lib/blog";
import { getServiceIcon } from "@/lib/icons";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${site.name} | IT Services and Digital Solutions in Kenya`,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  const recentPosts = getRecentPosts(undefined, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blueDark via-brand-blue to-[#1A3F8F] py-20 lg:py-28">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-orange/10" />
        <div className="absolute right-24 -bottom-32 h-72 w-72 rounded-full bg-white/5" />
        <div className="container-wrap relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-orange/35 bg-brand-orange/15 px-3.5 py-1.5">
              <span className="text-xs font-medium text-brand-orangeLight">
                Kenya&apos;s leading digital solutions agency
              </span>
            </span>
            <h1 className="mt-6 text-4xl lg:text-5xl font-medium text-white leading-tight text-balance">
              Build. Secure. Scale. With <span className="text-brand-orange">Yagwa Tech</span> Solutions.
            </h1>
            <p className="mt-5 text-base lg:text-lg text-white/78 leading-relaxed max-w-xl">
              From custom software and cloud infrastructure to cybersecurity, branding,
              and automation, we deliver smart, scalable IT solutions that move your
              business forward across Kenya and beyond.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/get-quote"
                className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-7 py-3 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors"
              >
                Get a free quote
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 px-7 py-3 text-sm text-white hover:bg-white/10 transition-colors"
              >
                View our work
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl lg:text-3xl font-medium text-brand-orange">{stat.value}</div>
                  <div className="mt-1 text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-black/5 bg-white py-5">
        <div className="container-wrap flex flex-wrap items-center gap-8">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Trusted by
          </span>
          <div className="flex flex-wrap gap-10">
            {clients.map((c) => (
              <span key={c} className="text-sm font-medium text-ink-400/65">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-96 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blueDark overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-brand-orange/15" />
              <Building2 className="h-16 w-16 text-white/15" />
              <p className="mt-4 px-12 text-center text-sm text-white/50">
                Your digital transformation partner in Nairobi
              </p>
              <div className="absolute bottom-6 left-6 rounded-xl bg-brand-orange px-4 py-3 text-white">
                <div className="text-2xl font-medium">5+ yrs</div>
                <div className="text-xs opacity-90">Industry experience</div>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-brand-orange">
                Who we are
              </p>
              <h2 className="mt-2 text-3xl font-medium text-ink-900">
                Your partner in <span className="text-brand-blue">digital transformation</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-400">
                Yagwa Tech Solutions is a forward thinking digital agency committed to
                delivering comprehensive IT services that drive innovation, efficiency,
                and growth. We serve startups, SMEs, and enterprises across Kenya and
                beyond, blending technical expertise with strategic insight to craft
                solutions tailored to each client&apos;s unique needs.
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-lg border-l-3 border-brand-blue bg-ink-50 px-4 py-3">
                  <h4 className="text-sm font-medium text-brand-blue">Our mission</h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
                    To provide end to end IT and digital solutions that enable businesses
                    to scale, innovate, and lead with confidence, through technology that
                    is secure, efficient, and future ready.
                  </p>
                </div>
                <div className="rounded-lg border-l-3 border-brand-orange bg-ink-50 px-4 py-3">
                  <h4 className="text-sm font-medium text-brand-orange">Our vision</h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
                    To become a globally recognized digital solutions agency that sets the
                    standard for excellence in IT services across Africa and beyond.
                  </p>
                </div>
              </div>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-medium text-white hover:bg-brand-blueLight transition-colors"
              >
                Learn more about us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="container-wrap">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-orange">
            What we do
          </p>
          <h2 className="mt-2 text-3xl font-medium text-ink-900">
            Our <span className="text-brand-blue">services</span>
          </h2>
          <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
            Discover the solutions we offer to help your business grow, adapt, and
            succeed in a digital first world.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group rounded-xl border border-black/5 bg-white p-6 hover:border-brand-blue transition-colors"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue/5">
                    <Icon className="h-5 w-5 text-brand-blue" />
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-ink-900 leading-snug">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-400">
                    {service.tagline}
                  </p>
                  <span className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-blue">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="bg-brand-blueDark py-12">
        <div className="container-wrap grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i !== stats.length - 1 ? "lg:border-r border-white/10" : ""
              }`}
            >
              <div className="text-3xl lg:text-4xl font-medium text-brand-orange">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-white/65">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-white py-20 lg:py-24">
        <div className="container-wrap text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-orange">
            Our process
          </p>
          <h2 className="mt-2 text-3xl font-medium text-ink-900">
            How we make work <span className="text-brand-blue">successful</span>
          </h2>
          <p className="mt-3 mx-auto text-[15px] text-ink-400 max-w-xl leading-relaxed">
            We focus on results, not just tasks, following a proven process that
            delivers real impact every time.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, title: "Analyse", desc: "We use creative, customized methods tailored to your environment to understand your exact needs." },
              { icon: Compass, title: "Advise", desc: "We identify where your business needs to go and map a clear roadmap to get there." },
              { icon: Lightbulb, title: "Strategy", desc: "We deliver results through hands on execution, leading teams through complex change." },
              { icon: Trophy, title: "Result", desc: "We provide ongoing guidance so you run a successful, future ready business." },
            ].map((item) => (
              <div key={item.title}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-sm font-medium text-ink-900">{item.title}</h4>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-orange">
            Our work
          </p>
          <h2 className="mt-2 text-3xl font-medium text-ink-900">
            Featured <span className="text-brand-blue">portfolio</span>
          </h2>
          <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
            From scalable enterprise technology to community centered digital literacy
            programs, projects that drive transformation across Kenya and beyond.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((project, i) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group rounded-xl border border-black/5 bg-white overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-36 flex items-center justify-center ${
                    i % 3 === 0
                      ? "bg-gradient-to-br from-brand-blue to-brand-blueLight"
                      : i % 3 === 1
                      ? "bg-gradient-to-br from-brand-blueDark to-brand-blue"
                      : "bg-gradient-to-br from-brand-orange to-brand-orangeLight"
                  }`}
                >
                  <Building2 className="h-9 w-9 text-white/40" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-brand-orange">
                    {project.categories.join(" / ")}
                  </p>
                  <h3 className="mt-1 text-sm font-medium text-ink-900 leading-snug">
                    {project.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-medium text-white hover:bg-brand-blueLight transition-colors"
            >
              View all projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="container-wrap text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-orange">
            The people
          </p>
          <h2 className="mt-2 text-3xl font-medium text-ink-900">
            Meet our <span className="text-brand-blue">team</span>
          </h2>
          <p className="mt-3 mx-auto text-[15px] text-ink-400 max-w-xl leading-relaxed">
            Strategists, developers, designers, and problem solvers working together to
            turn ideas into impact.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-black/5 p-5 text-center">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-base font-medium text-white"
                  style={{
                    background: `linear-gradient(135deg, ${member.colorFrom}, ${member.colorTo})`,
                  }}
                >
                  {member.initials}
                </div>
                <h4 className="mt-3 text-sm font-medium text-ink-900">{member.name}</h4>
                <p className="mt-1 text-xs leading-relaxed text-ink-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-orange">
            Client reviews
          </p>
          <h2 className="mt-2 text-3xl font-medium text-ink-900">
            What our <span className="text-brand-blue">clients say</span>
          </h2>
          <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
            Real feedback, real results, hear directly from businesses we have worked
            with.
          </p>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-black/5 bg-white p-6">
                <p className="text-[13.5px] italic leading-relaxed text-ink-900">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium text-white"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-900">{t.name}</div>
                    <div className="text-xs text-ink-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="container-wrap">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-orange">
            Insights
          </p>
          <h2 className="mt-2 text-3xl font-medium text-ink-900">
            Latest from our <span className="text-brand-blue">blog</span>
          </h2>
          <p className="mt-3 text-[15px] text-ink-400 max-w-xl leading-relaxed">
            Tech insights, business tips, and digital transformation stories written for
            people who build things.
          </p>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {recentPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-black/5 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-32 flex items-center justify-center ${
                    i % 3 === 0
                      ? "bg-gradient-to-br from-brand-blue to-brand-blueLight"
                      : i % 3 === 1
                      ? "bg-gradient-to-br from-brand-blueDark to-brand-blue"
                      : "bg-gradient-to-br from-brand-orange to-brand-orangeLight"
                  }`}
                >
                  <span className="text-xs font-medium text-white/55">{post.category}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-ink-900 leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs text-ink-400">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-6 py-3 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors"
            >
              View all articles
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-orange to-brand-orangeDark py-16 lg:py-20 text-center">
        <div className="container-wrap">
          <h2 className="text-3xl font-medium text-white">
            Ready to transform your business with tech?
          </h2>
          <p className="mt-3 text-[15px] text-white/85">
            Let&apos;s build something great together. Our team is ready to bring your vision
            to life.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/get-quote"
              className="rounded-md bg-white px-7 py-3 text-sm font-medium text-brand-orange hover:bg-white/90 transition-colors"
            >
              Get a free quote
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-white/60 px-7 py-3 text-sm text-white hover:bg-white/10 transition-colors"
            >
              Schedule a call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
