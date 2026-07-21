"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2 } from "lucide-react";

interface PersonaKYCProps {
  referenceId: string; // Partner/Client Email or Account ID
  onSuccess?: (inquiryId: string) => void;
  onFailed?: (inquiryId: string) => void;
}

export default function PersonaKYC({ referenceId, onSuccess, onFailed }: PersonaKYCProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "complete" | "error" | "no-config">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
  const environmentId = process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT_ID;

  useEffect(() => {
    if (!templateId) {
      setStatus("no-config");
      return;
    }

    let cancelled = false;

    const initPersona = async () => {
      try {
        // Dynamically import so it only runs client-side
        const PersonaModule = await import("persona");
        const Persona = PersonaModule.default ?? PersonaModule;

        if (cancelled || !containerRef.current) return;

        const options: Record<string, unknown> = {
          templateId,
          referenceId: referenceId || undefined,
          onReady: () => {
            if (!cancelled) setStatus("ready");
          },
          onComplete: ({ inquiryId }: { inquiryId: string }) => {
            if (!cancelled) {
              setStatus("complete");
              onSuccess?.(inquiryId);
            }
          },
          onCancel: () => {
            // User cancelled — keep widget visible, no state change needed
          },
          onError: (error: Error) => {
            if (!cancelled) {
              setErrorMsg(error?.message ?? "An unknown error occurred.");
              setStatus("error");
            }
          },
        };

        // environmentId is optional — only pass it if set
        if (environmentId) {
          options.environmentId = environmentId;
        }

        // Use setupIframe to embed inline (not a popup modal)
        const client = new Persona.Client(options);
        clientRef.current = client;

        // Open/embed into our container div
        client.open(containerRef.current as HTMLElement);
      } catch (err: any) {
        if (!cancelled) {
          setErrorMsg(err?.message ?? "Failed to load the verification module.");
          setStatus("error");
        }
      }
    };

    initPersona();

    return () => {
      cancelled = true;
      try {
        clientRef.current?.cancel();
      } catch (_) {
        // ignore
      }
    };
  }, [templateId, environmentId, referenceId]);

  // ── No configuration ──────────────────────────────────────────────────────
  if (status === "no-config") {
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
            Target Reference Account:{" "}
            <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded">{referenceId}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── SDK error ─────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
        <div className="bg-[#07255A] px-6 py-4 flex items-center gap-2 text-white">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span className="text-sm font-bold uppercase tracking-wider">Verification Error</span>
        </div>
        <div className="p-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-slate-800">Could Not Start Verification</h3>
            {errorMsg && (
              <p className="text-xs text-red-500 font-mono leading-relaxed">{errorMsg}</p>
            )}
            <p className="text-[11px] text-slate-400">
              Please refresh the page or contact YagwaTech support if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Widget (loading + active) ─────────────────────────────────────────────
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-[#07255A] px-6 py-4 flex items-center gap-2 text-white">
        <ShieldCheck className="w-5 h-5 text-brand-orange" />
        <span className="text-sm font-semibold">Secure Identity Verification</span>
      </div>

      {/* Loading overlay — shown until Persona fires onReady */}
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-medium">Loading verification module…</p>
        </div>
      )}

      {/* Persona SDK mounts its iframe here */}
      <div
        ref={containerRef}
        className={`w-full ${status === "loading" ? "hidden" : "block"}`}
        style={{ minHeight: "520px" }}
      />
    </div>
  );
}
