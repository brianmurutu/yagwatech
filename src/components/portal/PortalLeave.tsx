'use client';

import { useState } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type LeaveType = 'Annual' | 'Sick' | 'Emergency' | 'Personal';
type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';

interface LeaveRequest {
  id: number;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

const leaveHistory: LeaveRequest[] = [
  { id: 1, type: 'Annual', startDate: '2024-07-10', endDate: '2024-07-14', days: 5, reason: 'Family vacation', status: 'Approved', appliedOn: '2024-06-28' },
  { id: 2, type: 'Sick', startDate: '2024-05-20', endDate: '2024-05-21', days: 2, reason: 'Medical appointment', status: 'Approved', appliedOn: '2024-05-19' },
  { id: 3, type: 'Personal', startDate: '2024-04-15', endDate: '2024-04-15', days: 1, reason: 'Personal errand', status: 'Approved', appliedOn: '2024-04-12' },
  { id: 4, type: 'Emergency', startDate: '2024-03-05', endDate: '2024-03-06', days: 2, reason: 'Family emergency', status: 'Rejected', appliedOn: '2024-03-04' },
];

const statusStyle: Record<LeaveStatus, { badge: string; Icon: React.ElementType }> = {
  Approved: { badge: 'bg-green-100 text-green-700 border-green-200', Icon: CheckCircle2 },
  Pending: { badge: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Clock },
  Rejected: { badge: 'bg-red-100 text-red-700 border-red-200', Icon: XCircle },
};

const typeColor: Record<LeaveType, string> = {
  Annual: 'bg-[#0B3D91]/10 text-[#0B3D91]',
  Sick: 'bg-red-100 text-red-600',
  Emergency: 'bg-orange-100 text-orange-600',
  Personal: 'bg-purple-100 text-purple-600',
};

export default function PortalLeave() {
  const [form, setForm] = useState({
    type: 'Annual' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<LeaveRequest[]>(leaveHistory);

  const balances = [
    { type: 'Annual', remaining: 18, total: 21, color: 'from-[#0B3D91] to-[#1A56C4]' },
    { type: 'Sick', remaining: 10, total: 14, color: 'from-red-500 to-red-400' },
    { type: 'Personal', remaining: 5, total: 7, color: 'from-purple-600 to-purple-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) return;

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    setHistory((prev) => [
      {
        id: Date.now(),
        ...form,
        days: Math.max(1, days),
        status: 'Pending',
        appliedOn: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ]);
    setForm({ type: 'Annual', startDate: '', endDate: '', reason: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-bold text-[#1A1A2E]">Leave Management</h3>
        <p className="text-sm text-[#5A6680]">Request, track, and manage your leave</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Request Form */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-[#1A1A2E] mb-5">New Leave Request</h4>

          {submitted && (
            <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">Leave request submitted successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Leave Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Annual', 'Sick', 'Emergency', 'Personal'] as LeaveType[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setForm({ ...form, type })}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                      form.type === type
                        ? 'bg-[#0B3D91] text-white border-[#0B3D91] shadow-md'
                        : 'bg-gray-50 text-[#5A6680] border-gray-200 hover:border-[#0B3D91]/40'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  required
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">Reason</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Brief reason for your leave request…"
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/40 focus:border-[#0B3D91] transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#F47B20] hover:bg-[#F99A50] text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-[#F47B20]/25"
            >
              Submit Leave Request
            </button>
          </form>
        </div>

        {/* Balance Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-semibold text-[#1A1A2E]">Leave Balances</h4>
          {balances.map(({ type, remaining, total, color }) => (
            <div key={type} className={`bg-gradient-to-r ${color} rounded-2xl p-5 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/80">{type} Leave</span>
                <Calendar className="w-4 h-4 text-white/60" />
              </div>
              <div className="text-3xl font-bold mb-1">{remaining}</div>
              <p className="text-xs text-white/65">{total - remaining} used of {total} days</p>
              <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${(remaining / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="font-semibold text-[#1A1A2E]">Leave History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Type', 'Start', 'End', 'Days', 'Reason', 'Applied', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#5A6680] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((item) => {
                const { badge, Icon } = statusStyle[item.status];
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${typeColor[item.type]}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1A1A2E]">{new Date(item.startDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                    <td className="px-4 py-3 text-[#1A1A2E]">{new Date(item.endDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A1A2E]">{item.days}d</td>
                    <td className="px-4 py-3 text-[#5A6680] max-w-[140px] truncate">{item.reason}</td>
                    <td className="px-4 py-3 text-[#5A6680]">{new Date(item.appliedOn).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badge}`}>
                        <Icon className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
