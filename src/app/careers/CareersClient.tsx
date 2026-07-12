"use client";

import { useState, useRef, useCallback } from "react";
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
  Upload,
  FileText,
  Brain,
  Mic,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Target,
  Zap,
  RefreshCw,
  ChevronRight,
  MessageSquare,
  Star,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { jobPositions, type JobPosition } from "@/lib/jobs";

// ── Types ─────────────────────────────────────────────────────────────────

interface ResumeAnalysis {
  score: number;
  badge: "Ready" | "Nearly Ready" | "Needs Work";
  summary: string;
  strengths: string[];
  improvements: string[];
  matchedRoles: string[];
  matchReason: string;
}

interface InterviewQuestion {
  id: number;
  question: string;
  type: "behavioral" | "technical" | "situational";
}

interface AnswerFeedback {
  answerIndex: number;
  score: number;
  highlight: string;
  suggestion: string;
}

interface InterviewFeedback {
  overallScore: number;
  overallBadge: "Excellent" | "Good" | "Fair" | "Needs Improvement";
  overallFeedback: string;
  answerFeedback: AnswerFeedback[];
  topTips: string[];
  readyToApply: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────

const categories: ("All" | "Development" | "Design" | "Systems")[] = [
  "All",
  "Development",
  "Design",
  "Systems",
];

const perks = [
  {
    Icon: HeartHandshake,
    title: "Premium Health Cover",
    description:
      "Full outpatient & inpatient medical cover for you and your direct dependents, including dental and optical care.",
  },
  {
    Icon: Laptop,
    title: "Top-Tier Hardware",
    description:
      "Get equipped with premium developer and designer hardware (MacBook Pro or ThinkPad setups) along with 4K monitors.",
  },
  {
    Icon: Clock,
    title: "Flexible Hybrid Setup",
    description:
      "Work remote 3 days a week. We focus on results and output, not desk hours or micro-management.",
  },
  {
    Icon: BookOpen,
    title: "Continuous Learning",
    description:
      "Enjoy an annual training budget to purchase courses, technical books, attend conferences, or get certified.",
  },
  {
    Icon: ShieldCheck,
    title: "Wellness & Life Cover",
    description:
      "Group life insurance policy and dedicated wellness programs because your peace of mind is vital to us.",
  },
  {
    Icon: Sparkles,
    title: "Modern Offices",
    description:
      "Collaborate and brainstorm in our bright, modern creative workspace in Karen, Nairobi, with loaded snacks and coffee.",
  },
];

const QUESTION_TYPE_COLORS: Record<InterviewQuestion["type"], string> = {
  behavioral: "bg-purple-100 text-purple-700",
  technical: "bg-brand-blue/10 text-brand-blue",
  situational: "bg-orange-100 text-orange-700",
};

// ── Score Ring Component ───────────────────────────────────────────────────

function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#22c55e" : score >= 55 ? "#f97316" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EEF1F7"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-ink-900 leading-none">
          {score}
        </span>
        <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mt-0.5">
          Score
        </span>
      </div>
    </div>
  );
}

// ── Badge Component ────────────────────────────────────────────────────────

function ReadinessBadge({
  badge,
}: {
  badge: ResumeAnalysis["badge"] | InterviewFeedback["overallBadge"];
}) {
  const styles: Record<string, string> = {
    Ready: "bg-green-100 text-green-700 border-green-200",
    "Nearly Ready": "bg-orange-100 text-orange-700 border-orange-200",
    "Needs Work": "bg-red-100 text-red-700 border-red-200",
    Excellent: "bg-green-100 text-green-700 border-green-200",
    Good: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
    Fair: "bg-orange-100 text-orange-700 border-orange-200",
    "Needs Improvement": "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${styles[badge] ?? "bg-ink-50 text-ink-400 border-ink-100"}`}
    >
      <Star className="h-3 w-3" />
      {badge}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function CareersClient() {
  // Job listing state
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Development" | "Design" | "Systems"
  >("All");
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [activeApplyJob, setActiveApplyJob] = useState<JobPosition | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    intro: "",
  });
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // ── Resume Analysis state ─────────────────────────────────────────────
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeStatus, setResumeStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Mock Interview state ──────────────────────────────────────────────
  const [interviewJobId, setInterviewJobId] = useState<string>("general");
  const [interviewPhase, setInterviewPhase] = useState<
    "setup" | "loading-q" | "answering" | "loading-fb" | "results"
  >("setup");
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState<InterviewFeedback | null>(null);
  const [interviewError, setInterviewError] = useState("");
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // ── Job listing handlers ──────────────────────────────────────────────

  const filteredJobs = jobPositions.filter(
    (job) => selectedCategory === "All" || job.category === selectedCategory
  );

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleApplyClick = (job: JobPosition) => {
    setActiveApplyJob(job);
    setFormData({ name: "", email: "", phone: "", linkedin: "", portfolio: "", intro: "" });
    setSubmitStatus("idle");
    setErrorMessage("");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      if (!res.ok) throw new Error(result.error || "Failed to submit application");
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  // ── Resume Analysis handlers ──────────────────────────────────────────

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  }, []);

  const validateAndSetFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setResumeError("Only PDF files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File must be under 5MB.");
      return;
    }
    setResumeError("");
    setResumeFile(file);
    setResumeStatus("idle");
    setResumeAnalysis(null);
  };

  const handleResumeAnalysis = async () => {
    if (!resumeFile) return;
    setResumeStatus("uploading");
    setResumeError("");
    const fd = new FormData();
    fd.append("resume", resumeFile);
    try {
      const res = await fetch("/api/careers/analyze-resume", {
        method: "POST",
        body: fd,
      });
      
      if (!res.ok) {
        let errorMsg = "Analysis failed";
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {
          errorMsg = `Server error (${res.status}): ${res.statusText || "Internal Server Error"}`;
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      setResumeAnalysis(data.analysis);
      setResumeStatus("success");
    } catch (err) {
      setResumeStatus("error");
      setResumeError(
        err instanceof Error ? err.message : "Analysis failed. Please try again."
      );
    }
  };

  const resetResume = () => {
    setResumeFile(null);
    setResumeStatus("idle");
    setResumeAnalysis(null);
    setResumeError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Mock Interview handlers ───────────────────────────────────────────

  const startInterview = async () => {
    setShowInterviewModal(true);
    setInterviewPhase("loading-q");
    setInterviewError("");
    setAnswers([]);
    setCurrentAnswer("");
    setCurrentQuestionIdx(0);
    setInterviewFeedback(null);

    try {
      const res = await fetch("/api/careers/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: interviewJobId, stage: "questions" }),
      });
      if (!res.ok) {
        let errorMsg = "Failed to generate questions";
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {
          errorMsg = `Server error (${res.status}): ${res.statusText || "Internal Server Error"}`;
        }
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setInterviewQuestions(data.questions);
      setInterviewPhase("answering");
    } catch (err) {
      setInterviewError(
        err instanceof Error ? err.message : "Could not start interview. Try again."
      );
      setInterviewPhase("setup");
    }
  };

  const handleNextAnswer = async () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = [...answers, currentAnswer.trim()];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIdx < interviewQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // All answered — get feedback
      setInterviewPhase("loading-fb");
      try {
        const res = await fetch("/api/careers/mock-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: interviewJobId,
            stage: "feedback",
            answers: newAnswers,
          }),
        });
        if (!res.ok) {
          let errorMsg = "Failed to evaluate answers";
          try {
            const data = await res.json();
            errorMsg = data.error || errorMsg;
          } catch {
            errorMsg = `Server error (${res.status}): ${res.statusText || "Internal Server Error"}`;
          }
          throw new Error(errorMsg);
        }
        const data = await res.json();
        setInterviewFeedback(data);
        setInterviewPhase("results");
      } catch (err) {
        setInterviewError(
          err instanceof Error ? err.message : "Evaluation failed. Please try again."
        );
        setInterviewPhase("setup");
      }
    }
  };

  const closeInterview = () => {
    setShowInterviewModal(false);
    setInterviewPhase("setup");
    setInterviewQuestions([]);
    setAnswers([]);
    setCurrentAnswer("");
    setCurrentQuestionIdx(0);
    setInterviewFeedback(null);
    setInterviewError("");
  };

  const interviewJobLabel =
    interviewJobId === "general"
      ? "General Tech Role"
      : jobPositions.find((j) => j.id === interviewJobId)?.title ?? "General Tech Role";

  return (
    <>
      <PageHero
        eyebrow="Join our team"
        title="Build the future of digital solutions with us"
        description="We are looking for builders, designers, and problem solvers in Nairobi who want to deliver high-quality technology solutions across Kenya."
        breadcrumbs={[{ label: "Careers", href: "/careers" }]}
      />

      {/* ── Open Positions Section ───────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white" id="open-positions">
        <div className="container-wrap">
          <div className="text-center max-w-xl mx-auto mb-12">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-ink-900">Explore Open Roles</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                Find an opportunity that matches your skills and ambitions. Filter
                positions by category below.
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
                    <div
                      className={`rounded-xl border transition-all duration-300 ${
                        isExpanded
                          ? "border-brand-blue bg-ink-50/20 shadow-md"
                          : "border-black/5 bg-white hover:border-black/10 hover:shadow-sm"
                      }`}
                    >
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
                              <MapPin className="h-3.5 w-3.5 text-brand-orange" />{" "}
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-brand-orange" />{" "}
                              {job.type}
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
                          <div className="rounded-full bg-ink-50 p-2 text-ink-400 transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-6 pb-8 sm:px-8 border-t border-black/5 pt-6 space-y-6">
                          <div className="text-sm leading-relaxed text-ink-400">
                            <p>{job.description}</p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3">
                                Key Responsibilities
                              </h4>
                              <ul className="space-y-2">
                                {job.responsibilities.map((resp, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-ink-400 leading-relaxed flex items-start gap-2"
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange mt-2 shrink-0" />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3">
                                Minimum Requirements
                              </h4>
                              <ul className="space-y-2">
                                {job.requirements.map((req, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-ink-400 leading-relaxed flex items-start gap-2"
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="pt-2">
                            <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3">
                              What we offer
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.benefits.map((ben, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-ink-50 px-3 py-1.5 text-xs text-ink-400 font-medium"
                                >
                                  ✓ {ben}
                                </span>
                              ))}
                            </div>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-2 pt-2 text-xs text-ink-400">
                              <Coins className="h-4 w-4 text-brand-orange" />
                              <span>
                                <strong>Salary:</strong> {job.salary}
                              </span>
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
                <p className="text-sm text-ink-400">
                  No open positions found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── AI Careers Suite Banners ───────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-ink-50/20">
        <div className="container-wrap">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-1.5 text-xs font-semibold text-brand-blue mb-5">
                <Brain className="h-3.5 w-3.5 text-brand-orange" />
                AI Career Suite
              </div>
              <h2 className="text-3xl font-bold text-ink-900">Elevate Your Career Readiness</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                Leverage our Google Gemini powered tools to audit your resume suitability or go through interactive mock interviews for our open roles.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Resume Auditor CTA Card */}
            <AnimatedSection type="scale">
              <div className="group h-full relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between p-8 text-white"
                style={{
                  background: "linear-gradient(135deg, #0B3D91 0%, #1556C6 100%)",
                }}
              >
                {/* Background glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/0 via-brand-orange/0 to-brand-orange/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-brand-orange border border-white/10">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">AI Resume & Readiness Auditor</h3>
                  <p className="text-xs text-white/85 leading-relaxed">
                    Upload your PDF resume to receive an instant readiness score, highlighted strengths, key improvement areas, and recommended Yagwa Tech positions.
                  </p>
                </div>
                
                <div className="relative z-10 pt-8 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-white/60">Takes 60 seconds</span>
                  <button
                    onClick={() => {
                      setShowResumeModal(true);
                      resetResume();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-orangeLight transition-all shadow-md"
                  >
                    Analyze Resume <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </AnimatedSection>

            {/* Practice Interview CTA Card */}
            <AnimatedSection type="scale">
              <div className="group h-full relative rounded-2xl bg-white border border-black/5 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between p-8">
                {/* Background glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/0 via-brand-blue/0 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue border border-brand-blue/10">
                    <Mic className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-ink-900">AI-Powered Practice Interviews</h3>
                  <p className="text-xs text-ink-400 leading-relaxed">
                    Choose any open role at Yagwa Tech and undergo a dynamic 5-question mock interview. Receive instant evaluation and constructive guidance on your answers.
                  </p>
                </div>

                <div className="relative z-10 pt-8 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-ink-400">5 Dynamic Questions</span>
                  <button
                    onClick={() => {
                      setShowInterviewModal(true);
                      setInterviewPhase("setup");
                      setInterviewJobId("general");
                      setInterviewError("");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-blueLight transition-all shadow-md"
                  >
                    Start Practice <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Resume Auditor Modal ──────────────────────────────────────────────── */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-black/5 bg-gradient-to-r from-[#0B3D91] to-[#1556C6] flex items-center justify-between shrink-0">
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                  AI Careers Hub
                </p>
                <h3 className="text-sm font-bold text-white leading-tight mt-0.5">
                  AI Resume & Readiness Auditor
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowResumeModal(false);
                  resetResume();
                }}
                className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {resumeStatus !== "success" ? (
                <div className="space-y-6">
                  <p className="text-xs text-ink-500 leading-relaxed">
                    Upload your resume in PDF format to receive an instant analysis of your tech capabilities, strengths, and customized role matches.
                  </p>
                  
                  {/* Upload Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? "border-brand-orange bg-brand-orange/5 scale-[1.01]"
                        : resumeFile
                        ? "border-green-500 bg-green-50"
                        : "border-black/10 hover:border-brand-blue/30 hover:bg-ink-50/30"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) validateAndSetFile(f);
                      }}
                    />

                    {resumeFile ? (
                      <div className="space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900 text-sm">{resumeFile.name}</p>
                          <p className="text-xs text-ink-400 mt-1">
                            {(resumeFile.size / 1024).toFixed(0)} KB — PDF ready to analyze
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resetResume();
                          }}
                          className="text-xs text-brand-orange hover:text-brand-orangeLight underline transition-colors"
                        >
                          Remove & choose another
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 text-ink-400">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900 text-sm">
                            {isDragging
                              ? "Drop your resume here"
                              : "Drag & drop your resume, or click to browse"}
                          </p>
                          <p className="text-xs text-ink-400 mt-1">
                            PDF only · Max 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {resumeError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      {resumeError}
                    </div>
                  )}

                  {/* Analyze Button */}
                  <button
                    onClick={handleResumeAnalysis}
                    disabled={!resumeFile || resumeStatus === "uploading"}
                    className={`w-full flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold transition-all ${
                      !resumeFile || resumeStatus === "uploading"
                        ? "bg-ink-100 text-ink-400 cursor-not-allowed"
                        : "bg-brand-orange text-white hover:bg-brand-orangeLight shadow-lg shadow-brand-orange/30 hover:scale-[1.01]"
                    }`}
                  >
                    {resumeStatus === "uploading" ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Analyzing your resume…
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        Analyze My Readiness
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              ) : resumeAnalysis ? (
                /* Analysis Results inside Modal */
                <div className="space-y-6">
                  {/* Results Header */}
                  <div className="bg-ink-50/50 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-black/5">
                    <ScoreRing score={resumeAnalysis.score} size={100} strokeWidth={9} />
                    <div className="text-center sm:text-left flex-1">
                      <ReadinessBadge badge={resumeAnalysis.badge} />
                      <p className="mt-3 text-xs leading-relaxed text-ink-500">
                        {resumeAnalysis.summary}
                      </p>
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-black/5 p-5 bg-white">
                      <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
                      </h4>
                      <ul className="space-y-2">
                        {resumeAnalysis.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-ink-500 leading-relaxed">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-black/5 p-5 bg-white">
                      <h4 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5" /> Improvement Areas
                      </h4>
                      <ul className="space-y-2">
                        {resumeAnalysis.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-ink-500 leading-relaxed">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Role Match */}
                  {resumeAnalysis.matchedRoles.length > 0 && (
                    <div className="rounded-xl border border-brand-blue/15 bg-brand-blue/5 p-5">
                      <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5" /> Best Role Match
                      </h4>
                      <p className="text-xs text-ink-500 leading-relaxed mb-4">
                        {resumeAnalysis.matchReason}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {resumeAnalysis.matchedRoles.map((roleId) => {
                          const job = jobPositions.find((j) => j.id === roleId);
                          if (!job) return null;
                          return (
                            <button
                              key={roleId}
                              onClick={() => {
                                setShowResumeModal(false);
                                handleApplyClick(job);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2 text-xs font-bold text-white hover:bg-brand-orangeLight transition-all shadow-md hover:scale-[1.02]"
                            >
                              Apply: {job.title.split("(")[0].trim()}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            {resumeStatus === "success" && (
              <div className="shrink-0 border-t border-black/5 bg-ink-50/50 px-6 py-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setShowResumeModal(false);
                    resetResume();
                  }}
                  className="text-xs font-semibold text-ink-400 hover:text-ink-900 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={resetResume}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-4 py-2 text-xs font-semibold text-ink-600 hover:bg-white transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Analyze another resume
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Interview Modal ──────────────────────────────────────────────────── */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-black/5 bg-gradient-to-r from-brand-blueDark to-brand-blue flex items-center justify-between shrink-0">
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                  AI Mock Interview
                </p>
                <h3 className="text-sm font-bold text-white leading-tight mt-0.5">
                  {interviewJobLabel}
                </h3>
              </div>
              <button
                onClick={closeInterview}
                className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Setup Phase */}
              {interviewPhase === "setup" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
                      Select which role you are practicing for:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { id: "general", label: "General Tech Role", sub: "Mix of all disciplines" },
                        ...jobPositions.map((j) => ({
                          id: j.id,
                          label: j.title.split("(")[0].trim(),
                          sub: j.type,
                        })),
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setInterviewJobId(opt.id)}
                          className={`text-left rounded-xl border p-4 transition-all ${
                            interviewJobId === opt.id
                              ? "border-brand-blue bg-brand-blue/5 shadow-sm"
                              : "border-black/5 hover:border-black/15 hover:bg-ink-50/50"
                          }`}
                        >
                          <p
                            className={`text-sm font-bold leading-tight ${
                              interviewJobId === opt.id ? "text-brand-blue" : "text-ink-900"
                            }`}
                          >
                            {opt.label}
                          </p>
                          <p className="text-xs text-ink-400 mt-0.5">{opt.sub}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">Ready to start?</p>
                      <p className="text-xs text-ink-400 mt-1">
                        5 AI-tailored questions · Instant feedback · Takes ~10 minutes
                      </p>
                    </div>
                    <button
                      onClick={startInterview}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-7 py-3 text-sm font-bold text-white hover:bg-brand-blueLight transition-all shadow-md"
                    >
                      <Mic className="h-4 w-4" />
                      Begin Interview
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Questions */}
              {interviewPhase === "loading-q" && (
                <div className="py-16 flex flex-col items-center gap-4 text-center">
                  <div className="h-14 w-14 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <Brain className="h-7 w-7 text-brand-blue animate-pulse" />
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">Generating your questions…</p>
                    <p className="text-xs text-ink-400 mt-1">
                      AI is crafting 5 tailored questions for you
                    </p>
                  </div>
                </div>
              )}

              {/* Answering Phase */}
              {interviewPhase === "answering" && interviewQuestions.length > 0 && (
                <div className="space-y-6">
                  {/* Progress dots */}
                  <div className="flex items-center justify-center gap-2">
                    {interviewQuestions.map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-full transition-all ${
                          i < currentQuestionIdx
                            ? "h-2 w-2 bg-green-500"
                            : i === currentQuestionIdx
                            ? "h-2.5 w-2.5 bg-brand-blue"
                            : "h-2 w-2 bg-ink-100"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Question number */}
                  <p className="text-center text-xs font-semibold text-ink-400">
                    Question {currentQuestionIdx + 1} of {interviewQuestions.length}
                  </p>

                  {/* Question card */}
                  <div className="rounded-xl bg-ink-50 border border-black/5 p-5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider mb-3 ${QUESTION_TYPE_COLORS[interviewQuestions[currentQuestionIdx].type]}`}
                    >
                      {interviewQuestions[currentQuestionIdx].type}
                    </span>
                    <p className="text-base font-semibold text-ink-900 leading-snug">
                      {interviewQuestions[currentQuestionIdx].question}
                    </p>
                  </div>

                  {/* Answer box */}
                  <div>
                    <label className="block text-[11px] font-bold text-ink-400 uppercase tracking-wider mb-2">
                      Your Answer
                    </label>
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      rows={6}
                      placeholder="Type your answer here… be as detailed as you like."
                      className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm text-ink-900 focus:outline-none focus:border-brand-blue resize-none leading-relaxed placeholder:text-ink-300"
                    />
                    <p className="mt-1 text-right text-[11px] text-ink-400">
                      {currentAnswer.length} characters
                    </p>
                  </div>
                </div>
              )}

              {/* Loading Feedback */}
              {interviewPhase === "loading-fb" && (
                <div className="py-16 flex flex-col items-center gap-4 text-center">
                  <div className="h-14 w-14 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <Brain className="h-7 w-7 text-brand-orange animate-pulse" />
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">Evaluating your answers…</p>
                    <p className="text-xs text-ink-400 mt-1">
                      AI is reviewing all 5 responses
                    </p>
                  </div>
                </div>
              )}

              {/* Results Phase */}
              {interviewPhase === "results" && interviewFeedback && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="rounded-xl bg-gradient-to-br from-brand-blueDark to-brand-blue p-6 flex flex-col sm:flex-row items-center gap-5 text-white">
                    <ScoreRing score={interviewFeedback.overallScore} size={100} strokeWidth={9} />
                    <div className="text-center sm:text-left">
                      <ReadinessBadge badge={interviewFeedback.overallBadge} />
                      <p className="mt-2 text-sm leading-relaxed text-white/80">
                        {interviewFeedback.overallFeedback}
                      </p>
                    </div>
                  </div>

                  {/* Per-answer feedback */}
                  <div>
                    <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3">
                      Answer-by-Answer Breakdown
                    </h4>
                    <div className="space-y-3">
                      {interviewFeedback.answerFeedback.map((fb, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-black/5 bg-ink-50/50 p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-ink-900">
                              Q{i + 1}:{" "}
                              <span className="font-normal text-ink-500">
                                {interviewQuestions[i]?.question.slice(0, 60)}…
                              </span>
                            </span>
                            <span
                              className={`text-xs font-extrabold ${
                                fb.score >= 70
                                  ? "text-green-600"
                                  : fb.score >= 50
                                  ? "text-orange-600"
                                  : "text-red-600"
                              }`}
                            >
                              {fb.score}/100
                            </span>
                          </div>
                          <p className="text-[11px] text-green-700 flex items-start gap-1.5 mb-1">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            {fb.highlight}
                          </p>
                          <p className="text-[11px] text-orange-700 flex items-start gap-1.5">
                            <Target className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            {fb.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Tips */}
                  <div className="rounded-xl border border-brand-blue/15 bg-brand-blue/5 p-5">
                    <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5" /> Top Tips For You
                    </h4>
                    <ul className="space-y-2">
                      {interviewFeedback.topTips.map((tip, i) => (
                        <li
                          key={i}
                          className="text-xs text-ink-600 flex items-start gap-2 leading-relaxed"
                        >
                          <span className="font-bold text-brand-blue shrink-0">{i + 1}.</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA — apply if ready */}
                  {interviewFeedback.readyToApply && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                      <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-green-800">
                        You&apos;re ready to apply!
                      </p>
                      <p className="text-xs text-green-700 mt-1 mb-4">
                        Your interview performance shows you&apos;re a strong candidate.
                      </p>
                      <button
                        onClick={() => {
                          closeInterview();
                          const job = jobPositions.find((j) => j.id === interviewJobId);
                          if (job) handleApplyClick(job);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-green-700 transition-all"
                      >
                        Apply for this role <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer — shown during answering phase */}
            {interviewPhase === "answering" && (
              <div className="shrink-0 border-t border-black/5 bg-ink-50/50 px-6 py-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    if (currentQuestionIdx > 0) {
                      setCurrentQuestionIdx(currentQuestionIdx - 1);
                      setCurrentAnswer("");
                    }
                  }}
                  disabled={currentQuestionIdx === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-4 py-2 text-xs font-semibold text-ink-400 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <button
                  onClick={handleNextAnswer}
                  disabled={!currentAnswer.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-blueLight disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {currentQuestionIdx === interviewQuestions.length - 1 ? (
                    <>
                      Finish & Get Feedback <Trophy className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      Next Question <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results footer */}
            {interviewPhase === "results" && (
              <div className="shrink-0 border-t border-black/5 bg-ink-50/50 px-6 py-4 flex items-center justify-between gap-3">
                <button
                  onClick={closeInterview}
                  className="text-xs font-semibold text-ink-400 hover:text-ink-900 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setInterviewPhase("setup");
                    closeInterview();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-4 py-2 text-xs font-semibold text-ink-600 hover:bg-white transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Practice Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Perks & Benefits Section ─────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container-wrap">
          <div className="text-center max-w-xl mx-auto mb-16">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-ink-900">Life at Yagwa Tech</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
                We believe high performance comes from high trust, deep support, and
                empowering environments. Here are a few perks you&apos;ll enjoy with us.
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
      <section className="py-20 bg-ink-50/40">
        <div className="container-wrap text-center max-w-2xl mx-auto">
          <AnimatedSection>
            <div className="rounded-full bg-brand-orange/10 p-4 inline-block text-brand-orange mb-6">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900">Don&apos;t see a role that fits?</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-400">
              We are always on the lookout for talented engineers, designers, project
              managers, and digital marketers. If you are passionate about what you do,
              send us an open speculative application and let us know how you can make a
              difference. You can also send your CV and portfolio directly to{" "}
              <a
                href="mailto:careers@yagwatech.com"
                className="text-brand-blue font-semibold hover:underline"
              >
                careers@yagwatech.com
              </a>
              .
            </p>
            <button
              onClick={() =>
                handleApplyClick({
                  id: "general-app",
                  title: "Open Speculative Application",
                  category: "Development",
                  location: "Nairobi, Kenya",
                  type: "Full-time / Part-time",
                  description: "Submit an open application for future job openings.",
                  responsibilities: [],
                  requirements: [],
                  benefits: [],
                })
              }
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
            <div className="px-6 py-4 border-b border-black/5 bg-ink-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">
                  Apply for Position
                </span>
                <h3 className="text-base font-bold text-ink-900 leading-tight mt-0.5">
                  {activeApplyJob.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveApplyJob(null)}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {submitStatus === "success" ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto text-green-500 rounded-full bg-green-50 p-4 inline-block">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h4 className="text-lg font-bold text-ink-900">Application Submitted!</h4>
                  <p className="text-xs text-ink-400 leading-relaxed max-w-sm mx-auto">
                    Thank you for applying, {formData.name}. We&apos;ve received your
                    application and sent a confirmation to{" "}
                    <strong>{formData.email}</strong>. Our recruiting team will review
                    your profile shortly!
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
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">
                        Full Name *
                      </label>
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
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">
                        Email Address *
                      </label>
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
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">
                        Phone Number *
                      </label>
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
                    <div>
                      <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">
                        LinkedIn Profile Link
                      </label>
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

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">
                      Portfolio / GitHub / Resume Link
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleFormChange}
                      placeholder="https://github.com/username or Drive link to PDF resume"
                      className="w-full rounded-md border border-black/10 px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">
                      Tell us about yourself * (Min 20 chars)
                    </label>
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
