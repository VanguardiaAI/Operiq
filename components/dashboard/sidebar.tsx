'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Car,
  Users,
  DollarSign,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Plataformas',
    href: '/dashboard/platforms',
    icon: Car,
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

  return (
    <div className="flex h-full w-64 flex-col bg-black text-white border-r border-zinc-900/50">
      <div className="flex items-center gap-2 p-6 border-b border-zinc-900/50">
        <div className="bg-white p-2">
          <Car className="h-6 w-6 text-black" />
        </div>
        <span className="text-xl font-bold">OperiqFleet</span>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 transition-colors',
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
      
      <div className="border-t border-gray-900 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-500 hover:bg-gray-900 hover:text-white"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Cerrar sesión</span>
        </Button>
      </div>
    </div>
  );
}