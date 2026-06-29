import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YagwaTech Employee Portal',
  description: 'Internal employee portal for Yagwa Tech Solutions',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
