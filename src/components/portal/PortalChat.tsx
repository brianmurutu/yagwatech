'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageSquare, Search } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatarUrl: string;
}

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  department: string; // Used to store the unique conversation room key: [email1, email2].sort().join('_')
  createdAt: string;
}

const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];

export default function PortalChat() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [inputText, setInputText] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('Team Member');
  const [search, setSearch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch logged in user details from local storage
  useEffect(() => {
    const userSaved = localStorage.getItem('employee_user');
    if (userSaved) {
      try {
        const parsed = JSON.parse(userSaved);
        if (parsed.email) setUserEmail(parsed.email.toLowerCase().trim());
        if (parsed.fullName) setUserName(parsed.fullName);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch team directory list
  const loadTeam = async () => {
    try {
      const res = await fetch('/api/portal/team');
      const data = await res.json();
      if (data.success && data.team) {
        // Filter out currently logged in user
        const others = data.team.filter(
          (t: any) => t.email.toLowerCase().trim() !== userEmail
        );
        setTeam(others);
        // Default to first member if none selected
        if (others.length > 0 && !activeMember) {
          setActiveMember(others[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load team list:', e);
    }
  };

  // Fetch message log
  const loadMessages = async () => {
    try {
      const res = await fetch('/api/portal/chat');
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error('Failed to fetch chat logs:', e);
    }
  };

  // Initial load
  useEffect(() => {
    if (userEmail) {
      loadTeam();
    }
  }, [userEmail]);

  // Poll messages every 3 seconds
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages list or active member updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeMember]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMember || !userEmail) return;

    const messageText = inputText;
    setInputText('');
    setIsSending(true);

    // Construct unique Room Key for 1-to-1 conversation
    const roomKey = [userEmail, activeMember.email.toLowerCase().trim()].sort().join('_');

    try {
      const res = await fetch('/api/portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: userName,
          senderEmail: userEmail,
          message: messageText,
          department: roomKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (email: string) => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % avatarColors.length;
    return avatarColors[idx];
  };

  // Filter sidebar list by search term
  const filteredTeam = team.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase())
  );

  // Construct conversation room key
  const activeRoomKey = activeMember
    ? [userEmail, activeMember.email.toLowerCase().trim()].sort().join('_')
    : '';

  const activeMessages = messages.filter(
    (m) => m.department.toLowerCase() === activeRoomKey.toLowerCase()
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden h-[calc(100vh-180px)] min-h-[500px] flex">
      {/* Team Sidebar */}
      <div className="w-72 border-r border-gray-100 bg-slate-50 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0B3D91]" />
            <h3 className="font-bold text-[#1A1A2E] text-sm">Direct Messages</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team members..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white text-slate-700"
            />
          </div>
        </div>

        {/* Member list */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {filteredTeam.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No team members found
            </div>
          ) : (
            filteredTeam.map((member) => {
              const isActive = activeMember?.email === member.email;
              return (
                <button
                  key={member.id}
                  onClick={() => setActiveMember(member)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[#0B3D91] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-[#1A1A2E]'
                  }`}
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-9 h-9 rounded-xl object-cover shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className={`w-9 h-9 rounded-xl ${getAvatarColor(member.email)} text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0`}>
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-[#1A1A2E]'}`}>
                      {member.name}
                    </p>
                    <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                      {member.role}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeMember ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeMember.avatarUrl ? (
                  <img
                    src={activeMember.avatarUrl}
                    alt={activeMember.name}
                    className="w-10 h-10 rounded-xl object-cover shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-xl ${getAvatarColor(activeMember.email)} text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0`}>
                    {getInitials(activeMember.name)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-[#1A1A2E] text-sm leading-tight">{activeMember.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{activeMember.role} &middot; <span className="uppercase text-[9px] font-semibold text-slate-400">{activeMember.department}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white border border-slate-100 px-2.5 py-1.5 rounded-xl uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#F47B20]" />
                <span>1-to-1 Chat</span>
              </div>
            </div>

            {/* Message Log */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">
                    👋
                  </div>
                  <p className="text-sm font-semibold">Say hello to {activeMember.name.split(' ')[0]}!</p>
                  <p className="text-xs text-slate-400 font-medium">Send a direct message to start the conversation.</p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMe = msg.senderEmail.toLowerCase().trim() === userEmail;
                  return (
                    <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg ${getAvatarColor(msg.senderEmail)} text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0`}>
                        {getInitials(msg.senderName)}
                      </div>
                      <div className={`max-w-[75%] ${isMe ? 'items-end' : ''} flex flex-col`}>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-bold text-[#1A1A2E]">{msg.senderName}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe 
                            ? 'bg-[#0B3D91] text-white rounded-tr-none' 
                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60 shadow-sm'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-150 bg-slate-50/50 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type a message to ${activeMember.name.split(' ')[0]}...`}
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/25 focus:border-[#0B3D91]"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="bg-[#0B3D91] hover:bg-[#07255A] text-white px-4 py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
            <MessageSquare className="w-12 h-12 text-slate-300 animate-pulse" />
            <p className="font-semibold text-sm">Select a team member to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
