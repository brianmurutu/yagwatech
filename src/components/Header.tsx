"use client";

import Link from "next/link";
import Image from "next/image";
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
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
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
    setMobileServicesOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header>
      {/* Top info bar — desktop only */}
      <div className="hidden lg:block bg-brand-blue py-1.5">
        <div className="container-wrap flex items-center justify-between text-white">
          <div className="flex items-center gap-6">
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/85 hover:text-white transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-brand-orange" /> {site.addressShort}
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

      {/* Main nav bar */}
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
          <Link href="/" className="flex items-center gap-2 group" aria-label="Yagwa Tech Solutions home">
            <div className="rounded-lg bg-white px-2 py-1 shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.jpg"
                alt="Yagwa Tech Solutions logo"
                width={100}
                height={36}
                className="h-9 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop nav */}
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

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile overlay backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile menu drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-brand-blueDark border-t border-white/10 px-5 py-4 animate-slide-down relative z-50 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div key={link.href} className="border-b border-white/5">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="flex w-full items-center justify-between py-3 text-sm transition-colors text-white/85 hover:text-white min-h-[44px]"
                      aria-expanded={mobileServicesOpen}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileServicesOpen && (
                      <div className="pb-2 pl-3 animate-slide-down">
                        <Link
                          href="/services"
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-[13px] text-brand-orange font-medium hover:text-brand-orangeLight transition-colors"
                        >
                          All Services &rarr;
                        </Link>
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 py-2 text-[13px] text-white/70 hover:text-white transition-colors"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange/70 shrink-0" />
                            {s.shortName}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 text-sm border-b border-white/5 last:border-0 transition-colors min-h-[44px] flex items-center ${
                    (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                      ? "text-brand-orange font-medium"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/get-quote"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center rounded-md bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-white hover:bg-brand-orangeLight transition-colors min-h-[44px]"
            >
              Get a quote
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
