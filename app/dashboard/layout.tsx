'use client';

import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';
import { MobileMenuProvider } from '@/contexts/mobile-menu-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is handled by middleware
  return (
    <MobileMenuProvider>
      <div className="flex h-screen bg-black relative">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-black">
            {children}
          </main>
        </div>
      </div>
    </MobileMenuProvider>
  );
}