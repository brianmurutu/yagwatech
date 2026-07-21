'use client';

import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';

interface DayLog {
  day: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Leave';
}

const weekLog: DayLog[] = [
  { day: 'Monday', date: '2024-07-15', clockIn: '08:02', clockOut: '17:15', hours: '9h 13m', status: 'Present' },
  { day: 'Tuesday', date: '2024-07-16', clockIn: '07:58', clockOut: '17:30', hours: '9h 32m', status: 'Present' },
  { day: 'Wednesday', date: '2024-07-17', clockIn: '08:10', clockOut: '17:00', hours: '8h 50m', status: 'Present' },
  { day: 'Thursday', date: '2024-07-18', clockIn: '08:05', clockOut: '17:45', hours: '9h 40m', status: 'Present' },
  { day: 'Friday', date: '2024-07-19', clockIn: '—', clockOut: '—', hours: '0h 0m', status: 'Absent' },
];

const statusStyle: Record<string, string> = {
  Present: 'bg-green-100 text-green-700 border-green-200',
  Absent: 'bg-red-100 text-red-600 border-red-200',
  'Half Day': 'bg-amber-100 text-amber-700 border-amber-200',
  Leave: 'bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20',
};

export default function PortalAttendance() {
  const [time, setTime] = useState<Date | null>(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [todayElapsed, setTodayElapsed] = useState('0h 0m');
  const [log, setLog] = useState<DayLog[]>(weekLog);
  const [storageKey, setStorageKey] = useState('yagwa_attendance_default');

  useEffect(() => {
    // Only run on client
    setTime(new Date());
    const tick = setInterval(() => {
      setTime(new Date());
    }, 1000);

    let email = 'default';
    const userSaved = localStorage.getItem('employee_user');
    if (userSaved) {
      try {
        const parsed = JSON.parse(userSaved);
        if (parsed.email) email = parsed.email;
      } catch (e) {
        console.error(e);
      }
    }
    const key = `yagwa_attendance_${email}`;
    setStorageKey(key);

    // Load state from localStorage
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setClockedIn(parsed.clockedIn || false);
        if (parsed.clockInTime) {
          setClockInTime(new Date(parsed.clockInTime));
        }
        if (parsed.log) {
          setLog(parsed.log);
        }
      } catch (e) {
        console.error('Failed to load attendance:', e);
      }
    }

    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!clockedIn || !clockInTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - clockInTime.getTime()) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      setTodayElapsed(`${h}h ${m}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [clockedIn, clockInTime]);

  const saveState = (isClockedIn: boolean, inTime: Date | null, currentLog: DayLog[]) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        clockedIn: isClockedIn,
        clockInTime: inTime ? inTime.toISOString() : null,
        log: currentLog,
      })
    );
  };

  const handleClockIn = () => {
    const now = new Date();
    setClockedIn(true);
    setClockInTime(now);

    const todayStr = now.toISOString().split('T')[0];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    const timeStr = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: false });

    let updatedLog = [...log];
    const index = log.findIndex((d) => d.date === todayStr);
    if (index >= 0) {
      updatedLog[index] = { ...updatedLog[index], clockIn: timeStr, status: 'Present' };
    } else {
      updatedLog = [
        { day: dayName, date: todayStr, clockIn: timeStr, clockOut: '—', hours: '0h 0m', status: 'Present' },
        ...log,
      ];
    }
    setLog(updatedLog);
    saveState(true, now, updatedLog);
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockedIn(false);

    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: false });

    let updatedLog = [...log];
    const index = log.findIndex((d) => d.date === todayStr);
    if (index >= 0 && clockInTime) {
      const diff = Math.floor((now.getTime() - clockInTime.getTime()) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      updatedLog[index] = {
        ...updatedLog[index],
        clockOut: timeStr,
        hours: `${h}h ${m}m`,
      };
    }
    setLog(updatedLog);
    saveState(false, null, updatedLog);
    setClockInTime(null);
    setTodayElapsed('0h 0m');
  };

  const totalWeekHours = log
    .filter((d) => d.status === 'Present')
    .reduce((acc, d) => {
      const [h, m] = d.hours.split(/h |m/).map(Number);
      return acc + h * 60 + m;
    }, 0);

  const weekHoursStr = `${Math.floor(totalWeekHours / 60)}h ${totalWeekHours % 60}m`;

  if (!time) return null; // SSR guard

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-bold text-[#1A1A2E]">Attendance</h3>
        <p className="text-sm text-[#5A6680]">Track your working hours</p>
      </div>

      {/* Clock widget + Today summary */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Clock In/Out Widget */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#07255A] to-[#1A56C4] rounded-2xl p-8 text-white flex flex-col items-center justify-center text-center min-h-[240px]">
          {/* Live clock */}
          <div className="text-6xl font-bold tracking-tight mb-1 font-mono tabular-nums">
            {time.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <p className="text-white/55 text-sm mb-6">
            {time.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          {/* Status badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${clockedIn ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/60'}`}>
            <div className={`w-2 h-2 rounded-full ${clockedIn ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`} />
            {clockedIn ? `Clocked In at ${clockInTime?.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}` : 'Not Clocked In'}
          </div>

          {/* Clock In/Out button */}
          {!clockedIn ? (
            <button
              onClick={handleClockIn}
              className="flex items-center gap-3 bg-[#F47B20] hover:bg-[#F99A50] text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-black/20"
            >
              <LogIn className="w-5 h-5" />
              Clock In
            </button>
          ) : (
            <button
              onClick={handleClockOut}
              className="flex items-center gap-3 bg-red-500/80 hover:bg-red-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-black/20"
            >
              <LogOut className="w-5 h-5" />
              Clock Out
            </button>
          )}
        </div>

        {/* Today's summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#0B3D91]/10 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#0B3D91]" />
              </div>
              <div>
                <p className="text-xs text-[#5A6680]">Today's Hours</p>
                <p className="font-bold text-[#1A1A2E]">{clockedIn ? todayElapsed : '0h 0m'}</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#0B3D91] rounded-full" style={{ width: clockedIn ? '45%' : '0%' }} />
            </div>
            <p className="text-[11px] text-[#5A6680] mt-1.5">Target: 8h 0m</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#F47B20]/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#F47B20]" />
              </div>
              <div>
                <p className="text-xs text-[#5A6680]">This Week</p>
                <p className="font-bold text-[#1A1A2E]">{weekHoursStr}</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#F47B20] rounded-full" style={{ width: `${Math.min(100, (totalWeekHours / 2400) * 100)}%` }} />
            </div>
            <p className="text-[11px] text-[#5A6680] mt-1.5">Target: 40h 0m</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-[#5A6680] mb-1">Days Present (Week)</p>
            <p className="text-2xl font-bold text-[#1A1A2E]">
              {log.filter((d) => d.status === 'Present').length}
              <span className="text-base text-[#5A6680] font-normal"> / {log.length}</span>
            </p>
            <div className="flex gap-1.5 mt-2">
              {log.map((d) => (
                <div
                  key={d.day}
                  title={d.day}
                  className={`flex-1 h-2 rounded-full ${d.status === 'Present' ? 'bg-green-400' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Log Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-semibold text-[#1A1A2E]">This Week's Log</h4>
          <span className="text-xs text-[#5A6680] bg-gray-100 px-3 py-1 rounded-full">
            July 15–19, 2024
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Day', 'Date', 'Clock In', 'Clock Out', 'Hours', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#5A6680] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {log.map((d) => (
                <tr key={d.day} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-[#1A1A2E]">{d.day}</td>
                  <td className="px-5 py-3 text-[#5A6680]">
                    {new Date(d.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-green-600 font-mono text-xs">{d.clockIn}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-red-500 font-mono text-xs">{d.clockOut}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#1A1A2E]">{d.hours}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
