'use client';

import { } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const pageInfo: { [key: string]: { title: string; subtitle: string } } = {
  '/dashboard': {
    title: 'Panel de Control',
    subtitle: 'Monitoreo de métricas y detección de fraudes',
  },
  '/dashboard/platforms': {
    title: 'Plataformas',
    subtitle: 'Gestión de conexiones con plataformas de transporte',
  },
  '/dashboard/vehicles': {
    title: 'Vehículos',
    subtitle: 'Gestión de flota de vehículos',
  },
  '/dashboard/drivers': {
    title: 'Conductores',
    subtitle: 'Gestión de conductores',
  },
  '/dashboard/finance': {
    title: 'Finanzas',
    subtitle: 'Control y análisis financiero de la flota',
  },
  '/dashboard/fraud-alerts': {
    title: 'Alertas de Fraude',
    subtitle: 'Detección y gestión de alertas',
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
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentPage = pageInfo[pathname] || pageInfo['/dashboard'];

  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-900/50 bg-black px-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">{currentPage.title}</h1>
        <span className="text-sm text-zinc-500">
          {currentPage.subtitle}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-yellow-500 text-xs font-medium bg-yellow-500/10 px-2 py-1">
          API Debug
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-800 text-white">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 text-white border-gray-800">
            <DropdownMenuItem className="hover:bg-gray-800">
              {session?.user?.email || 'admin@operiq.com'}
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800">Perfil</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800">Configuración</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}