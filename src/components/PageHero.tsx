import Breadcrumbs from "@/components/Breadcrumbs";

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="bg-gradient-to-br from-brand-blueDark via-brand-blue to-[#1A3F8F] py-16 lg:py-20">
      <div className="container-wrap">
        <Breadcrumbs items={breadcrumbs} />
        {eyebrow && (
          <p className="mt-6 text-xs font-medium uppercase tracking-wider text-brand-orangeLight">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-3xl lg:text-4xl font-medium text-white max-w-2xl text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base text-white/75 max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
