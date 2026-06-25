"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from "@/components/SocialIcons";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact us" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header>
      <div className="hidden lg:block bg-brand-blue py-1.5">
        <div className="container-wrap flex items-center justify-between text-white">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs text-white/85">
              <MapPin className="h-3.5 w-3.5 text-brand-orange" /> {site.address}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/85">
              <Phone className="h-3.5 w-3.5 text-brand-orange" /> {site.phone}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/85">
              <Mail className="h-3.5 w-3.5 text-brand-orange" /> {site.email}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/85">
              <Clock className="h-3.5 w-3.5 text-brand-orange" /> {site.hours}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href={site.social.facebook} aria-label="Facebook" className="text-white/70 hover:text-brand-orange">
              <FacebookIcon className="h-3.5 w-3.5" />
            </a>
            <a href={site.social.twitter} aria-label="Twitter" className="text-white/70 hover:text-brand-orange">
              <TwitterIcon className="h-3.5 w-3.5" />
            </a>
            <a href={site.social.instagram} aria-label="Instagram" className="text-white/70 hover:text-brand-orange">
              <InstagramIcon className="h-3.5 w-3.5" />
            </a>
            <a href={site.social.linkedin} aria-label="LinkedIn" className="text-white/70 hover:text-brand-orange">
              <LinkedinIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-brand-blueDark sticky top-0 z-50">
        <div className="container-wrap flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-sm font-medium text-white">
              YT
            </span>
            <span className="text-base font-medium text-white">
              Yagwa<span className="text-brand-orange">Tech</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Link>
                  {servicesOpen && (
                    <div className="absolute left-0 top-full pt-2 w-72">
                      <div className="rounded-lg bg-white shadow-lg border border-black/5 py-2 max-h-96 overflow-y-auto">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="block px-4 py-2 text-sm text-ink-900 hover:bg-ink-50 hover:text-brand-blue transition-colors"
                          >
                            {s.shortName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <Link
            href="/get-quote"
            className="hidden lg:inline-flex items-center rounded-md bg-brand-orange px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors"
          >
            Get a quote
          </Link>

          <button
            className="lg:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-brand-blueDark border-t border-white/10 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm text-white/85 border-b border-white/5 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-quote"
              onClick={() => setMobileOpen(false)}
              className="mt-4 block rounded-md bg-brand-orange px-5 py-2.5 text-center text-sm font-medium text-white"
            >
              Get a quote
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
