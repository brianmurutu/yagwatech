import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "@/components/SocialIcons";
import { site } from "@/lib/site";
import NewsletterForm from "@/components/NewsletterForm";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faqs", label: "FAQs" },
];

const serviceLinks = [
  { href: "/services/software-systems-development", label: "Software development" },
  { href: "/services/cloud-services-infrastructure", label: "Cloud infrastructure" },
  { href: "/services/cybersecurity-compliance", label: "Cybersecurity" },
  { href: "/services/uiux-design-digital-branding", label: "UI/UX and branding" },
  { href: "/services/digital-marketing-seo", label: "Digital marketing" },
  { href: "/services/business-it-consulting", label: "IT consulting" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-blueDark">
      <div className="border-b border-white/10">
        <div className="container-wrap py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-medium text-white">Stay in the loop</h3>
            <p className="mt-1 text-sm text-white/60">
              Get the latest tech insights and YagwaTech updates in your inbox.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="container-wrap py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 group" aria-label="Yagwa Tech Solutions home">
              <div className="rounded-lg bg-white px-2 py-1 shadow transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.jpg"
                  alt="Yagwa Tech Solutions logo"
                  width={110}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              A forward thinking digital solutions agency delivering comprehensive IT
              services that drive innovation, efficiency, and growth across Kenya and
              beyond.
            </p>
            <div className="mt-4 flex gap-2.5">
              <a
                href={site.social.facebook}
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/70 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={site.social.twitter}
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/70 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href={site.social.instagram}
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/70 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={site.social.linkedin}
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/70 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href={site.social.whatsapp}
                aria-label="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/70 hover:bg-brand-orange hover:text-white transition-colors"
              >
                <WhatsappIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4">Quick links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-brand-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 hover:text-brand-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4">Contact us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-orange mt-0.5" />
                <span className="text-sm text-white/55">{site.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-brand-orange mt-0.5" />
                <span className="text-sm text-white/55">{site.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-brand-orange mt-0.5" />
                <span className="text-sm text-white/55">
                  {site.email}
                  <br />
                  {site.supportEmail}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-brand-orange mt-0.5" />
                <span className="text-sm text-white/55">{site.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wrap py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            Copyright {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy policy
            </Link>
            <Link href="/terms-conditions" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms and conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
