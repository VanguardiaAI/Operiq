'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  Users,
  DollarSign,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  X,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMobileMenu } from '@/contexts/mobile-menu-context';
import { useEffect } from 'react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Plataformas',
    href: '/dashboard/platforms',
    icon: Globe,
  },
  {
    title: 'Vehículos',
    href: '/dashboard/vehicles',
    icon: Car,
  },
  {
    title: 'Conductores',
    href: '/dashboard/drivers',
    icon: Users,
  },
  {
    title: 'Finanzas',
    href: '/dashboard/finance',
    icon: DollarSign,
  },
  {
    title: 'Alertas de Fraude',
    href: '/dashboard/fraud-alerts',
    icon: AlertTriangle,
  },
  {
    title: 'Informes',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    title: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useMobileMenu();

  // Log the state for debugging
  useEffect(() => {
    console.log('Sidebar - isOpen state:', isOpen);
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-2 p-4 md:p-6 border-b border-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 md:p-2">
            <Car className="h-5 w-5 md:h-6 md:w-6 text-black" />
          </div>
          <span className="text-lg md:text-xl font-bold">OPERIQ</span>
        </div>
        <button
          type="button"
          className="md:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-zinc-900"
          onClick={close}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 p-3 md:p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => {
                    // Close mobile menu when clicking a link on mobile
                    if (window.innerWidth < 768) {
                      close();
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 md:py-2 transition-colors rounded-md',
                    isActive
                      ? 'bg-zinc-900/50 text-white border-l-2 border-blue-500'
                      : 'text-zinc-500 hover:bg-zinc-900/30 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="border-t border-gray-900 p-3 md:p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-500 hover:bg-gray-900 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Cerrar sesión</span>
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile, visible on md and up */}
      <aside className="hidden md:flex h-full w-64 flex-col bg-black text-white border-r border-zinc-900/50 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar and Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 md:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}>
        {/* Overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-300",
            isOpen ? "opacity-50" : "opacity-0"
          )}
          onClick={close}
        />
        
        {/* Sidebar */}
        <aside 
          className={cn(
            "absolute inset-y-0 left-0 w-64 bg-black text-white border-r border-zinc-900/50",
            "flex flex-col transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}