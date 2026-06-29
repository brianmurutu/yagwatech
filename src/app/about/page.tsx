import Image from "next/image";
import Link from "next/link";
import { Target, Eye, Award, Layers, Download, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { stats, site } from "@/lib/site";
import { team } from "@/lib/team";
import { buildMetadata } from "@/lib/seo";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedCounter from "@/components/AnimatedCounter";

export const metadata = buildMetadata({
  title: "About us",
  description:
    "Learn about Yagwa Tech Solutions, a Nairobi based digital solutions agency helping startups, SMEs, and enterprises across Kenya grow through technology.",
  path: "/about",
  keywords: [
    "about Yagwa Tech Solutions",
    "Nairobi digital agency",
    "Kenya IT company history",
    "software development team Kenya",
  ],
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="A digital solutions agency built on reliability and collaboration"
        description="We help businesses across Kenya turn ideas into impact through technology that is secure, efficient, and built to last."
        breadcrumbs={[{ label: "About us", href: "/about" }]}
      />

      {/* ── Our Story ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection type="scale">
              <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl shadow-brand-blue/20">
                <Image
                  src="/images/about-office.png"
                  alt="Yagwa Tech Solutions modern office workspace in Nairobi, Kenya with African professionals"
                  fill
                  className="object-cover img-zoom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/40 to-transparent" />
                <div className="absolute top-4 right-4 rounded-lg bg-brand-blueDark/80 backdrop-blur-sm px-3 py-2 text-white text-xs font-medium">
                  📍 Karen, Nairobi
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={150}>
              <h2 className="text-3xl font-bold text-ink-900">Our story</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-400">
                Yagwa Tech Solutions started with a simple observation, businesses across
                Kenya were either underserved by generic software, or overpaying for
                solutions built without their context in mind. We set out to build a
                different kind of agency, one that blends deep technical skill with an
                honest understanding of how Kenyan businesses actually operate.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-400">
                Since then, we have grown into a full spectrum digital solutions
                provider, working across software development, cloud infrastructure,
                cybersecurity, branding, and automation. What has not changed is our
                approach, we start by understanding the business problem, then build the
                technology that actually solves it.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-400">
                Today we serve startups, SMEs, and enterprises across industries,
                including community organizations and initiatives working on digital
                empowerment across Kenya.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blueLight transition-all hover:-translate-y-0.5 shadow-md shadow-brand-blue/20"
                >
                  Work with us <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={site.portfolioPdf}
                  download
                  className="inline-flex items-center gap-2 rounded-md border border-brand-blue/30 bg-ink-50 px-6 py-3 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  Download Company Portfolio
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container-wrap grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {[
            { Icon: Target, color: "brand-blue", title: "Our mission", text: "To provide end to end IT and digital solutions that enable businesses to scale, innovate, and lead with confidence." },
            { Icon: Eye, color: "brand-orange", title: "Our vision", text: "To become a globally recognized digital solutions agency that sets the standard for excellence across Africa and beyond." },
            { Icon: Award, color: "brand-blue", title: "Our values", text: "Reliability, creativity, and collaboration guide every project we take on, regardless of size." },
            { Icon: Layers, color: "brand-orange", title: "Our approach", text: "We craft solutions tailored to each client's unique context, never generic templates dressed up as custom work." },
          ].map(({ Icon, color, title, text }) => (
            <AnimatedSection key={title} type="scale">
              <div className="group rounded-xl border border-black/5 p-6 hover:shadow-md hover:-translate-y-1 transition-all">
                <Icon className={`h-8 w-8 text-${color}`} />
                <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-400">{text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-blueDark py-16">
        <div className="container-wrap grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${i !== stats.length - 1 ? "lg:border-r border-white/10" : ""}`}
            >
              <AnimatedCounter
                value={stat.value}
                className="text-3xl lg:text-4xl font-bold text-brand-orange"
              />
              <div className="mt-1 text-sm text-white/65">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 text-center">
        <div className="container-wrap">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-ink-900">
              Meet the people behind{" "}
              <span className="text-brand-blue">YagwaTech</span>
            </h2>
            <p className="mt-3 mx-auto max-w-xl text-[15px] leading-relaxed text-ink-400">
              Strategists, developers, designers, and problem solvers working together to
              deliver meaningful results.
            </p>
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 stagger">
            {team.map((member) => (
              <AnimatedSection key={member.name} type="scale">
                <div className="group rounded-xl border border-black/5 p-5 hover:shadow-md hover:-translate-y-1 transition-all">
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
    </>
  );
}
