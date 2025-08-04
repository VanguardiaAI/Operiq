'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useMobileMenu } from '@/contexts/mobile-menu-context';

const pageInfo: { [key: string]: { title: string; subtitle: string } } = {
  '/dashboard': {
    title: 'Panel de Control',
    subtitle: 'Monitoreo y métricas',
  },
  '/dashboard/platforms': {
    title: 'Plataformas',
    subtitle: 'Gestión de conexiones',
  },
  '/dashboard/vehicles': {
    title: 'Vehículos',
    subtitle: 'Gestión de flota',
  },
  '/dashboard/drivers': {
    title: 'Conductores',
    subtitle: 'Gestión de conductores',
  },
  '/dashboard/finance': {
    title: 'Finanzas',
    subtitle: 'Control financiero',
  },
  '/dashboard/fraud-alerts': {
    title: 'Alertas',
    subtitle: 'Detección de fraudes',
  },
  '/dashboard/reports': {
    title: 'Informes',
    subtitle: 'Reportes y análisis',
  },
  '/dashboard/settings': {
    title: 'Configuración',
    subtitle: 'Ajustes del sistema',
  },
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggle, isOpen } = useMobileMenu();
  const currentPage = pageInfo[pathname] || pageInfo['/dashboard'];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked, current state:', isOpen);
    toggle();
  };

  return (
    <header className="flex h-14 md:h-20 items-center justify-between border-b border-zinc-900/50 bg-black px-3 md:px-6">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Hamburger Menu Button - Only visible on mobile */}
        <button
          type="button"
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-md hover:bg-zinc-900 transition-colors"
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
        
        {/* Page Title */}
        <div className="min-w-0">
          <h1 className="text-base md:text-2xl font-semibold text-white truncate">
            {currentPage.title}
          </h1>
          <span className="text-xs md:text-sm text-zinc-500 hidden sm:block">
            {currentPage.subtitle}
          </span>
        </div>
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-yellow-500 text-[10px] md:text-xs font-medium bg-yellow-500/10 px-1.5 md:px-2 py-0.5 md:py-1 hidden sm:block">
          DEMO
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-800 text-white text-xs">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 text-white border-gray-800 w-48">
            <DropdownMenuItem className="hover:bg-gray-800 text-xs md:text-sm">
              admin@operiq.com
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 text-xs md:text-sm">
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 text-xs md:text-sm">
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-gray-800 text-red-400 text-xs md:text-sm cursor-pointer"
              onClick={handleLogout}
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}