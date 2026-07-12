"use client";

import React, { useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { existingPartners, Partner } from "@/lib/partners";
import { partnerSchema } from "@/lib/validation";
import { site } from "@/lib/site";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Calendar
} from "lucide-react";

export default function PartnerPage() {
  // Existing partners state
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    partnershipType: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const togglePartner = (id: string) => {
    if (expandedPartner === id) {
      setExpandedPartner(null);
    } else {
      setExpandedPartner(id);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setErrors({});

    // Zod client side validation
    const result = partnerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      
      // Scroll to the first error
      const firstErrorKey = Object.keys(fieldErrors)[0];
      const el = document.getElementsByName(firstErrorKey)[0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        // Clear form
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          website: "",
          partnershipType: "",
          message: "",
        });
      } else {
        setSubmitError(data.error || "An error occurred while submitting. Please try again.");
      }
    } catch (err) {
      setSubmitError("Failed to connect to the server. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "Telecom & USSD Integration", label: "Telecom & USSD Integration" },
    { value: "Financial & Payment Gateways", label: "Financial & Payment Gateways" },
    { value: "Cloud Infrastructure & Hosting", label: "Cloud Infrastructure & Hosting" },
    { value: "SME Digital Enablement", label: "SME Digital Enablement" },
    { value: "Referral & Agency Program", label: "Referral & Agency Program" },
    { value: "Other", label: "Other Business Alliance" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* ── BREATHTAKING HERO SECTION ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07255A] via-[#0B3D91] to-[#1A56C4] py-16 sm:py-24 lg:py-28 text-white">
        {/* Dynamic Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Glowing Ambient Blurs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F47B20]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-brand-orange/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-wrap relative z-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Partner with us" },
            ]}
          />
          <div className="grid lg:grid-cols-12 gap-12 items-center mt-8">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#F47B20] tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Collaborative Alliances
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Forge the Future of Technology. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47B20] to-orange-400">
                  Partner With Us.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
                We collaborate with global infrastructure giants, financial institutions, and innovative local enterprises to engineer premium systems that drive digitization across East Africa and beyond.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="#form-section"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 w-full sm:w-auto bg-gradient-to-r from-[#F47B20] to-orange-500 hover:from-orange-500 hover:to-[#F47B20] text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5"
                >
                  Become a Partner <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#partners-section"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl border border-white/10 transition-all duration-200"
                >
                  View Existing Network
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              {/* Artistic Frame for Image */}
              <div className="relative group w-full max-w-[420px] aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-md">
                {/* Glowing borders */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F47B20]/20 to-[#0B3D91]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Outer glowing ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#F47B20] via-orange-400 to-[#0B3D91] opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-500 -z-10" />

                {/* Animated tech accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#F47B20] rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#F47B20] rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#0B3D91] rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#0B3D91] rounded-br-lg" />

                {/* Actual image */}
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80"
                  alt="Yagwa Tech Partnership Visual"
                  className="object-cover rounded-3xl transform group-hover:scale-105 transition-transform duration-700 w-full h-full absolute inset-0"
                />

                {/* Tech overlay grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNER BENEFITS VALUE GRID ──────────────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-wrap">
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection type="scale" delay={100} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-brand-blue">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Accelerated Scale</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Leverage our robust client relationships and localized technical expertise to scale your integrations across Kenya’s dynamic markets.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection type="scale" delay={200} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 text-[#F47B20]">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Robust Integrations</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  We specialize in building secure gateway connections, high-frequency USSD layers, and custom API bridges with extreme reliability.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection type="scale" delay={300} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Compliance & Security</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Every pipeline we build adheres to top-tier security standards, including GDPR/NDPA compliance, end-to-end data encryption, and regular code audits.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── PARTNERS SHOWCASE SECTION ────────────────────────────────── */}
      <section id="partners-section" className="py-12 sm:py-20 lg:py-24">
        <div className="container-wrap">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F47B20] bg-orange-50 px-3 py-1 rounded-full">
              Our Network
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Showcasing Our Trust Ecosystem
            </h2>
            <p className="mt-4 text-base text-slate-600">
              We take pride in our robust collaborative relationships with local telecommunication leaders, commercial banks, and international cloud infrastructure providers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {existingPartners.map((partner, index) => {
              const Logo = partner.logoComponent;
              const isExpanded = expandedPartner === partner.id;
              return (
                <AnimatedSection
                  key={partner.id}
                  type="scale"
                  delay={50 * index}
                  className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                    isExpanded ? "ring-2 ring-brand-blue/50 border-transparent sm:col-span-2 lg:col-span-2 lg:row-span-1" : "border-slate-200"
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="bg-slate-50 p-2.5 rounded-xl h-12 w-32 flex items-center justify-center">
                        <Logo className="h-6 w-full text-slate-700 hover:text-brand-blue transition-colors duration-200" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        Partner
                      </span>
                    </div>

                    <h3 className="text-md font-bold text-slate-900">{partner.name}</h3>
                    <p className="text-xs font-semibold text-brand-blue mt-0.5">{partner.category}</p>

                    <div className="mt-3 text-xs font-medium text-slate-700 bg-blue-50/50 border border-blue-100/50 p-3 rounded-lg flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-brand-orange mt-0.5 shrink-0" />
                      <p className="leading-relaxed">
                        <span className="font-semibold text-slate-800">Scope:</span> {partner.scope}
                      </p>
                    </div>

                    {/* Expandable Impact Section */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 animate-fadeIn">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Collaboration Impact</h4>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {partner.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/40 flex justify-end">
                    <button
                      onClick={() => togglePartner(partner.id)}
                      className="text-xs font-semibold text-brand-blue hover:text-brand-orange flex items-center gap-1 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <>
                          Hide details <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Explore impact <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PARTNERSHIP FORM SECTION ─────────────────────────────────── */}
      <section id="form-section" className="py-12 sm:py-20 lg:py-28 bg-slate-100 border-t border-slate-200">
        <div className="container-wrap">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              
              {/* Left Column Info Banner */}
              <div className="md:col-span-2 bg-gradient-to-br from-[#07255A] to-[#0B3D91] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#F47B20]/15 rounded-full blur-[60px] pointer-events-none" />
                
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Let’s engineer something incredible.</h3>
                  <p className="mt-4 text-sm text-white/70 leading-relaxed">
                    By submitting a request, your proposal is automatically queued directly into our partner evaluation pipeline.
                  </p>
                  
                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#F47B20]" />
                      </div>
                      <p className="text-xs text-white/80">Immediate auto-receipt email confirmation.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#F47B20]" />
                      </div>
                      <p className="text-xs text-white/80">Notification auto-relayed to Steering Committee.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#F47B20]" />
                      </div>
                      <p className="text-xs text-white/80">Response review timeframe guaranteed under 3 business days.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-semibold text-[#F47B20] uppercase tracking-wider">Direct Contacts</h4>
                  <p className="mt-2 text-xs text-white/70">
                    Email: <a href={`mailto:${site.email}`} className="text-white hover:underline">{site.email}</a>
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    WhatsApp: <a href={site.social.whatsapp} target="_blank" className="text-[#F47B20] hover:underline font-semibold">{site.phone}</a>
                  </p>
                </div>
              </div>

              {/* Right Column Form Block */}
              <div className="md:col-span-3 p-6 sm:p-8 lg:p-10 relative bg-white">
                
                {/* ── SUCCESS PANEL ────────────────────────────────────────── */}
                {success ? (
                  <div className="py-8 text-center animate-fadeIn flex flex-col items-center justify-center h-full">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#09B83E]/10 rounded-full scale-150 animate-ping duration-1000" />
                      <div className="w-20 h-20 bg-[#09B83E] text-white rounded-full flex items-center justify-center relative shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                    </div>
                    
                    <h3 className="mt-8 text-2xl font-bold text-slate-900 tracking-tight">Proposal Successfully Transmitted!</h3>
                    <p className="mt-3 text-sm text-slate-600 max-w-md">
                      A confirmation email detailing the receipt and evaluating steps has been sent to your address. The YagwaTech team has also been notified.
                    </p>

                    {/* Interactive Pipeline Timeline */}
                    <div className="mt-8 w-full max-w-md bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Automatic Processing Pipeline</h4>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            ✓
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Step 1: Submission Verified</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Zod validation passed and request captured successfully.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            ✓
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Step 2: Auto-Mailer Dispatch</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Welcome/receipt email sent to partner, notification sent to admin team.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            ●
                          </div>
                          <div>
                            <p className="text-xs font-bold text-brand-blue">Step 3: Steering Alignment Review</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Pending evaluation of technical/business synergies (2-3 business days).</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Calendly Booking Card */}
                    <div className="mt-6 w-full max-w-md bg-gradient-to-br from-brand-blue/5 to-amber-500/5 border border-brand-blue/10 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/5 rounded-full blur-lg pointer-events-none" />
                      
                      <div className="mx-auto w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-3.5 relative">
                        <Calendar className="w-6 h-6" />
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-900">Accelerate Your Partnership</h4>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        Book a 15-minute introductory meeting with our Steering Committee right away to align on technical & business synergies.
                      </p>
                      
                      <a
                        href={site.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-brand-blue hover:bg-[#072f6e] text-white font-bold rounded-xl text-xs transition-all hover:scale-[1.02] shadow-md shadow-brand-blue/15"
                      >
                        <Calendar className="w-4 h-4" /> Book Meeting on Calendly
                      </a>
                    </div>

                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                    >
                      Submit another proposal
                    </button>
                  </div>
                ) : (
                  // ── PARTNERSHIP FORM ─────────────────────────────────────
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Partnership Submission Form</h3>
                    <p className="mt-1.5 text-xs text-slate-500">Provide details below to hook your business idea into our system.</p>

                    {submitError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                        {submitError}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Company/Organization *</label>
                          <div className="relative">
                            <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleChange}
                              placeholder="e.g. Acme Labs Ltd"
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.companyName
                                  ? "border-red-300 focus:ring-red-200"
                                  : "border-slate-200 focus:ring-brand-blue/20 focus:border-brand-blue"
                              }`}
                            />
                          </div>
                          {errors.companyName && (
                            <p className="mt-1 text-[11px] text-red-600 font-semibold">{errors.companyName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              name="contactName"
                              value={formData.contactName}
                              onChange={handleChange}
                              placeholder="e.g. John Doe"
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.contactName
                                  ? "border-red-300 focus:ring-red-200"
                                  : "border-slate-200 focus:ring-brand-blue/20 focus:border-brand-blue"
                              }`}
                            />
                          </div>
                          {errors.contactName && (
                            <p className="mt-1 text-[11px] text-red-600 font-semibold">{errors.contactName}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email *</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="e.g. john@acmelabs.com"
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.email
                                  ? "border-red-300 focus:ring-red-200"
                                  : "border-slate-200 focus:ring-brand-blue/20 focus:border-brand-blue"
                              }`}
                            />
                          </div>
                          {errors.email && (
                            <p className="mt-1 text-[11px] text-red-600 font-semibold">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="e.g. +254 712 345 678"
                              className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                                errors.phone
                                  ? "border-red-300 focus:ring-red-200"
                                  : "border-slate-200 focus:ring-brand-blue/20 focus:border-brand-blue"
                              }`}
                            />
                          </div>
                          {errors.phone && (
                            <p className="mt-1 text-[11px] text-red-600 font-semibold">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL (Optional)</label>
                          <div className="relative">
                            <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              name="website"
                              value={formData.website}
                              onChange={handleChange}
                              placeholder="e.g. www.acmelabs.com"
                              className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Partnership Category *</label>
                          <div className="relative">
                            <select
                              name="partnershipType"
                              value={formData.partnershipType}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 appearance-none transition-all ${
                                errors.partnershipType
                                  ? "border-red-300 focus:ring-red-200"
                                  : "border-slate-200 focus:ring-brand-blue/20 focus:border-brand-blue"
                              }`}
                            >
                              <option value="">Select category...</option>
                              {categories.map((c) => (
                                <option key={c.value} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3.5 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent" />
                          </div>
                          {errors.partnershipType && (
                            <p className="mt-1 text-[11px] text-red-600 font-semibold">{errors.partnershipType}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Partnership Proposal Description *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Describe the scope of work, technical alignment, and integration objectives..."
                          className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            errors.message
                              ? "border-red-300 focus:ring-red-200"
                              : "border-slate-200 focus:ring-brand-blue/20 focus:border-brand-blue"
                          }`}
                        />
                        {errors.message ? (
                          <p className="mt-1 text-[11px] text-red-600 font-semibold">{errors.message}</p>
                        ) : (
                          <p className="mt-1 text-[10px] text-slate-400">Describe the project scope and how YagwaTech can cooperate.</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#0B3D91] hover:bg-[#07255A] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Queuing request...
                          </>
                        ) : (
                          <>
                            Submit Proposal Request <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
