'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Plus,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Car,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  MapPin,
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  status: 'online' | 'offline' | 'busy';
  platforms: string[];
  vehicle: string;
  totalTrips: number;
  monthlyRevenue: string;
  hoursWorked: number;
  efficiency: number;
  lastActivity: string;
  location: string;
  joinDate: string;
  documents: {
    license: boolean;
    insurance: boolean;
    background: boolean;
  };
}

const drivers: Driver[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+34 612 345 678',
    rating: 4.8,
    status: 'online',
    platforms: ['Uber', 'Cabify'],
    vehicle: 'MAD-4521-BC',
    totalTrips: 1234,
    monthlyRevenue: '3.450,00 €',
    hoursWorked: 186,
    efficiency: 92,
    lastActivity: 'En línea',
    location: 'Madrid Centro',
    joinDate: '2022-03-15',
    documents: { license: true, insurance: true, background: true },
  },
  {
    id: '2',
    name: 'Ana García',
    email: 'ana.garcia@email.com',
    phone: '+34 623 456 789',
    rating: 4.9,
    status: 'busy',
    platforms: ['Bolt'],
    vehicle: 'MAD-7823-CD',
    totalTrips: 987,
    monthlyRevenue: '2.890,00 €',
    hoursWorked: 162,
    efficiency: 88,
    lastActivity: 'En viaje',
    location: 'Aeropuerto T4',
    joinDate: '2023-01-10',
    documents: { license: true, insurance: true, background: true },
  },
  {
    id: '3',
    name: 'Miguel Fernández',
    email: 'miguel.fernandez@email.com',
    phone: '+34 634 567 890',
    rating: 4.6,
    status: 'offline',
    platforms: ['Uber'],
    vehicle: 'MAD-9012-EF',
    totalTrips: 2156,
    monthlyRevenue: '3.200,00 €',
    hoursWorked: 174,
    efficiency: 85,
    lastActivity: 'Hace 2 horas',
    location: 'Última: Atocha',
    joinDate: '2021-11-20',
    documents: { license: true, insurance: false, background: true },
  },
  {
    id: '4',
    name: 'Laura Martín',
    email: 'laura.martin@email.com',
    phone: '+34 645 678 901',
    rating: 4.7,
    status: 'offline',
    platforms: ['Cabify', 'Uber'],
    vehicle: 'MAD-3456-GH',
    totalTrips: 1567,
    monthlyRevenue: '2.100,00 €',
    hoursWorked: 145,
    efficiency: 78,
    lastActivity: 'Hace 5 días',
    location: 'Última: Sol',
    joinDate: '2022-07-05',
    documents: { license: true, insurance: true, background: true },
  },
  {
    id: '5',
    name: 'José López',
    email: 'jose.lopez@email.com',
    phone: '+34 656 789 012',
    rating: 4.5,
    status: 'online',
    platforms: ['Uber'],
    vehicle: 'MAD-6789-IJ',
    totalTrips: 3421,
    monthlyRevenue: '4.100,00 €',
    hoursWorked: 210,
    efficiency: 90,
    lastActivity: 'En línea',
    location: 'Gran Vía',
    joinDate: '2020-05-12',
    documents: { license: true, insurance: true, background: true },
  },
];

const statusConfig = {
  online: {
    label: 'En línea',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: CheckCircle,
  },
  offline: {
    label: 'Desconectado',
    color: 'text-zinc-500',
    bgColor: 'bg-zinc-500/10',
    icon: XCircle,
  },
  busy: {
    label: 'En viaje',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: Car,
  },
};

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'busy'>('all');

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: drivers.length,
    online: drivers.filter(d => d.status === 'online').length,
    offline: drivers.filter(d => d.status === 'offline').length,
    busy: drivers.filter(d => d.status === 'busy').length,
    avgRating: (drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1),
    totalRevenue: drivers.reduce((acc, d) => acc + parseFloat(d.monthlyRevenue.replace(/[^0-9,]/g, '').replace(',', '.')), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-zinc-800 text-white placeholder-zinc-500"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'online', 'offline', 'busy'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}
              >
                {status === 'all' ? 'Todos' : statusConfig[status as keyof typeof statusConfig].label}
                {status === 'all' && <span className="ml-2 text-xs">({stats.total})</span>}
                {status !== 'all' && <span className="ml-2 text-xs">({stats[status]})</span>}
              </Button>
            ))}
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Conductor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Total Conductores</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-zinc-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">En línea</p>
                <p className="text-2xl font-bold text-green-500">{stats.online}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">En viaje</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.busy}</p>
              </div>
              <Car className="h-8 w-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Rating Promedio</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.avgRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Ingresos Totales</p>
                <p className="text-xl font-bold text-green-500">{stats.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.map((driver) => {
          const status = statusConfig[driver.status];
          const StatusIcon = status.icon;

          return (
            <Card key={driver.id} className="bg-black border border-zinc-900/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-zinc-800 text-white">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{driver.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`px-2 py-0.5 ${status.bgColor} flex items-center gap-1`}>
                            <StatusIcon className={`h-3 w-3 ${status.color}`} />
                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-white">{driver.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Platforms */}
                  <div className="flex gap-2">
                    {driver.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="border-zinc-800 text-zinc-400 text-xs">
                        {platform}
                      </Badge>
                    ))}
                    <span className="text-xs text-zinc-600">• {driver.vehicle}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-zinc-500">Viajes (mes)</p>
                      <p className="text-sm font-semibold text-white">{driver.totalTrips}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Ingresos</p>
                      <p className="text-sm font-semibold text-green-500">{driver.monthlyRevenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Horas trabajadas</p>
                      <p className="text-sm font-semibold text-white">{driver.hoursWorked}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Eficiencia</p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-semibold text-white">{driver.efficiency}%</p>
                        {driver.efficiency > 85 ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location & Activity */}
                  <div className="pt-3 border-t border-zinc-900/50 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <MapPin className="h-3 w-3" />
                      <span>{driver.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="h-3 w-3" />
                      <span>{driver.lastActivity}</span>
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div className="flex items-center gap-3 pt-3 border-t border-zinc-900/50">
                    <span className="text-xs text-zinc-500">Documentos:</span>
                    <div className="flex items-center gap-2">
                      {driver.documents.license ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                      {driver.documents.insurance ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                      {driver.documents.background ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
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