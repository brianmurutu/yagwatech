"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { WhatsappIcon } from "@/components/SocialIcons";

export default function WhatsAppFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the chat widget when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if clicking the toggle button itself
      if (buttonRef.current?.contains(event.target as Node)) {
        return;
      }
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg = message.trim() || "Hello YagwaTech, I would like to talk about a project";
    const encodedText = encodeURIComponent(finalMsg);
    const whatsappUrl = `${site.social.whatsapp}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setMessage("");
  };

  const handleChipClick = (chipText: string) => {
    setMessage(chipText);
    const textarea = widgetRef.current?.querySelector("textarea");
    if (textarea) {
      (textarea as HTMLTextAreaElement).focus();
    }
  };

  const quickInquiries = [
    "I need software/web development 💻",
    "Request a cybersecurity audit 🔒",
    "Inquire about cloud services ☁️",
    "Just want to ask a question! 👋",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* ── Chat Widget Popup ─────────────────────────────────────────── */}
      <div
        ref={widgetRef}
        className={`absolute bottom-20 right-0 w-[320px] sm:w-[350px] overflow-hidden rounded-2xl bg-white border border-black/5 shadow-2xl transition-all duration-300 origin-bottom-right transform ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Widget Header */}
        <div className="bg-gradient-to-br from-brand-blueDark to-brand-blue p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                <MessageSquare className="h-5 w-5 text-white" />
                {/* Active Indicator Pulse */}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-[#25D366] ring-2 ring-brand-blueDark animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide">YagwaTech Support</h4>
                <p className="flex items-center gap-1 text-[10px] text-white/70 font-medium">
                  <Clock className="h-3 w-3" /> Typically replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close chat window"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Widget Body */}
        <div className="p-5 space-y-4 bg-ink-50/20 max-h-[350px] overflow-y-auto">
          {/* Support Greeting Bubble */}
          <div className="flex items-start gap-2">
            <div className="rounded-2xl rounded-tl-none bg-white border border-black/5 p-3 text-xs leading-relaxed text-ink-900 shadow-sm max-w-[85%]">
              Hi there! 👋 Welcome to Yagwa Tech Solutions. What can we help you build, design, or secure today?
            </div>
          </div>

          {/* Quick Inquiry Chips */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-2">Frequently Asked:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickInquiries.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full border border-black/5 bg-white px-3 py-1.5 text-[11px] text-ink-400 hover:border-brand-blue/30 hover:text-brand-blue transition-all text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Widget Footer / Input Form */}
        <div className="p-4 bg-white border-t border-black/5">
          <form onSubmit={handleSend} className="flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message & send on WhatsApp..."
              rows={1}
              className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-xs text-ink-900 focus:outline-none focus:border-brand-blue resize-none min-h-[36px] max-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#25D366] text-white hover:bg-[#20ba56] shadow transition-colors"
              aria-label="Send WhatsApp message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ── FAB Toggle Button ─────────────────────────────────────────── */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close WhatsApp chat menu" : "Open WhatsApp chat menu"}
        className={`group flex items-center justify-center h-[52px] w-[52px] rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 ${
          isOpen
            ? "bg-brand-blueDark rotate-90 shadow-brand-blueDark/20"
            : "bg-[#25D366] shadow-[#25D366]/30 hover:shadow-[#25D366]/50"
        }`}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <WhatsappIcon className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  );
}
