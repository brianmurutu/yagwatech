"use client";

import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnimatedSection from "@/components/AnimatedSection";
import { 
  Briefcase, 
  Plus, 
  X, 
  Calendar, 
  User, 
  Settings, 
  Activity, 
  CheckCircle,
  FileText,
  DollarSign
} from "lucide-react";

type Priority = "High" | "Medium" | "Low";
type Column = "Backlog" | "In Progress" | "Review" | "Done";

interface Project {
  id: string;
  title: string;
  client: string;
  status: Column;
  assignee: string;
  priority: Priority;
  deadline: string;
  budget: string;
  description: string;
}

const INITIAL_PROJECTS: Project[] = [
  { id: "1", title: "Client Onboarding Portal", client: "Safaricom PLC", status: "Backlog", assignee: "Faith Akinyi", priority: "Medium", deadline: "2026-08-15", budget: "KSh 1,200,000", description: "Internal onboarding portal for new Safaricom business client accounts." },
  { id: "2", title: "Mobile App Redesign", client: "KCB Bank Group", status: "Backlog", assignee: "David Mwangi", priority: "Low", deadline: "2026-09-01", budget: "KSh 850,000", description: "Complete UI/UX redesign of the corporate mobile banking application." },
  { id: "3", title: "ERP Integration", client: "Equity Bank", status: "In Progress", assignee: "James Otieno", priority: "High", deadline: "2026-07-30", budget: "KSh 3,500,000", description: "Integrating enterprise resource planning systems with modern backend APIs." },
  { id: "4", title: "Cybersecurity Audit", client: "Co-operative Bank", status: "In Progress", assignee: "Samuel Karanja", priority: "High", deadline: "2026-07-20", budget: "KSh 1,800,000", description: "Full system penetration testing, security analysis, and compliance audit." },
];

const columns: Column[] = ["Backlog", "In Progress", "Review", "Done"];

const priorityStyle: Record<Priority, string> = {
  High: "bg-red-100 text-red-700 border border-red-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Low: "bg-green-100 text-green-700 border border-green-200",
};

const columnStyle: Record<Column, { header: string; dot: string }> = {
  Backlog: { header: "bg-gray-100 text-gray-700", dot: "bg-gray-400" },
  "In Progress": { header: "bg-blue-50 text-blue-700 border-blue-100", dot: "bg-blue-500" },
  Review: { header: "bg-purple-50 text-purple-700 border-purple-100", dot: "bg-purple-500" },
  Done: { header: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
};

export default function ProjectsBoardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    status: "Backlog" as Column,
    assignee: "James Otieno",
    priority: "Medium" as Priority,
    deadline: "",
    budget: "",
    description: "",
  });

  const loadProjects = () => {
    setLoading(true);
    // Fetch integration statuses
    fetch("/api/crm/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error("Error fetching config status", err));

    // Fetch projects
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.mock) {
            // Zoho unconfigured: fallback to localStorage mock projects
            const saved = localStorage.getItem("yagwa_projects");
            if (saved) {
              try {
                setProjects(JSON.parse(saved));
              } catch (e) {
                setProjects(INITIAL_PROJECTS);
              }
            } else {
              setProjects(INITIAL_PROJECTS);
              localStorage.setItem("yagwa_projects", JSON.stringify(INITIAL_PROJECTS));
            }
          } else {
            // Live Zoho projects
            setProjects(data.projects || []);
          }
        }
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      client: "",
      status: "Backlog",
      assignee: "James Otieno",
      priority: "Medium",
      deadline: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
      budget: "KSh 500,000",
      description: "",
    });
    setShowModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.mock) {
          // If in mock mode, add to localStorage array manually
          const newProject: Project = {
            id: Date.now().toString(),
            ...formData,
          };
          const updated = [...projects, newProject];
          setProjects(updated);
          localStorage.setItem("yagwa_projects", JSON.stringify(updated));
        } else {
          // Reload from live Zoho API
          loadProjects();
        }
        setShowModal(false);
      } else {
        alert(data.error || "Failed to create project.");
      }
    } catch {
      alert("Failed to connect to the server.");
    } finally {
      setIsAdding(false);
    }
  };

  const cycleStatus = (id: string, current: Column) => {
    const sequence: Record<Column, Column> = {
      "Backlog": "In Progress",
      "In Progress": "Review",
      "Review": "Done",
      "Done": "Backlog",
    };
    const nextCol = sequence[current];

    const updated = projects.map((p) => {
      if (p.id !== id) return p;
      return { ...p, status: nextCol };
    });

    setProjects(updated);
    // If in mock mode, update localStorage
    if (status?.projects?.status === "mock") {
      localStorage.setItem("yagwa_projects", JSON.stringify(updated));
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
              { label: "Zoho Projects Board" },
            ]}
          />
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#F47B20] tracking-wide uppercase">
                <Briefcase className="w-3.5 h-3.5" /> Zoho Projects Module
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Projects Kanban Board
              </h1>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                Coordinate client deliverables, manage budgets, and oversee team resources syncing with Zoho Projects REST APIs.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 bg-[#F47B20] hover:bg-[#d46512] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-lg hover:scale-102 shrink-0 md:self-end"
            >
              <Plus className="w-4 h-4" /> Create Project
            </button>
          </div>
        </div>
      </section>

      {/* Main Board Container */}
      <div className="container-wrap mt-8 space-y-6">
        {/* Status Indicators */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sync State:</span>
            {status ? (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  status.projects.status === "connected"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {status.projects.status === "connected" ? "Live Connected (Zoho)" : "Local Mock Storage"}
              </span>
            ) : (
              <span className="text-xs text-slate-400">checking sync...</span>
            )}
          </div>
          <div className="text-xs text-slate-500">
            Click <strong className="text-brand-blue">Move →</strong> on cards to cycle project status.
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Retrieving project boards...</p>
          </div>
        ) : (
          /* Kanban Board columns */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {columns.map((col) => {
              const colProjects = projects.filter((p) => p.status === col);
              const { header, dot } = columnStyle[col];
              return (
                <div key={col} className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[480px]">
                  {/* Column Header */}
                  <div className={`flex items-center justify-between mb-4 px-3 py-2 border rounded-xl bg-white shadow-sm ${header}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${dot} animate-pulse`} />
                      <span className="text-sm font-bold text-slate-800">{col}</span>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                      {colProjects.length}
                    </span>
                  </div>

                  {/* Cards stack */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px] pr-1">
                    {colProjects.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 rounded-2xl">
                        <FileText className="w-5 h-5 mb-2 text-slate-300" />
                        <p>Empty stage</p>
                      </div>
                    ) : (
                      colProjects.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-blue transition-colors leading-snug">
                              {p.title}
                            </h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${priorityStyle[p.priority]}`}>
                              {p.priority}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                            {p.description}
                          </p>

                          <div className="flex items-center gap-2 mb-3 text-[10px] text-slate-600 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold truncate">Client: {p.client}</span>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20 flex items-center justify-center text-[9px] font-bold">
                                {p.assignee.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium truncate max-w-[80px]">
                                {p.assignee}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cycleStatus(p.id, p.status);
                              }}
                              className="text-[10px] text-brand-blue hover:text-[#d46512] font-bold flex items-center gap-0.5 hover:underline"
                            >
                              Move →
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#07255A] to-[#0B3D91] px-6 py-5 flex items-center justify-between text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#F47B20]" />
                Create New Project
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. ERP System Phase 2"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Safaricom PLC"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Budget *</label>
                  <input
                    type="text"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. KSh 2,500,000"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Lead Assignee</label>
                  <input
                    type="text"
                    required
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    placeholder="e.g. James Otieno"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Deadline *</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Column })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Project Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Outline the scopes, milestones, and deliverables..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-6 py-2.5 bg-[#F47B20] hover:bg-[#d46512] text-white rounded-xl text-sm font-semibold shadow-md disabled:opacity-50"
                >
                  {isAdding ? "Syncing..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
