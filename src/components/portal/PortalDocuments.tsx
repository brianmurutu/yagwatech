'use client';

import { useState } from 'react';
import { FileText, Download, Search, FolderOpen, Upload } from 'lucide-react';

interface Doc {
  id: number;
  name: string;
  date: string;
  size: string;
  type: 'pdf' | 'xlsx' | 'docx';
}

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  docs: Doc[];
}

const categories: Category[] = [
  {
    id: 'hr',
    label: 'HR Documents',
    icon: '👥',
    color: 'from-[#0B3D91] to-[#1A56C4]',
    docs: [
      { id: 1, name: 'Employee Handbook 2024', date: '2024-01-15', size: '2.4 MB', type: 'pdf' },
      { id: 2, name: 'Annual Leave Policy', date: '2024-01-10', size: '512 KB', type: 'pdf' },
      { id: 3, name: 'Performance Review Template', date: '2024-03-01', size: '248 KB', type: 'docx' },
      { id: 4, name: 'Staff Benefits & Allowances', date: '2024-02-20', size: '1.1 MB', type: 'pdf' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Payroll',
    icon: '💰',
    color: 'from-emerald-600 to-emerald-500',
    docs: [
      { id: 5, name: 'June 2024 Payslips', date: '2024-07-01', size: '3.2 MB', type: 'pdf' },
      { id: 6, name: 'Q2 2024 Expense Report', date: '2024-07-05', size: '1.8 MB', type: 'xlsx' },
      { id: 7, name: 'Budget Allocation FY2024', date: '2024-01-05', size: '980 KB', type: 'xlsx' },
      { id: 8, name: 'Procurement Policy', date: '2024-02-10', size: '420 KB', type: 'pdf' },
    ],
  },
  {
    id: 'projects',
    label: 'Project Docs',
    icon: '📁',
    color: 'from-[#F47B20] to-[#F99A50]',
    docs: [
      { id: 9, name: 'KCB ERP Integration Brief', date: '2024-06-12', size: '1.5 MB', type: 'pdf' },
      { id: 10, name: 'Cloud Migration Runbook', date: '2024-05-20', size: '3.7 MB', type: 'pdf' },
      { id: 11, name: 'Cybersecurity Audit Report v2', date: '2024-07-15', size: '2.9 MB', type: 'pdf' },
      { id: 12, name: 'Website Redesign Specification', date: '2024-06-28', size: '4.2 MB', type: 'docx' },
    ],
  },
];

const typeStyle: Record<string, string> = {
  pdf: 'bg-red-100 text-red-600',
  xlsx: 'bg-green-100 text-green-700',
  docx: 'bg-[#0B3D91]/10 text-[#0B3D91]',
};

export default function PortalDocuments() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');

  const allDocs = categories.flatMap((c) =>
    c.docs.map((d) => ({ ...d, category: c.label }))
  );

  const filteredCats = categories
    .map((cat) => ({
      ...cat,
      docs: cat.docs.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) &&
          (activeCategory === 'all' || cat.id === activeCategory)
      ),
    }))
    .filter((cat) => cat.docs.length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A2E]">Document Library</h3>
          <p className="text-sm text-[#5A6680]">{allDocs.length} documents across {categories.length} categories</p>
        </div>
        <button className="flex items-center gap-2 border border-dashed border-[#0B3D91]/40 hover:border-[#0B3D91] text-[#0B3D91] text-sm font-medium px-4 py-2.5 rounded-xl transition-all hover:bg-[#0B3D91]/5">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6680]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-[#0B3D91] text-white' : 'bg-white border border-gray-200 text-[#5A6680] hover:border-[#0B3D91]/40'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === c.id ? 'bg-[#0B3D91] text-white' : 'bg-white border border-gray-200 text-[#5A6680] hover:border-[#0B3D91]/40'}`}
            >
              {c.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Category sections */}
      {filteredCats.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-[#5A6680] font-medium">No documents found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCats.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Category header */}
              <div className={`bg-gradient-to-r ${cat.color} px-6 py-4 flex items-center gap-3`}>
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{cat.label}</h4>
                  <p className="text-white/60 text-xs">{cat.docs.length} documents</p>
                </div>
              </div>

              {/* Documents list */}
              <div className="divide-y divide-gray-50">
                {cat.docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeStyle[doc.type]}`}>
                      <FileText className="w-4.5 h-4.5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A2E] group-hover:text-[#0B3D91] transition-colors truncate">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className={`text-[10px] font-bold uppercase ${typeStyle[doc.type]} px-1.5 py-0.5 rounded`}>
                          {doc.type}
                        </span>
                        <span className="text-[11px] text-[#5A6680]">{doc.size}</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(doc.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Download */}
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white border border-[#0B3D91]/20 transition-all opacity-0 group-hover:opacity-100"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
