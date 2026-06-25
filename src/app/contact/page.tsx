import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { WhatsappIcon } from "@/components/SocialIcons";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact us",
  description:
    "Get in touch with Yagwa Tech Solutions. Reach our team in Nairobi, Kenya by phone, email, WhatsApp, or the contact form below.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Let&apos;s talk about your project"
        description="Whether you have a clear brief or just an idea you are exploring, our team is ready to help you figure out the right next step."
        breadcrumbs={[{ label: "Contact us" }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-wrap">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-medium text-ink-900">Send us a message</h2>
              <p className="mt-2 text-sm text-ink-400">
                Fill out the form and we will respond within one business day.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-black/5 p-6">
                <h3 className="text-sm font-medium text-ink-900">Contact details</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-brand-orange mt-0.5" />
                    <span className="text-sm text-ink-400">{site.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-brand-orange mt-0.5" />
                    <a href={`tel:${site.phoneRaw}`} className="text-sm text-ink-400 hover:text-brand-blue">
                      {site.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-brand-orange mt-0.5" />
                    <a href={`mailto:${site.email}`} className="text-sm text-ink-400 hover:text-brand-blue">
                      {site.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-brand-orange mt-0.5" />
                    <span className="text-sm text-ink-400">{site.hours}</span>
                  </div>
                </div>
              </div>

              <a
                href={`${site.social.whatsapp}?text=Hello%20YagwaTech`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-4 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                <WhatsappIcon className="h-4 w-4" /> Chat with us on WhatsApp
              </a>

              <div className="h-52 rounded-xl bg-ink-50 flex items-center justify-center">
                <span className="text-sm text-ink-400">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
