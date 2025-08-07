'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
  Phone,
  Mail,
  Banknote,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Driver {
  _id: string;
  driverUuid: string;
  partnerUuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: 'active' | 'inactive' | 'suspended' | 'deactivated';
  hasCashPayment: boolean;
  suspensionReason?: string;
  companyId: number;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface DriverStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  deactivated: number;
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
    icon: AlertCircle,
  },
  deactivated: {
    label: 'Desactivado',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: XCircle,
  },
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended' | 'deactivated'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchDrivers = async (sync = false) => {
    try {
      if (sync) setSyncing(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        state: filterStatus === 'all' ? '' : filterStatus,
        search: searchTerm,
        sync: sync.toString(),
      });
      
      const response = await fetch(`/api/drivers?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setDrivers(data.data.drivers);
        setTotalPages(data.data.totalPages);
        
        if (sync) {
          toast({
            title: 'Sincronización completada',
            description: 'Los conductores han sido actualizados desde Bolt',
          });
        }
      } else {
        throw new Error(data.error || 'Error al cargar conductores');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'No se pudieron cargar los conductores',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus, searchTerm]);

  const stats: DriverStats = {
    total: drivers.length,
    active: drivers.filter(d => d.state === 'active').length,
    inactive: drivers.filter(d => d.state === 'inactive').length,
    suspended: drivers.filter(d => d.state === 'suspended').length,
    deactivated: drivers.filter(d => d.state === 'deactivated').length,
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const cleanSuspensionReason = (reason: string | undefined) => {
    if (!reason) return '';
    
    // Remove HTML tags and decode entities
    const text = reason
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    // Handle specific message patterns
    if (text.includes('Account deactivated by fleet')) {
      return 'Cuenta desactivada por la flota';
    }
    
    if (text.includes('You are missing some required documents')) {
      return 'Faltan documentos requeridos';
    }
    
    if (text.includes('One of your documents have been expired')) {
      return 'Uno o más documentos han expirado';
    }
    
    if (text.includes('temporarily suspended due to potentially dangerous or harmful on-trip conduct')) {
      const blockMatch = text.match(/blocked until (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
      if (blockMatch) {
        return `Suspendido temporalmente por conducta peligrosa hasta ${blockMatch[1]}`;
      }
      return 'Suspendido temporalmente por conducta peligrosa';
    }
    
    if (text.includes('You temporarily cannot go online')) {
      return 'No puede conectarse temporalmente';
    }
    
    // Default: return cleaned text
    return text.split('.')[0]; // Just the first sentence
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
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-zinc-900/50 text-white placeholder-zinc-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(['all', 'active', 'inactive', 'suspended', 'deactivated'] as const).map((status) => (
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
            onClick={() => fetchDrivers(true)} 
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
                <p className="text-xs text-zinc-500">Total Conductores</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500/50 hidden sm:block" />
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
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drivers List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-zinc-500" />
        </div>
      ) : drivers.length === 0 ? (
        <Card className="bg-black border border-zinc-900/50 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-zinc-500">No se encontraron conductores</p>
            <Button 
              onClick={() => fetchDrivers(true)} 
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Sincronizar con Bolt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {drivers.map((driver) => {
            const status = statusConfig[driver.state];
            const StatusIcon = status.icon;

            return (
              <Card key={driver._id} className="bg-black border border-zinc-900/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      {/* Driver Avatar */}
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                        <AvatarFallback className="bg-[#232c43] text-white">
                          {getInitials(driver.firstName, driver.lastName)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Driver Info */}
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-semibold text-white">
                            {driver.firstName} {driver.lastName}
                          </h3>
                          <div className={`px-2 py-1 ${status.bgColor} flex items-center gap-1`}>
                            <StatusIcon className={`h-3 w-3 ${status.color}`} />
                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                          </div>
                          <Badge variant="outline" className="border-zinc-900/50 text-zinc-500">
                            Bolt
                          </Badge>
                          {driver.hasCashPayment && (
                            <Badge variant="outline" className="border-green-900/50 text-green-500">
                              <Banknote className="h-3 w-3 mr-1" />
                              Efectivo
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {driver.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {driver.phone}
                          </span>
                        </div>
                        {driver.suspensionReason && (
                          <p className="text-xs text-yellow-500 mt-1">
                            Razón: {cleanSuspensionReason(driver.suspensionReason)}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Actualizado {getRelativeTime(driver.lastSyncedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Actions */}
                    <div className="flex items-center gap-2">
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