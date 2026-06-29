'use client';

import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, Filter, Trash2 } from 'lucide-react';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Todo' | 'In Progress' | 'Done';

interface Task {
  id: number;
  title: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  project: string;
}

const initialTasks: Task[] = [
  { id: 1, title: 'Write API documentation for KCB ERP endpoints', priority: 'High', status: 'In Progress', dueDate: '2024-07-22', project: 'ERP Integration' },
  { id: 2, title: 'Fix login session timeout bug on client portal', priority: 'High', status: 'Todo', dueDate: '2024-07-20', project: 'Client Portal' },
  { id: 3, title: 'Review pull request for website homepage redesign', priority: 'Medium', status: 'Todo', dueDate: '2024-07-23', project: 'Website' },
  { id: 4, title: 'Prepare Q3 project status report for management', priority: 'Medium', status: 'In Progress', dueDate: '2024-07-26', project: 'Admin' },
  { id: 5, title: 'Set up staging environment for mobile app', priority: 'High', status: 'Todo', dueDate: '2024-07-19', project: 'Mobile App' },
  { id: 6, title: 'Conduct security penetration test on e-commerce platform', priority: 'High', status: 'Done', dueDate: '2024-07-15', project: 'Cybersecurity' },
  { id: 7, title: 'Update employee handbook with 2024 leave policy', priority: 'Low', status: 'Done', dueDate: '2024-07-10', project: 'HR' },
  { id: 8, title: 'Configure AWS CloudWatch monitoring alerts', priority: 'Medium', status: 'In Progress', dueDate: '2024-07-28', project: 'Cloud Migration' },
];

const priorityStyle: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const statusIcon: Record<Status, React.ElementType> = {
  Todo: Circle,
  'In Progress': Clock,
  Done: CheckCircle2,
};

const statusColor: Record<Status, string> = {
  Todo: 'text-gray-400',
  'In Progress': 'text-[#0B3D91]',
  Done: 'text-green-500',
};

export default function PortalTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [newTask, setNewTask] = useState({ title: '', priority: 'Medium' as Priority, dueDate: '', project: '' });
  const [showForm, setShowForm] = useState(false);

  const filtered = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setTasks((prev) => [...prev, { ...newTask, id: Date.now(), status: 'Todo' }]);
    setNewTask({ title: '', priority: 'Medium', dueDate: '', project: '' });
    setShowForm(false);
  };

  const toggleStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const cycle: Status[] = ['Todo', 'In Progress', 'Done'];
        const next = cycle[(cycle.indexOf(t.status) + 1) % cycle.length];
        return { ...t, status: next };
      })
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const counts: Record<Status | 'All', number> = {
    All: tasks.length,
    Todo: tasks.filter((t) => t.status === 'Todo').length,
    'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
    Done: tasks.filter((t) => t.status === 'Done').length,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A2E]">My Tasks</h3>
          <p className="text-sm text-[#5A6680]">{counts['In Progress']} in progress · {counts.Todo} to do</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#0B3D91] hover:bg-[#1A56C4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-[#0B3D91]/25"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-5 border border-[#0B3D91]/20 shadow-sm">
          <h4 className="font-semibold text-[#1A1A2E] mb-4 text-sm">New Task</h4>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="What needs to be done?"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
            />
            <div className="grid grid-cols-3 gap-3">
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 bg-white"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 transition-all"
              />
              <input
                type="text"
                value={newTask.project}
                onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                placeholder="Project"
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-[#5A6680] hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2 bg-[#0B3D91] text-white rounded-xl text-sm font-semibold hover:bg-[#1A56C4] transition-colors">
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['All', 'Todo', 'In Progress', 'Done'] as (Status | 'All')[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? 'bg-[#0B3D91] text-white shadow-md'
                : 'bg-white text-[#5A6680] border border-gray-200 hover:border-[#0B3D91]/40'
            }`}
          >
            <Filter className="w-3 h-3" />
            {f}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#5A6680]'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-[#5A6680] font-medium">No tasks in this category</p>
            <p className="text-sm text-gray-400 mt-1">Add a new task to get started</p>
          </div>
        ) : (
          filtered.map((task) => {
            const StatusIcon = statusIcon[task.status];
            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4 hover:shadow-sm transition-all group ${
                  task.status === 'Done' ? 'opacity-60' : ''
                }`}
              >
                <button
                  onClick={() => toggleStatus(task.id)}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                  title="Click to advance status"
                >
                  <StatusIcon className={`w-5 h-5 ${statusColor[task.status]}`} />
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium text-[#1A1A2E] ${task.status === 'Done' ? 'line-through' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {task.project && (
                      <span className="text-[10px] text-[#5A6680] bg-gray-100 px-2 py-0.5 rounded-full">
                        {task.project}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="text-[10px] text-[#5A6680]">
                        Due {new Date(task.dueDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${priorityStyle[task.priority]}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
