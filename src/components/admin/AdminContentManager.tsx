'use client';

import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';

interface ContentSection {
  heroHeadline: string;
  heroSubtext: string;
  aboutText: string;
  ctaPrimary: string;
  ctaSecondary: string;
  servicesIntro: string;
  footerTagline: string;
}

const INITIAL_CONTENT: ContentSection = {
  heroHeadline: 'Transforming Business Through Cutting-Edge Technology',
  heroSubtext: 'YagwaTech delivers enterprise-grade IT solutions, cloud services, and digital transformation strategies tailored for businesses across East Africa and beyond.',
  aboutText: 'YagwaTech Solutions is a leading IT company headquartered in Nairobi, Kenya. Founded in 2019, we specialize in providing innovative technology solutions that empower businesses to thrive in the digital age. Our team of certified professionals brings together expertise in cloud computing, cybersecurity, software development, and IT consulting.',
  ctaPrimary: 'Get a Free Quote',
  ctaSecondary: 'View Our Portfolio',
  servicesIntro: 'We offer a comprehensive suite of IT services designed to accelerate your business growth and digital transformation journey across East Africa.',
  footerTagline: 'Innovating Africa\'s Digital Future',
};

export default function AdminContentManager() {
  const [content, setContent] = useState<ContentSection>(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setIsSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (
    label: string,
    key: keyof ContentSection,
    type: 'input' | 'textarea' = 'input',
    rows = 3,
    hint?: string,
  ) => (
    <div>
      <label className="block text-sm font-semibold text-ink-900 mb-1">{label}</label>
      {hint && <p className="text-xs text-ink-400 mb-2">{hint}</p>}
      {type === 'input' ? (
        <input
          type="text"
          value={content[key]}
          onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
        />
      ) : (
        <textarea
          value={content[key]}
          onChange={(e) => setContent((p) => ({ ...p, [key]: e.target.value }))}
          rows={rows}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {saved && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg bg-green-600 animate-fade-in">
          <CheckCircle className="w-4 h-4" /> Content saved successfully
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Content Manager</h1>
          <p className="text-sm text-ink-400 mt-1">Edit homepage and site-wide content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blueLight disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
            <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wide">Hero Section</h2>
          </div>
          {field('Hero Headline', 'heroHeadline', 'input', 1, 'The main headline displayed on the homepage hero.')}
          {field('Hero Subtext', 'heroSubtext', 'textarea', 3, 'Descriptive paragraph beneath the headline.')}
        </div>

        {/* CTA Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wide">Call-to-Action Buttons</h2>
          </div>
          {field('Primary CTA Label', 'ctaPrimary', 'input', 1, 'Text for the orange primary button.')}
          {field('Secondary CTA Label', 'ctaSecondary', 'input', 1, 'Text for the outline/secondary button.')}
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wide">About Section</h2>
          </div>
          {field('About Us Text', 'aboutText', 'textarea', 5, 'Main text in the About section.')}
        </div>

        {/* Services & Footer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wide">Services & Footer</h2>
          </div>
          {field('Services Intro Text', 'servicesIntro', 'textarea', 3, 'Introductory paragraph for the services section.')}
          {field('Footer Tagline', 'footerTagline', 'input', 1, 'Short tagline shown in the footer.')}
        </div>
      </div>

      {/* Save bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-ink-400">
          Changes are saved to local state. Connect to your CMS or database to persist changes.
        </p>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0"
        >
          {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
