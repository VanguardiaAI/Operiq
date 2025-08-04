'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  Shield,
  Search,
  Filter,
  Clock,
  User,
  Car,
  MapPin,
  TrendingUp,
  AlertCircle,
  XCircle,
  Eye,
  ChevronRight,
} from 'lucide-react';

interface FraudAlert {
  id: string;
  type: 'inactivity' | 'route_deviation' | 'suspicious_cancellation' | 'fake_trips' | 'account_sharing' | 'time_manipulation';
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  driver: string;
  vehicle: string;
  platform: string;
  description: string;
  detectedAt: string;
  location?: string;
  financialImpact?: string;
  evidence: {
    type: string;
    value: string;
  }[];
}

const fraudAlerts: FraudAlert[] = [
  {
    id: '1',
    type: 'inactivity',
    severity: 'high',
    status: 'new',
    driver: 'Carlos Rodríguez',
    vehicle: 'MAD-4521-BC',
    platform: 'Uber',
    description: 'Vehículo inactivo durante horas pico con app abierta. Posible manipulación para cobrar bonificaciones.',
    detectedAt: '2024-06-15 14:30',
    location: 'Madrid Centro',
    financialImpact: '150,00 €',
    evidence: [
      { type: 'Tiempo inactivo', value: '3.5 horas' },
      { type: 'Bonificación reclamada', value: '150 €' },
      { type: 'Patrón detectado', value: '5 veces este mes' },
    ],
  },
  {
    id: '2',
    type: 'route_deviation',
    severity: 'medium',
    status: 'investigating',
    driver: 'Ana García',
    vehicle: 'MAD-7823-CD',
    platform: 'Cabify',
    description: 'Desviación significativa de ruta óptima sin justificación aparente.',
    detectedAt: '2024-06-15 11:15',
    location: 'Aeropuerto T4 - Centro',
    financialImpact: '25,00 €',
    evidence: [
      { type: 'Distancia extra', value: '8.3 km' },
      { type: 'Tiempo extra', value: '15 min' },
      { type: 'Costo adicional', value: '25 €' },
    ],
  },
  {
    id: '3',
    type: 'suspicious_cancellation',
    severity: 'high',
    status: 'new',
    driver: 'Miguel Fernández',
    vehicle: 'MAD-9012-EF',
    platform: 'Bolt',
    description: 'Patrón de cancelaciones después de aceptar viajes largos.',
    detectedAt: '2024-06-15 09:45',
    financialImpact: '320,00 €',
    evidence: [
      { type: 'Cancelaciones', value: '12 en 2 días' },
      { type: 'Viajes largos rechazados', value: '8' },
      { type: 'Pérdida estimada', value: '320 €' },
    ],
  },
  {
    id: '4',
    type: 'fake_trips',
    severity: 'high',
    status: 'new',
    driver: 'José López',
    vehicle: 'MAD-6789-IJ',
    platform: 'Uber',
    description: 'Viajes completados con patrones GPS anómalos. Posibles viajes falsos.',
    detectedAt: '2024-06-14 23:30',
    location: 'Múltiples ubicaciones',
    financialImpact: '450,00 €',
    evidence: [
      { type: 'Viajes sospechosos', value: '15' },
      { type: 'Velocidad promedio anómala', value: '120 km/h en ciudad' },
      { type: 'Monto fraudulento', value: '450 €' },
    ],
  },
  {
    id: '5',
    type: 'account_sharing',
    severity: 'medium',
    status: 'resolved',
    driver: 'Laura Martín',
    vehicle: 'MAD-3456-GH',
    platform: 'Cabify',
    description: 'Actividad simultánea detectada en múltiples ubicaciones.',
    detectedAt: '2024-06-14 18:00',
    evidence: [
      { type: 'Ubicaciones simultáneas', value: '2' },
      { type: 'Distancia entre puntos', value: '45 km' },
      { type: 'Tiempo de detección', value: '2 minutos' },
    ],
  },
];

const typeConfig = {
  inactivity: { label: 'Inactividad Sospechosa', icon: Clock, color: 'text-yellow-500' },
  route_deviation: { label: 'Desviación de Ruta', icon: MapPin, color: 'text-orange-500' },
  suspicious_cancellation: { label: 'Cancelaciones Sospechosas', icon: XCircle, color: 'text-red-500' },
  fake_trips: { label: 'Viajes Falsos', icon: AlertTriangle, color: 'text-red-600' },
  account_sharing: { label: 'Compartir Cuenta', icon: User, color: 'text-purple-500' },
  time_manipulation: { label: 'Manipulación de Tiempo', icon: Clock, color: 'text-pink-500' },
};

const severityConfig = {
  high: { label: 'Alta', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  medium: { label: 'Media', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  low: { label: 'Baja', color: 'text-green-500', bgColor: 'bg-green-500/10' },
};

const statusConfig = {
  new: { label: 'Nueva', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  investigating: { label: 'Investigando', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  resolved: { label: 'Resuelta', color: 'text-green-500', bgColor: 'bg-green-500/10' },
  dismissed: { label: 'Descartada', color: 'text-zinc-500', bgColor: 'bg-zinc-500/10' },
};

export default function FraudAlertsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'investigating' | 'resolved' | 'dismissed'>('all');

  const filteredAlerts = fraudAlerts.filter(alert => {
    const matchesSearch = alert.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const stats = {
    total: fraudAlerts.length,
    new: fraudAlerts.filter(a => a.status === 'new').length,
    high: fraudAlerts.filter(a => a.severity === 'high').length,
    totalImpact: fraudAlerts.reduce((acc, a) => {
      const amount = a.financialImpact ? parseFloat(a.financialImpact.replace(/[^0-9,]/g, '').replace(',', '.')) : 0;
      return acc + amount;
    }, 0),
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar alertas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-zinc-800 text-white placeholder-zinc-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="px-3 py-1.5 bg-black border border-zinc-800 text-white text-xs sm:text-sm"
            >
              <option value="all">Todas las severidades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'new' | 'investigating' | 'resolved')}
              className="px-3 py-1.5 bg-black border border-zinc-800 text-white text-xs sm:text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="new">Nueva</option>
              <option value="investigating">Investigando</option>
              <option value="resolved">Resuelta</option>
              <option value="dismissed">Descartada</option>
            </select>
          </div>
        </div>
        <Button variant="outline" className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Filtros avanzados</span>
          <span className="sm:hidden">Filtros</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Alertas Totales</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-zinc-600 mt-1">Últimos 30 días</p>
              </div>
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-600 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Nuevas Alertas</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-500">{stats.new}</p>
                <p className="text-xs text-zinc-600 mt-1">Requieren atención</p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Alta Prioridad</p>
                <p className="text-xl sm:text-2xl font-bold text-red-500">{stats.high}</p>
                <p className="text-xs text-zinc-600 mt-1">Críticas</p>
              </div>
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Impacto Financiero</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-500">{stats.totalImpact.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</p>
                <p className="text-xs text-zinc-600 mt-1">Pérdida potencial</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAlerts.map((alert) => {
          const type = typeConfig[alert.type];
          const TypeIcon = type.icon;
          const severity = severityConfig[alert.severity];
          const status = statusConfig[alert.status];

          return (
            <Card key={alert.id} className="bg-black border border-zinc-900/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    {/* Icon */}
                    <div className={`p-2 sm:p-3 bg-zinc-900/50`}>
                      <TypeIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${type.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-white">{type.label}</h3>
                            <div className={`px-2 py-0.5 ${severity.bgColor}`}>
                              <span className={`text-xs ${severity.color}`}>{severity.label}</span>
                            </div>
                            <div className={`px-2 py-0.5 ${status.bgColor}`}>
                              <span className={`text-xs ${status.color}`}>{status.label}</span>
                            </div>
                            <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-xs">
                              {alert.platform}
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">{alert.description}</p>
                        </div>
                        {alert.financialImpact && (
                          <div className="text-right">
                            <p className="text-xs text-zinc-500">Impacto</p>
                            <p className="text-lg font-semibold text-red-500">{alert.financialImpact}</p>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {alert.driver}
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {alert.vehicle}
                        </span>
                        {alert.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alert.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.detectedAt}
                        </span>
                      </div>

                      {/* Evidence */}
                      <div className="flex flex-wrap items-start gap-2 sm:gap-4 pt-3 border-t border-zinc-900/50">
                        <span className="text-xs text-zinc-500">Evidencia:</span>
                        {alert.evidence.map((ev, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-zinc-500">{ev.type}: </span>
                            <span className="text-white font-medium">{ev.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 w-full sm:w-auto">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex-1 sm:flex-initial"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Investigar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white text-xs flex-1 sm:flex-initial"
                        >
                          Ver detalles
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}