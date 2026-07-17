"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface PersonaKYCProps {
  referenceId: string; // Partner/Client Email or Account ID
  onSuccess?: (inquiryId: string) => void;
  onFailed?: (inquiryId: string) => void;
}

export default function PersonaKYC({ referenceId, onSuccess, onFailed }: PersonaKYCProps) {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tid = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
    if (tid) {
      setTemplateId(tid);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full p-8 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-brand-blue rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Loading verification module...</p>
      </div>
    );
  }

  // ── Render Live Persona Iframe ──
  if (templateId) {
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

  // ── Render Verification Gateway Offline message (When environment keys are not configured yet) ──
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
      <div className="bg-[#07255A] px-6 py-4 flex items-center gap-2 text-white">
        <ShieldAlert className="w-5 h-5 text-red-500" />
        <span className="text-sm font-bold uppercase tracking-wider">Verification Service</span>
      </div>

      <div className="p-8 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2 max-w-sm mx-auto">
          <h3 className="text-sm font-bold text-slate-800">Verification Gateway Offline</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The identity verification system is currently offline or undergoing maintenance. 
          </p>
          <p className="text-[11px] text-slate-400">
            Please contact YagwaTech technical administration to activate the verification service template.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400">
          Target Reference Account: <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded">{referenceId}</span>
        </div>
      </div>
    </div>
  );
}
