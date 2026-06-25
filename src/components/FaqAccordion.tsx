"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs, faqCategories } from "@/lib/faqs";

export default function FaqAccordion() {
  const [active, setActive] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered =
    active === "All" ? faqs : faqs.filter((f) => f.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {faqCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActive(cat);
              setOpenIndex(0);
            }}
            className={`rounded-full border px-4 py-1.5 text-[12.5px] transition-colors ${
              active === cat
                ? "bg-brand-blue text-white border-brand-blue"
                : "border-black/10 text-ink-400 hover:border-brand-blue"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {filtered.map((faq, i) => (
          <div key={faq.question} className="rounded-xl border border-black/5 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="text-sm font-medium text-ink-900">{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-brand-blue transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4">
                <p className="text-[13.5px] leading-relaxed text-ink-400">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
