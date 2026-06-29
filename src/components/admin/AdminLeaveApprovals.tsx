'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, MessageSquare, Filter } from 'lucide-react';

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Emergency Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Study Leave';

interface LeaveRequest {
  id: string;
  employee: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  notes: string;
  avatar: string;
}

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: '1', employee: 'Amina Wanjiku', department: 'Design', avatar: 'AW', type: 'Annual Leave', startDate: '2026-07-02', endDate: '2026-07-06', days: 5, reason: 'Family vacation to Mombasa for school break.', status: 'Pending', notes: '' },
  { id: '2', employee: 'Kevin Kimani', department: 'Engineering', avatar: 'KK', type: 'Sick Leave', startDate: '2026-06-30', endDate: '2026-07-01', days: 2, reason: 'Flu and doctor's recommendation for rest.', status: 'Pending', notes: '' },
  { id: '3', employee: 'Faith Akinyi', department: 'Operations', avatar: 'FA', type: 'Emergency Leave', startDate: '2026-06-29', endDate: '2026-06-29', days: 1, reason: 'Family emergency requiring immediate attention.', status: 'Pending', notes: '' },
  { id: '4', employee: 'Lucy Adhiambo', department: 'Sales', avatar: 'LA', type: 'Annual Leave', startDate: '2026-07-10', endDate: '2026-07-17', days: 8, reason: 'Pre-planned vacation leave. All handover docs ready.', status: 'Approved', notes: 'Approved. Ensure handover with James before departure.' },
  { id: '5', employee: 'Patrick Ochieng', department: 'Engineering', avatar: 'PO', type: 'Study Leave', startDate: '2026-07-14', endDate: '2026-07-18', days: 5, reason: 'AWS Cloud Practitioner certification exam preparation.', status: 'Approved', notes: 'Excellent initiative. Approved with full pay.' },
  { id: '6', employee: 'David Mwangi', department: 'Marketing', avatar: 'DM', type: 'Sick Leave', startDate: '2026-06-20', endDate: '2026-06-21', days: 2, reason: 'Medical procedure follow-up.', status: 'Rejected', notes: 'Rejected — insufficient sick leave balance. Please apply for unpaid leave.' },
];

const avatarColors: Record<string, string> = {
  AW: 'bg-orange-500', KK: 'bg-indigo-500', FA: 'bg-teal-500',
  LA: 'bg-pink-500', PO: 'bg-purple-500', DM: 'bg-green-500',
};

const statusConfig: Record<LeaveStatus, { label: string; badge: string; icon: React.ReactNode }> = {
  Pending: { label: 'Pending', badge: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" /> },
  Approved: { label: 'Approved', badge: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  Rejected: { label: 'Rejected', badge: 'bg-red-100 text-red-600', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function AdminLeaveApprovals() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [filter, setFilter] = useState<'All' | LeaveStatus>('All');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: action, notes: notes[id] || l.notes } : l,
      ),
    );
    showToast(`Leave request ${action.toLowerCase()} successfully`);
  };

  const filtered = filter === 'All' ? leaves : leaves.filter((l) => l.status === filter);
  const pending = leaves.filter((l) => l.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg animate-fade-in ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Leave Approvals</h1>
          <p className="text-sm text-ink-400 mt-1">
            {pending > 0 ? (
              <span className="text-orange-600 font-medium">{pending} pending request{pending !== 1 ? 's' : ''} awaiting action</span>
            ) : (
              'All requests reviewed'
            )}
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink-400" />
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-brand-blue text-white'
                  : 'bg-white border border-gray-200 text-ink-400 hover:border-brand-blue hover:text-brand-blue'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((leave) => {
          const s = statusConfig[leave.status];
          const isPending = leave.status === 'Pending';
          return (
            <div
              key={leave.id}
              className={`bg-white rounded-2xl shadow-sm border ${isPending ? 'border-orange-200' : 'border-gray-100'} overflow-hidden`}
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Employee info */}
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-full ${avatarColors[leave.avatar] || 'bg-gray-500'} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {leave.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-ink-900">{leave.employee}</p>
                        <span className="text-xs text-ink-400">·</span>
                        <span className="text-xs text-ink-400">{leave.department}</span>
                      </div>
                      <p className="text-sm text-ink-400 mt-0.5">
                        <span className="font-medium text-ink-900">{leave.type}</span>{' '}
                        · {leave.days} day{leave.days !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-ink-400 mt-0.5">
                        {leave.startDate} → {leave.endDate}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${s.badge}`}>
                    {s.icon} {s.label}
                  </span>
                </div>

                {/* Reason */}
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-ink-400 mb-1">Reason</p>
                  <p className="text-sm text-ink-900">{leave.reason}</p>
                </div>

                {/* Notes (existing) */}
                {leave.notes && !isPending && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs font-semibold text-brand-blue mb-1">Admin Notes</p>
                    <p className="text-sm text-ink-900">{leave.notes}</p>
                  </div>
                )}

                {/* Pending actions */}
                {isPending && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-ink-400 mt-2.5 flex-shrink-0" />
                      <textarea
                        placeholder="Add admin notes (optional)…"
                        value={notes[leave.id] || ''}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [leave.id]: e.target.value }))}
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(leave.id, 'Approved')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(leave.id, 'Rejected')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <p className="text-ink-400 text-sm">No leave requests matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
