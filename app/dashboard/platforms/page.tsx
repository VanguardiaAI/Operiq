'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Settings, 
  Plus, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  vehicles: number;
  drivers: number;
  lastSync: string;
  status: 'connected' | 'pending' | 'disconnected';
  logo?: string;
}

const platforms: Platform[] = [
  {
    id: '1',
    name: 'Uber',
    vehicles: 3,
    drivers: 4,
    lastSync: 'Hace 5 minutos',
    status: 'connected',
  },
  {
    id: '2',
    name: 'Bolt',
    vehicles: 2,
    drivers: 3,
    lastSync: 'Hace 30 minutos',
    status: 'connected',
  },
  {
    id: '3',
    name: 'Webfleet',
    vehicles: 0,
    drivers: 0,
    lastSync: 'No disponible',
    status: 'pending',
  },
];

const statusConfig = {
  connected: {
    label: 'Conectado',
    icon: CheckCircle,
    className: 'text-green-400',
    dotClassName: 'bg-green-400',
  },
  pending: {
    label: 'Pendiente',
    icon: AlertCircle,
    className: 'text-yellow-400',
    dotClassName: 'bg-yellow-400',
  },
  disconnected: {
    label: 'Desconectado',
    icon: XCircle,
    className: 'text-red-400',
    dotClassName: 'bg-red-400',
  },
};

export default function PlatformsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Plataformas</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Gestión de conexiones con plataformas de transporte
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => {
          const statusInfo = statusConfig[platform.status];
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={platform.id} className="bg-black border border-zinc-900/50">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {platform.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500">
                      {platform.vehicles} vehículos · {platform.drivers} conductores
                    </p>
                  </div>
                  <div className="bg-zinc-900/50 p-2 sm:p-3">
                    <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Última sincronización:</span>
                  <span className="text-zinc-300 text-xs sm:text-sm">{platform.lastSync}</span>
                </div>

                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${statusInfo.className}`} />
                  <span className="text-xs sm:text-sm text-zinc-500">Estado:</span>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 ${statusInfo.dotClassName}`} />
                    <span className={`text-xs sm:text-sm ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Configurar
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Add New Platform Card */}
        <Card className="bg-transparent border-2 border-dashed border-zinc-900/50 hover:border-zinc-800 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[280px] space-y-3">
            <div className="bg-zinc-900/50 p-2 sm:p-3 rounded-full border border-zinc-800">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-500" />
            </div>
            <span className="text-zinc-500 font-medium text-sm sm:text-base">
              Añadir nueva plataforma
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}