import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YagwaTech Admin',
  description: 'Admin portal for Yagwa Tech Solutions',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F7F9FC]">{children}</div>;
}
