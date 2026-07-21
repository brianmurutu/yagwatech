import { useState, useEffect } from 'react';

type Priority = 'High' | 'Medium' | 'Low';
type Column = 'Backlog' | 'In Progress' | 'Review' | 'Done';

interface Project {
  id: string;
  title: string;
  client: string;
  clientEmail?: string;
  status: Column;
  assignee: string;
  priority: Priority;
  dueDate: string;
  column: Column;
  tags: string[];
  budget?: string;
  description?: string;
  deadline?: string;
}

const initialProjects: Project[] = [
  { id: '1', title: 'AI Trainer Academy Portal', client: 'AI Trainer Academy', status: 'Done', assignee: 'Phineas Kirimi', priority: 'High', dueDate: '2026-06-15', column: 'Done', tags: ['Web', 'AI', 'SaaS'] },
  { id: '2', title: 'Rusinga Island Digital Literacy', client: 'Rusinga Digital Empowerment Initiative', status: 'Done', assignee: 'Timothy Mugendi', priority: 'Medium', dueDate: '2025-12-20', column: 'Done', tags: ['Community', 'Education'] },
  { id: '3', title: 'Investor Matchmaker Platform', client: 'Business Matching', status: 'Review', assignee: 'Brian Murutu', priority: 'High', dueDate: '2026-08-10', column: 'Review', tags: ['Finance', 'Branding'] },
  { id: '4', title: 'Technology Asset Manager', client: 'Assets For Technology', status: 'In Progress', assignee: 'Phineas Kirimi', priority: 'Medium', dueDate: '2026-08-30', column: 'In Progress', tags: ['Systems', 'Enterprise'] },
  { id: '5', title: 'Secure M&A Virtual Data Room', client: 'Confidential', status: 'In Progress', assignee: 'Timothy Mugendi', priority: 'High', dueDate: '2026-09-15', column: 'In Progress', tags: ['Security', 'Compliance'] },
  { id: '6', title: 'SaaS Startup Funding Hub', client: 'Confidential', status: 'Backlog', assignee: 'Isaac Odari', priority: 'Medium', dueDate: '2026-10-01', column: 'Backlog', tags: ['Web', 'Finance'] },
];

const columns: Column[] = ['Backlog', 'In Progress', 'Review', 'Done'];

const priorityStyle: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700 border border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Low: 'bg-green-100 text-green-700 border border-green-200',
};

const columnStyle: Record<Column, { header: string; dot: string }> = {
  Backlog: { header: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  'In Progress': { header: 'bg-[#0B3D91]/10 text-[#0B3D91]', dot: 'bg-[#0B3D91]' },
  Review: { header: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  Done: { header: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

export default function PortalProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSyncActive, setIsSyncActive] = useState(false);

  const loadProjects = async () => {
    try {
      // 1. Get logged-in user profile to filter by assignee
      const savedUser = localStorage.getItem('employee_user');
      let userFullName = '';
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          userFullName = parsed.fullName || '';
        } catch (e) {
          console.error(e);
        }
      }

      const configRes = await fetch('/api/crm/status');
      const configData = await configRes.json();
      const isLive = configData.projects?.status === 'connected';
      setIsSyncActive(isLive);

      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();

      if (projectsData.success) {
        if (projectsData.mock) {
          // Local storage projects
          const saved = localStorage.getItem('yagwa_projects');
          if (saved) {
            const parsed = JSON.parse(saved) as any[];
            const mapped = parsed.map((p) => ({
              ...p,
              id: p.id.toString(),
              column: p.status || p.column || 'Backlog',
              status: p.status || p.column || 'Backlog',
              dueDate: p.dueDate || p.deadline || new Date().toISOString().split('T')[0],
              tags: p.tags || [],
            }));
            
            // Team members should only see projects assigned to them
            const filtered = mapped.filter(
              (p) => p.assignee?.trim().toLowerCase() === userFullName.trim().toLowerCase()
            );
            setProjects(filtered);
          } else {
            const formatted = initialProjects.map((p) => ({
              ...p,
              column: p.status,
              dueDate: p.dueDate,
              client: p.client || 'Client Name',
              budget: 'KSh 500,000',
              description: 'Standard onboarding phase and project review.',
              tags: [],
            }));
            
            // Team members should only see projects assigned to them
            const filtered = formatted.filter(
              (p) => p.assignee?.trim().toLowerCase() === userFullName.trim().toLowerCase()
            );
            setProjects(filtered);
            localStorage.setItem('yagwa_projects', JSON.stringify(formatted));
          }
        } else {
          // Live Zoho Projects
          const mapped = (projectsData.projects || []).map((p: any) => ({
            ...p,
            column: p.status,
            dueDate: p.deadline,
            tags: [],
          }));
          
          // Team members should only see projects assigned to them
          const filtered = mapped.filter(
            (p) => p.assignee?.trim().toLowerCase() === userFullName.trim().toLowerCase()
          );
          setProjects(filtered);
        }
      }
    } catch (e) {
      console.error('Failed to load projects board:', e);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const cycleColumn = (id: string, current: Column) => {
    const nextColMap: Record<Column, Column> = {
      'Backlog': 'In Progress',
      'In Progress': 'Review',
      'Review': 'Done',
      'Done': 'Backlog'
    };
    const next = nextColMap[current];

    // Update locally filtered list
    const updatedFiltered = projects.map((p) => {
      if (p.id.toString() !== id.toString()) return p;
      return { ...p, column: next, status: next };
    });
    setProjects(updatedFiltered);

    // Save update to master list in local storage
    if (!isSyncActive) {
      const saved = localStorage.getItem('yagwa_projects');
      if (saved) {
        const parsed = JSON.parse(saved) as any[];
        const updatedMaster = parsed.map((p) => {
          if (p.id.toString() !== id.toString()) return p;
          return { ...p, column: next, status: next };
        });
        localStorage.setItem('yagwa_projects', JSON.stringify(updatedMaster));
      }
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A2E]">Project Kanban</h3>
          <p className="text-sm text-[#5A6680]">{projects.length} assigned projects {isSyncActive ? '(Zoho Synced)' : '(Local Database)'}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colProjects = projects.filter((p) => p.column === col || p.status === col);
          const { header, dot } = columnStyle[col];
          return (
            <div key={col} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              {/* Column header */}
              <div className={`flex items-center justify-between mb-4 px-3 py-2 rounded-xl ${header}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-sm font-semibold">{col}</span>
                </div>
                <span className="text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full">
                  {colProjects.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {colProjects.length === 0 ? (
                  <div className="text-center py-8 text-[#5A6680] text-sm">
                    <div className="text-2xl mb-2">📋</div>
                    <p>No projects here</p>
                  </div>
                ) : (
                  colProjects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="text-sm font-semibold text-[#1A1A2E] leading-snug group-hover:text-[#0B3D91] transition-colors">
                          {p.title}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${priorityStyle[p.priority]}`}>
                          {p.priority}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 mb-2">Client: {p.client}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#0B3D91] flex items-center justify-center">
                            <span className="text-white text-[8px] font-bold">
                              {p.assignee.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#5A6680] truncate max-w-[80px]">{p.assignee}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cycleColumn(p.id, p.status || p.column);
                          }}
                          className="text-[10px] text-[#0B3D91] hover:text-[#1A56C4] font-semibold flex items-center gap-0.5"
                          title="Move project to next stage"
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
    </div>
  );
}

