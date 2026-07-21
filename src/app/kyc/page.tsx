"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import PersonaKYC from "@/components/PersonaKYC";
import { 
  ShieldCheck, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw 
} from "lucide-react";

export default function KYCVerificationPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-55">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0B3D91] rounded-full animate-spin" />
      </div>
    }>
      <KYCVerificationContent />
    </React.Suspense>
  );
}

function KYCVerificationContent() {
  const [email, setEmail] = useState("");
  const [activeEmail, setActiveEmail] = useState("");
  const [currentStatus, setCurrentStatus] = useState<string>("Not Started");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      const trimmed = emailParam.trim();
      setEmail(trimmed);
      setActiveEmail(trimmed);
      setIsVerifying(true);
      checkKYCStatus(trimmed);
    }
  }, [searchParams]);

  const checkKYCStatus = async (targetEmail: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/kyc/status?email=${encodeURIComponent(targetEmail)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setCurrentStatus(data.status);
      }
    } catch (e) {
      console.error("Failed to fetch KYC status:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setActiveEmail(email.trim());
    setIsVerifying(true);
    checkKYCStatus(email.trim());
  };

  const handleSuccess = async (inquiryId: string) => {
    setCurrentStatus("Verified");
    setIsVerifying(false);
    try {
      await fetch("/api/kyc/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: activeEmail, status: "Verified" }),
      });
    } catch (e) {
      console.error("Failed to update KYC status on success:", e);
    }
  };

  const handleFailed = async (inquiryId: string) => {
    setCurrentStatus("Failed");
    setIsVerifying(false);
    try {
      await fetch("/api/kyc/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: activeEmail, status: "Failed" }),
      });
    } catch (e) {
      console.error("Failed to update KYC status on failure:", e);
    }
  };

  const handleReset = () => {
    setEmail("");
    setActiveEmail("");
    setCurrentStatus("Not Started");
    setIsVerifying(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07255A] via-[#0B3D91] to-[#1A56C4] text-white py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F47B20]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="container-wrap relative z-10 w-full">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Identity Verification" },
            ]}
          />
          <div className="mt-8 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#F47B20] tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Persona KYC System
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Identity Verification Hub
            </h1>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              Verify your identity securely with Persona. KYC validation is required for corporate onboarding, compliance standards, and project integrations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container-wrap mt-10">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Input Email to check/start */}
          {!isVerifying && currentStatus !== "Verified" && currentStatus !== "Failed" && (
            <AnimatedSection type="fade" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-blue" />
                Initiate Identity Check
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the email address associated with your partner application or contract to check status or begin.
              </p>

              <form onSubmit={handleStartVerification} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. partner@company.com"
                      className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0B3D91] hover:bg-[#07255A] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Checking records...
                    </>
                  ) : (
                    <>
                      Start Verification <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </AnimatedSection>
          )}

          {/* Step 2: Verification In Progress */}
          {isVerifying && (
            <div className="space-y-6">
              {/* Info panel */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Verifying Identity for:</p>
                  <p className="text-sm font-bold text-slate-800">{activeEmail}</p>
                </div>
                <button
                  onClick={() => checkKYCStatus(activeEmail)}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Check Status
                </button>
              </div>

              {/* Persona KYC Widget */}
              <PersonaKYC
                referenceId={activeEmail}
                onSuccess={handleSuccess}
                onFailed={handleFailed}
              />

              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-semibold"
                >
                  Cancel and start over
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {currentStatus === "Verified" && (
            <AnimatedSection type="scale" className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Fully Verified!</h2>
              <p className="mt-3 text-slate-600 text-sm max-w-md leading-relaxed">
                Thank you. Your identity has been successfully authenticated by Persona KYC compliance checks. Your partner onboarding or project initiation is now unlocked.
              </p>

              <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left w-full text-xs space-y-2 text-slate-700">
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="font-semibold text-slate-500">Subject Account:</span>
                  <span className="font-bold text-slate-800">{activeEmail || email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                  <span className="font-semibold text-slate-500">Compliance Code:</span>
                  <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-brand-blue">PASSED_PERSONA_KYC</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-semibold text-slate-500">Timestamp:</span>
                  <span className="text-slate-500">{new Date().toLocaleString("en-KE")}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-8 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Verify another account
              </button>
            </AnimatedSection>
          )}

          {/* Failed State */}
          {currentStatus === "Failed" && (
            <AnimatedSection type="scale" className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/25 mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verification Declined</h2>
              <p className="mt-3 text-slate-600 text-sm max-w-md leading-relaxed">
                We were unable to verify your identity. This can happen if the provided documents are blurry, expired, or mismatch candidate information.
              </p>

              <div className="mt-6 p-4 bg-red-50/50 border border-red-100 rounded-2xl text-left w-full text-xs text-red-800">
                <p className="font-bold">Next Steps:</p>
                <ul className="list-disc pl-4 mt-1.5 space-y-1">
                  <li>Ensure you are in a well-lit room for face match scanning.</li>
                  <li>Use a clear, unexpired passport or national ID card.</li>
                  <li>Contact our onboarding support desk if issues persist.</li>
                </ul>
              </div>

              <button
                onClick={handleReset}
                className="mt-8 px-6 py-3 bg-[#0B3D91] hover:bg-[#07255A] text-white font-semibold rounded-xl text-xs transition-all shadow-md"
              >
                Try Again
              </button>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  );
}
