"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <header>
      {/* Top info bar */}
      <div className="hidden lg:block bg-brand-blue py-1.5">
        <div className="container-wrap flex items-center justify-between text-white">
          <div className="flex items-center gap-6">
            <a
              href={`https://maps.google.com/?q=Nairobi,Kenya`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/85 hover:text-white transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-brand-orange" /> {site.address}
            </a>
            <a
              href={`tel:${site.phoneRaw}`}
              className="flex items-center gap-1.5 text-xs text-white/85 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-brand-orange" /> {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-1.5 text-xs text-white/85 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-brand-orange" /> {site.email}
            </a>
            <span className="flex items-center gap-1.5 text-xs text-white/85">
              <Clock className="h-3.5 w-3.5 text-brand-orange" /> {site.hours}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/70 hover:text-brand-orange transition-colors">
              <FacebookIcon className="h-3.5 w-3.5" />
            </a>
            <a href={site.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white/70 hover:text-brand-orange transition-colors">
              <TwitterIcon className="h-3.5 w-3.5" />
            </a>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/70 hover:text-brand-orange transition-colors">
              <InstagramIcon className="h-3.5 w-3.5" />
            </a>
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/70 hover:text-brand-orange transition-colors">
              <LinkedinIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav bar — shrinks on scroll */}
      <div
        className={`bg-brand-blueDark sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg shadow-black/20" : ""
        }`}
      >
        <div
          className={`container-wrap flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-sm font-bold text-white group-hover:bg-brand-orangeLight transition-colors">
              YT
            </span>
            <span className="text-base font-semibold text-white">
              Yagwa<span className="text-brand-orange">Tech</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
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
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      pathname.startsWith("/services")
                        ? "text-brand-orange"
                        : "text-white/80 hover:text-white"
                    }`}
                    aria-current={pathname.startsWith("/services") ? "page" : undefined}
                  >
                    {link.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>
                  {servicesOpen && (
                    <div className="absolute left-0 top-full pt-2 w-72 animate-slide-down">
                      <div className="rounded-xl bg-white shadow-xl border border-black/5 py-2 max-h-96 overflow-y-auto">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-900 hover:bg-ink-50 hover:text-brand-blue transition-colors"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />
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
                  className={`text-sm font-medium transition-colors ${
                    (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                      ? "text-brand-orange"
                      : "text-white/80 hover:text-white"
                  }`}
                  aria-current={
                    (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                      ? "page"
                      : undefined
                  }
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <Link
            href="/get-quote"
            className="hidden lg:inline-flex items-center rounded-md bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-orangeLight transition-colors shadow-sm"
          >
            Get a quote
          </Link>

          <button
            className="lg:hidden text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-brand-blueDark border-t border-white/10 px-6 py-4 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm border-b border-white/5 last:border-0 transition-colors ${
                  (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                    ? "text-brand-orange font-medium"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-quote"
              onClick={() => setMobileOpen(false)}
              className="mt-4 block rounded-md bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-white hover:bg-brand-orangeLight transition-colors"
            >
              Get a quote
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
