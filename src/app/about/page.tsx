import { Building2, Target, Eye, Award } from "lucide-react";
import PageHero from "@/components/PageHero";
import { stats } from "@/lib/site";
import { team } from "@/lib/team";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About us",
  description:
    "Learn about Yagwa Tech Solutions, a Nairobi based digital solutions agency helping startups, SMEs, and enterprises across Kenya grow through technology.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="A digital solutions agency built on reliability and collaboration"
        description="We help businesses across Kenya turn ideas into impact through technology that is secure, efficient, and built to last."
        breadcrumbs={[{ label: "About us" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-96 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blueDark overflow-hidden flex flex-col items-center justify-center">
              <Building2 className="h-16 w-16 text-white/15" />
              <p className="mt-4 px-12 text-center text-sm text-white/50">
                Headquartered in Nairobi, serving clients across Kenya and beyond
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-medium text-ink-900">Our story</h2>
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
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-wrap grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-xl border border-black/5 p-6">
            <Target className="h-8 w-8 text-brand-blue" />
            <h3 className="mt-4 text-base font-medium text-ink-900">Our mission</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
              To provide end to end IT and digital solutions that enable businesses to
              scale, innovate, and lead with confidence.
            </p>
          </div>
          <div className="rounded-xl border border-black/5 p-6">
            <Eye className="h-8 w-8 text-brand-orange" />
            <h3 className="mt-4 text-base font-medium text-ink-900">Our vision</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
              To become a globally recognized digital solutions agency that sets the
              standard for excellence across Africa and beyond.
            </p>
          </div>
          <div className="rounded-xl border border-black/5 p-6">
            <Award className="h-8 w-8 text-brand-blue" />
            <h3 className="mt-4 text-base font-medium text-ink-900">Our values</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
              Reliability, creativity, and collaboration guide every project we take on,
              regardless of size.
            </p>
          </div>
          <div className="rounded-xl border border-black/5 p-6">
            <Building2 className="h-8 w-8 text-brand-orange" />
            <h3 className="mt-4 text-base font-medium text-ink-900">Our approach</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-400">
              We craft solutions tailored to each client&apos;s unique context, never
              generic templates dressed up as custom work.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-blueDark py-16">
        <div className="container-wrap grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${i !== stats.length - 1 ? "lg:border-r border-white/10" : ""}`}
            >
              <div className="text-3xl lg:text-4xl font-medium text-brand-orange">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-white/65">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-24 text-center">
        <div className="container-wrap">
          <h2 className="text-3xl font-medium text-ink-900">
            Meet the people behind <span className="text-brand-blue">YagwaTech</span>
          </h2>
          <p className="mt-3 mx-auto max-w-xl text-[15px] leading-relaxed text-ink-400">
            Strategists, developers, designers, and problem solvers working together to
            deliver meaningful results.
          </p>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-black/5 p-5">
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-base font-medium text-white"
                  style={{ background: `linear-gradient(135deg, ${member.colorFrom}, ${member.colorTo})` }}
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
    </>
  );
}
