"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, AlertTriangle, HelpCircle } from "lucide-react";

interface PersonaKYCProps {
  referenceId: string; // Partner/Client Email or Account ID
  onSuccess?: (inquiryId: string) => void;
  onFailed?: (inquiryId: string) => void;
}

export default function PersonaKYC({ referenceId, onSuccess, onFailed }: PersonaKYCProps) {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [isSandbox, setIsSandbox] = useState(true);
  const [inquiryId] = useState(() => `inq_${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    const tid = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
    if (tid) {
      setTemplateId(tid);
      setIsSandbox(false);
    }
  }, []);

  const handleSimulateVerification = async (approved: boolean) => {
    console.log(`[Persona KYC Sandbox] Simulating verification: ${approved ? "APPROVED" : "FAILED"} for ref: ${referenceId}`);
    
    try {
      // Fire post request to our KYC webhook backend to simulate the Persona Webhook!
      const res = await fetch("/api/kyc/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: approved ? "inquiry.approved" : "inquiry.failed",
          payload: {
            id: inquiryId,
            referenceId: referenceId,
            status: approved ? "approved" : "failed",
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (approved && onSuccess) onSuccess(inquiryId);
        if (!approved && onFailed) onFailed(inquiryId);
        alert(`Verification simulated: ${approved ? "APPROVED" : "FAILED"}. Sync complete!`);
      } else {
        alert(`Failed to simulate webhook: ${data.error}`);
      }
    } catch (e) {
      console.error("KYC simulation call error:", e);
      alert("Error sending mock webhook event.");
    }
  };

  // ── Render Live Persona Iframe ──
  if (!isSandbox && templateId) {
    const personaUrl = `https://withpersona.com/iframe?inquiry-template-id=${templateId}&client-reference-id=${encodeURIComponent(
      referenceId
    )}&environment=sandbox`;

    return (
      <div className="w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-[#07255A] px-6 py-4 flex items-center gap-2 text-white">
          <ShieldCheck className="w-5 h-5 text-brand-orange" />
          <span className="text-sm font-semibold">Secure Identity Verification</span>
        </div>
        <div className="aspect-[4/3] w-full">
          <iframe
            src={personaUrl}
            allow="camera; microphone"
            className="w-full h-full border-0"
            title="Persona Identity Verification"
          />
        </div>
      </div>
    );
  }

  // ── Render Breathtaking Interactive Sandbox Simulator ──
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
      <div className="bg-gradient-to-r from-amber-500 to-brand-orange px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">KYC Sandbox Simulator</span>
        </div>
        <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
          No Keys Set
        </span>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-3 text-slate-700">
          <HelpCircle className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-slate-800">Persona KYC Demo Simulator</p>
            <p className="mt-1">
              Because `NEXT_PUBLIC_PERSONA_TEMPLATE_ID` is not defined in your environment variables, the system is showing this interactive sandbox.
            </p>
            <p className="mt-1 font-semibold text-brand-blue">
              Target Profile: {referenceId}
            </p>
          </div>
        </div>

        <div className="border border-slate-100 rounded-2xl p-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-center">
            Simulate Persona Webhook Actions
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSimulateVerification(true)}
              className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition-all group hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-800">Verify Account</span>
              <span className="text-[9px] text-emerald-600 mt-1">Status: Approved</span>
            </button>

            <button
              onClick={() => handleSimulateVerification(false)}
              className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl transition-all group hover:scale-[1.01]"
            >
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center mb-2 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-red-800">Decline Account</span>
              <span className="text-[9px] text-red-600 mt-1">Status: Failed</span>
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400">
          Inquiry Reference: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">{inquiryId}</span>
        </div>
      </div>
    </div>
  );
}
