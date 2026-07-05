import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface Props {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} title={title} />
        <div className="p-4 sm:p-6 flex-1 overflow-x-hidden text-paper max-w-[1400px] w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
