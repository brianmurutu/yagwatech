"use client";

import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { 
  Database, 
  Send, 
  CheckCircle, 
  Activity, 
  Settings, 
  FileText, 
  Plus, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ClipboardList 
} from "lucide-react";

interface LogEntry {
  id: string;
  name: string;
  email: string;
  source: string;
  timestamp: string;
  status: "Success" | "Failed";
  mode: string;
}

export default function CRMHubPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
    source: "Manual Intake Portal",
  });

  const [status, setStatus] = useState<any>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Fetch CRM connection status
    fetch("/api/crm/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error("Error fetching status:", err));

    // Load logs from localStorage
    const savedLogs = localStorage.getItem("yagwa_crm_logs");
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    } else {
      const defaultLogs: LogEntry[] = [
        {
          id: "1",
          name: "Faith Njeri",
          email: "faith.njeri@safaricom.co.ke",
          source: "Quote Request Form",
          timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString("en-KE"),
          status: "Success",
          mode: "Simulated Local Mode",
        },
        {
          id: "2",
          name: "Dennis Mutua",
          email: "dmutua@kcb.co.ke",
          source: "Contact Form Website",
          timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString("en-KE"),
          status: "Success",
          mode: "Simulated Local Mode",
        },
      ];
      setLogs(defaultLogs);
      localStorage.setItem("yagwa_crm_logs", JSON.stringify(defaultLogs));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/crm/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitMessage({
          type: "success",
          text: data.mock
            ? "Lead captured successfully (Operating in Simulated Local Mode)."
            : `Lead created successfully in Zoho CRM! ID: ${data.leadId}`,
        });

        // Add log entry
        const newLog: LogEntry = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          source: formData.source,
          timestamp: new Date().toLocaleString("en-KE"),
          status: "Success",
          mode: data.mock ? "Simulated Local Mode" : "Live Zoho CRM API",
        };

        const updatedLogs = [newLog, ...logs];
        setLogs(updatedLogs);
        localStorage.setItem("yagwa_crm_logs", JSON.stringify(updatedLogs));

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          description: "",
          source: "Manual Intake Portal",
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: data.error || "Failed to submit lead. Please try again.",
        });
      }
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Failed to connect to the server. Please check your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              { label: "Zoho CRM Lead Hub" },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#F47B20] tracking-wide uppercase">
              <Database className="w-3.5 h-3.5" /> Zoho CRM Module
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Zoho CRM Lead Hub
            </h1>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              Capture, track, and sync customer leads and inquiries with our integrated Zoho CRM engine. Access diagnostics and push manual entries directly into the pipeline.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="container-wrap mt-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Manual Ingestion Form */}
          <div className="lg:col-span-7">
            <AnimatedSection type="fade" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand-blue" />
                Manual Lead Ingestion Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter details below to manually sync a prospect lead directly into Zoho CRM.
              </p>

              {submitMessage.text && (
                <div
                  className={`mt-4 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    submitMessage.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-600"
                  }`}
                >
                  {submitMessage.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Activity className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span>{submitMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prospect Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. john@company.com"
                        className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +254 712 345 678"
                        className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Org</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. ACME Corp"
                        className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source *</label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91]"
                    >
                      <option value="Manual Intake Portal">Manual Intake Portal</option>
                      <option value="Cold Outreach">Cold Outreach</option>
                      <option value="Referral Program">Referral Program</option>
                      <option value="Event/Conference">Event/Conference</option>
                      <option value="Partnership Channel">Partnership Channel</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project/Lead Details *</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Provide details about the prospect's software, budget, timeline, or product specifications..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 focus:border-[#0B3D91]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#0B3D91] hover:bg-[#07255A] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Pushing to CRM...
                    </>
                  ) : (
                    <>
                      Ingest Lead to CRM <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </AnimatedSection>
          </div>

          {/* Right: API Diagnostics & Ingestion Logs */}
          <div className="lg:col-span-5 space-y-6">
            {/* API Diagnostics */}
            <AnimatedSection type="scale" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-orange" />
                CRM Connection Status
              </h3>
              <p className="text-xs text-slate-500 mt-1">Diagnostic state for third-party systems.</p>

              {status ? (
                <div className="mt-4 space-y-3.5">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Zoho CRM Integration</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{status.crm.mode}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        status.crm.status === "connected"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {status.crm.status === "connected" ? "Live Connected" : "Local Mock"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Endpoint Access</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">https://www.zohoapis.com/crm/v3</p>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      HTTP POST
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
                  Loading integration states...
                </div>
              )}
            </AnimatedSection>

            {/* Ingestion Logs */}
            <AnimatedSection type="scale" delay={150} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Recent Ingestion Activity
              </h3>
              <p className="text-xs text-slate-500 mt-1">Real-time log of lead submissions.</p>

              <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    No recent ingestion logs.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs relative group hover:border-slate-300 transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-800">{log.name}</p>
                          <p className="text-[10px] text-slate-500">{log.email}</p>
                        </div>
                        <span className="text-[9px] font-semibold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md">
                          {log.source}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-200/60 pt-2">
                        <span>{log.timestamp}</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          ● {log.mode}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
