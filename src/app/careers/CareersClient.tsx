"use client";

import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Coins,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Laptop,
  HeartHandshake,
  BookOpen,
  ShieldCheck,
  Send,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { jobPositions, type JobPosition } from "@/lib/jobs";

// Open roles categories
const categories: ("All" | "Development" | "Design" | "Systems")[] = [
  "All",
  "Development",
  "Design",
  "Systems",
];

// Perks / Benefits listing
const perks = [
  {
    Icon: HeartHandshake,
    title: "Premium Health Cover",
    description: "Full outpatient & inpatient medical cover for you and your direct dependents, including dental and optical care.",
  },
  {
    Icon: Laptop,
    title: "Top-Tier Hardware",
    description: "Get equipped with premium developer and designer hardware (MacBook Pro or ThinkPad setups) along with 4K monitors.",
  },
  {
    Icon: Clock,
    title: "Flexible Hybrid Setup",
    description: "Work remote 3 days a week. We focus on results and output, not desk hours or micro-management.",
  },
  {
    Icon: BookOpen,
    title: "Continuous Learning",
    description: "Enjoy an annual training budget to purchase courses, technical books, attend conferences, or get certified.",
  },
  {
    Icon: ShieldCheck,
    title: "Wellness & Life Cover",
    description: "Group life insurance policy and dedicated wellness programs because your peace of mind is vital to us.",
  },
  {
    Icon: Sparkles,
    title: "Modern Offices",
    description: "Collaborate and brainstorm in our bright, modern creative workspace in Karen, Nairobi, with loaded snacks and coffee.",
  },
];

export default function CareersClient() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Development" | "Design" | "Systems">("All");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  
  // Application Form Modal State
  const [activeApplyJob, setActiveApplyJob] = useState<JobPosition | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    intro: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const filteredJobs = jobPositions.filter(
    (job) => selectedCategory === "All" || job.category === selectedCategory
  );

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleApplyClick = (job: JobPosition) => {
    setActiveApplyJob(job);
    setFormData({
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      portfolio: "",
      intro: "",
    });
    setSubmitStatus("idle");
    setErrorMessage("");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplyJob) return;

    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: activeApplyJob.id,
          jobTitle: activeApplyJob.title,
          ...formData,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setSubmitStatus("success");
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Join our team"
        title="Build the future of digital solutions with us"
        description="We are looking for builders, designers, and problem solvers in Nairobi who want to deliver high-quality technology solutions across Kenya."
        breadcrumbs={[{ label: "Careers", href: "/careers" }]}
      />

      {/* ── Open Positions Section ───────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white" id="open-positions">
        <div className="container-wrap">
          <div className="text-center max-w-xl mx-auto mb-12">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-ink-900">Explore Open Roles</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                Find an opportunity that matches your skills and ambitions. Filter positions by category below.
              </p>
            </AnimatedSection>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setExpandedJobId(null);
                }}
                className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat
                    ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                    : "bg-ink-50 text-ink-400 hover:bg-ink-100 hover:text-ink-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                return (
                  <AnimatedSection key={job.id} type="scale">
                    <div className={`rounded-xl border transition-all duration-300 ${
                      isExpanded 
                        ? "border-brand-blue bg-ink-50/20 shadow-md" 
                        : "border-black/5 bg-white hover:border-black/10 hover:shadow-sm"
                    }`}>
                      {/* Job Main Card Summary */}
                      <div 
                        onClick={() => toggleExpand(job.id)}
                        className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer select-none"
                      >
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-ink-900 group-hover:text-brand-blue transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-ink-400">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-brand-orange" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-brand-orange" /> {job.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyClick(job);
                            }}
                            className="rounded-md bg-brand-blue px-4 py-2 text-xs font-semibold text-white hover:bg-brand-blueLight transition-all"
                          >
                            Apply Now
                          </button>
                          <div className="rounded-full bg-ink-50 p-2 text-ink-400 group-hover:text-ink-900 transition-colors">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Job Detail Info */}
                      {isExpanded && (
                        <div className="px-6 pb-8 sm:px-8 border-t border-black/5 pt-6 space-y-6">
                          <div className="text-sm leading-relaxed text-ink-400">
                            <p>{job.description}</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Responsibilities */}
                            <div>
                              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3">Key Responsibilities</h4>
                              <ul className="space-y-2">
                                {job.responsibilities.map((resp, i) => (
                                  <li key={i} className="text-xs text-ink-400 leading-relaxed flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange mt-2 shrink-0" />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Requirements */}
                            <div>
                              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3">Minimum Requirements</h4>
                              <ul className="space-y-2">
                                {job.requirements.map((req, i) => (
                                  <li key={i} className="text-xs text-ink-400 leading-relaxed flex items-start gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Benefits */}
                          <div className="pt-2">
                            <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3">What we offer</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.benefits.map((ben, i) => (
                                <span key={i} className="rounded-md bg-ink-50 px-3 py-1.5 text-xs text-ink-400 font-medium">
                                  ✓ {ben}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Compensation */}
                          {job.salary && (
                            <div className="flex items-center gap-2 pt-2 text-xs text-ink-400">
                              <Coins className="h-4 w-4 text-brand-orange" />
                              <span><strong>Salary:</strong> {job.salary}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                );
              })
            ) : (
              <div className="text-center py-12 border border-dashed border-black/10 rounded-xl">
                <p className="text-sm text-ink-400">No open positions found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Perks & Benefits Section ─────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-ink-50/50">
        <div className="container-wrap">
          <div className="text-center max-w-xl mx-auto mb-16">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-ink-900">Life at Yagwa Tech</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                We believe high performance comes from high trust, deep support, and empowering environments. Here are a few perks you'll enjoy with us.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {perks.map(({ Icon, title, description }) => (
              <AnimatedSection key={title} type="scale">
                <div className="bg-white rounded-xl border border-black/5 p-6 hover:shadow-md hover:-translate-y-1 transition-all h-full">
                  <div className="rounded-lg bg-brand-blue/5 p-3 text-brand-blue inline-block">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-ink-900">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-400">{description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open speculative Application Section ────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-wrap text-center max-w-2xl mx-auto">
          <AnimatedSection>
            <div className="rounded-full bg-brand-orange/10 p-4 inline-block text-brand-orange mb-6">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900">Don't see a role that fits?</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-400">
              We are always on the lookout for talented engineers, designers, project managers, and digital marketers. If you are passionate about what you do, send us an open speculative application and let us know how you can make a difference. You can also send your CV and portfolio directly to <a href="mailto:careers@yagwatech.com" className="text-brand-blue font-semibold hover:underline">careers@yagwatech.com</a>.
            </p>
            <button
              onClick={() => handleApplyClick({
                id: "general-app",
                title: "Open Speculative Application",
                category: "Development",
                location: "Nairobi, Kenya",
                type: "Full-time / Part-time",
                description: "Submit an open application for future job openings.",
                responsibilities: [],
                requirements: [],
                benefits: []
              })}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold text-white hover:bg-brand-orangeLight transition-all"
            >
              Submit Open Application <Send className="h-4 w-4" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Job Application Modal Form ──────────────────────────────────── */}
      {activeApplyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-black/5 overflow-hidden animate-slide-down">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-black/5 bg-ink-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">Apply for Position</span>
                <h3 className="text-base font-bold text-ink-900 leading-tight mt-0.5">{activeApplyJob.title}</h3>
              </div>
              <button 
                onClick={() => setActiveApplyJob(null)} 
                className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {submitStatus === "success" ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto text-green-500 rounded-full bg-green-50 p-4 inline-block">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h4 className="text-lg font-bold text-ink-900">Application Submitted!</h4>
                  <p className="text-xs text-ink-400 leading-relaxed max-w-sm mx-auto">
                    Thank you for applying, {formData.name}. We've received your application and sent a confirmation to <strong>{formData.email}</strong>. Our recruiting team will review your profile shortly!
                  </p>
                  <button
                    onClick={() => setActiveApplyJob(null)}
                    className="mt-6 rounded-md bg-brand-blue px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-blueLight transition-all"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {submitStatus === "error" && (
                    <div className="rounded-lg bg-red-50 p-4 text-xs text-red-700 flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="John Doe"
                        className="w-full rounded-md border border-black/10 px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="johndoe@email.com"
                        className="w-full rounded-md border border-black/10 px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="+254 700 000 000"
                        className="w-full rounded-md border border-black/10 px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">LinkedIn Profile Link</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleFormChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full rounded-md border border-black/10 px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Portfolio / GitHub / Resume Link</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleFormChange}
                      placeholder="https://github.com/username or Drive link to PDF resume"
                      className="w-full rounded-md border border-black/10 px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  {/* Intro */}
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Tell us about yourself * (Min 20 chars)</label>
                    <textarea
                      name="intro"
                      required
                      rows={4}
                      value={formData.intro}
                      onChange={handleFormChange}
                      placeholder="Briefly introduce yourself, your experiences, and why you'd like to work with Yagwa Tech Solutions..."
                      className="w-full rounded-md border border-black/10 px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-brand-blue resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveApplyJob(null)}
                      className="rounded-md border border-black/10 px-4 py-2 text-xs font-semibold text-ink-400 hover:bg-ink-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitStatus === "loading"}
                      className="rounded-md bg-brand-blue px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-blueLight transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {submitStatus === "loading" ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
