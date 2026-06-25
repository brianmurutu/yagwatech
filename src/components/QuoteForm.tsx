"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { services } from "@/lib/services";

const budgetRanges = [
  "Under KES 50,000",
  "KES 50,000 to 150,000",
  "KES 150,000 to 400,000",
  "KES 400,000 and above",
  "Not sure yet",
];

const timelines = [
  "As soon as possible",
  "Within 1 month",
  "1 to 3 months",
  "Just exploring options",
];

export default function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    timeline: "",
    details: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        budget: "",
        timeline: "",
        details: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
        <h3 className="mt-4 text-lg font-medium text-ink-900">Request received</h3>
        <p className="mt-2 text-sm text-ink-400">
          Thank you for sharing your project details. We will review and get back to you
          within one business day with next steps.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-brand-blue"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Full name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue"
            placeholder="Jane Wanjiru"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue"
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1.5">
            Phone number <span className="text-ink-400">(optional)</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue"
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1.5">
            Company name <span className="text-ink-400">(optional)</span>
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue"
            placeholder="Your company"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-900 mb-1.5">
          Which service do you need?
        </label>
        <select
          required
          value={form.service}
          onChange={(e) => update("service", e.target.value)}
          className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue bg-white"
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="Not sure, need guidance">Not sure, need guidance</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1.5">
            Estimated budget
          </label>
          <select
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue bg-white"
          >
            <option value="">Select a range</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-900 mb-1.5">
            Desired timeline
          </label>
          <select
            value={form.timeline}
            onChange={(e) => update("timeline", e.target.value)}
            className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue bg-white"
          >
            <option value="">Select a timeline</option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-900 mb-1.5">
          Tell us about your project
        </label>
        <textarea
          required
          rows={5}
          value={form.details}
          onChange={(e) => update("details", e.target.value)}
          className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue resize-none"
          placeholder="What are you trying to achieve, and what does success look like for this project?"
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-brand-orange px-6 py-3.5 text-sm font-medium text-white hover:bg-brand-orangeLight transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending request..." : "Request a quote"}
      </button>
    </form>
  );
}
