'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Car,
  Search,
  MapPin,
  Fuel,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Vehicle {
  _id: string;
  boltId: number;
  uuid: string;
  model: string;
  year: number;
  regNumber: string;
  state: 'active' | 'inactive' | 'suspended';
  suspensionReason?: string;
  companyId: number;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface VehicleStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

const statusConfig = {
  active: {
    label: 'Activo',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: CheckCircle,
  },
  inactive: {
    label: 'Inactivo',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: XCircle,
  },
  suspended: {
    label: 'Suspendido',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: AlertTriangle,
  },
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchVehicles = async (sync = false) => {
    try {
      if (sync) setSyncing(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        state: filterStatus === 'all' ? '' : filterStatus,
        search: searchTerm,
        sync: sync.toString(),
      });
      
      const response = await fetch(`/api/vehicles?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setVehicles(data.data.vehicles);
        setTotalPages(data.data.totalPages);
        
        if (sync) {
          toast({
            title: 'Sincronización completada',
            description: 'Los vehículos han sido actualizados desde Bolt',
          });
        }
      } else {
        throw new Error(data.error || 'Error al cargar vehículos');
      }
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron cargar los vehículos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, filterStatus, searchTerm]);

  const stats: VehicleStats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.state === 'active').length,
    inactive: vehicles.filter(v => v.state === 'inactive').length,
    suspended: vehicles.filter(v => v.state === 'suspended').length,
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} horas`;
    return `Hace ${days} días`;
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar por matrícula o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-zinc-900/50 text-white placeholder-zinc-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(['all', 'active', 'inactive', 'suspended'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600 font-semibold'
                  : 'bg-[#232c43] border-0 text-white hover:bg-[#232c43]/80'}
              >
                {status === 'all' ? 'Todos' : statusConfig[status as keyof typeof statusConfig].label}
                {status === 'all' && <span className="ml-2 text-xs">({stats.total})</span>}
                {status !== 'all' && <span className="ml-2 text-xs">({stats[status]})</span>}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => fetchVehicles(true)} 
            disabled={syncing}
            className="bg-[#232c43] hover:bg-[#232c43]/80 text-white border-0"
          >
            <RefreshCw className={`h-4 w-4 mr-1 sm:mr-2 ${syncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sincronizar</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
        <Card className="bg-black border border-zinc-900/50 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Total Vehículos</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Activos</p>
                <p className="text-xl sm:text-2xl font-bold text-green-500">{stats.active}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Inactivos</p>
                <p className="text-xl sm:text-2xl font-bold text-red-500">{stats.inactive}</p>
              </div>
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Suspendidos</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.suspended}</p>
              </div>
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : vehicles.length === 0 ? (
        <Card className="bg-black border border-zinc-900/50 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <CardContent className="p-8 text-center">
            <Car className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-zinc-500">No se encontraron vehículos</p>
            <Button 
              onClick={() => fetchVehicles(true)} 
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Sincronizar con Bolt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {vehicles.map((vehicle) => {
            const status = statusConfig[vehicle.state];
            const StatusIcon = status.icon;

            return (
              <Card key={vehicle._id} className="bg-black border border-zinc-900/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                      {/* Vehicle Icon */}
                      <div className="bg-zinc-900/50 p-3 sm:p-4">
                        <Car className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                      </div>

                      {/* Vehicle Info */}
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-semibold text-white">{vehicle.regNumber}</h3>
                          <div className={`px-2 py-1 ${status.bgColor} flex items-center gap-1`}>
                            <StatusIcon className={`h-3 w-3 ${status.color}`} />
                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                          </div>
                          <Badge variant="outline" className="border-zinc-900/50 text-zinc-500">
                            Bolt
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-500">
                          {vehicle.model} ({vehicle.year})
                        </p>
                        {vehicle.suspensionReason && (
                          <p className="text-xs text-yellow-500 mt-1">
                            Razón: {vehicle.suspensionReason}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-zinc-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Actualizado {getRelativeTime(vehicle.lastSyncedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Metrics */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">ID Bolt</p>
                        <p className="text-sm font-semibold text-white">{vehicle.boltId}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-[#232c43] border-0 text-white hover:bg-[#232c43]/80"
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm text-zinc-500">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="bg-[#232c43] border-0 text-white hover:bg-[#232c43]/80"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}