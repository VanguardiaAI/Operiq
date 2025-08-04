'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Car,
  Search,
  Plus,
  MapPin,
  Fuel,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  MoreVertical,
} from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: number;
  driver: string;
  status: 'active' | 'inactive' | 'maintenance';
  platform: string[];
  lastLocation: string;
  fuelLevel: number;
  mileage: number;
  revenue: string;
  efficiency: number;
  lastActivity: string;
}

const vehicles: Vehicle[] = [
  {
    id: '1',
    plate: 'MAD-4521-BC',
    model: 'Toyota Prius',
    year: 2022,
    driver: 'Carlos Rodríguez',
    status: 'active',
    platform: ['Uber', 'Cabify'],
    lastLocation: 'Madrid Centro',
    fuelLevel: 75,
    mileage: 45320,
    revenue: '2.450,00 €',
    efficiency: 92,
    lastActivity: 'Hace 15 min',
  },
  {
    id: '2',
    plate: 'MAD-7823-CD',
    model: 'Nissan Leaf',
    year: 2023,
    driver: 'Ana García',
    status: 'active',
    platform: ['Bolt'],
    lastLocation: 'Aeropuerto T4',
    fuelLevel: 60,
    mileage: 23100,
    revenue: '1.890,00 €',
    efficiency: 88,
    lastActivity: 'Hace 2 horas',
  },
  {
    id: '3',
    plate: 'MAD-9012-EF',
    model: 'Tesla Model 3',
    year: 2023,
    driver: 'Miguel Fernández',
    status: 'maintenance',
    platform: ['Uber'],
    lastLocation: 'Taller Oficial',
    fuelLevel: 45,
    mileage: 67890,
    revenue: '3.200,00 €',
    efficiency: 95,
    lastActivity: 'Hace 2 días',
  },
  {
    id: '4',
    plate: 'MAD-3456-GH',
    model: 'Hyundai Ioniq',
    year: 2022,
    driver: 'Laura Martín',
    status: 'inactive',
    platform: ['Cabify', 'Uber'],
    lastLocation: 'Parking Norte',
    fuelLevel: 90,
    mileage: 34567,
    revenue: '980,00 €',
    efficiency: 78,
    lastActivity: 'Hace 5 días',
  },
  {
    id: '5',
    plate: 'MAD-6789-IJ',
    model: 'Kia Niro',
    year: 2021,
    driver: 'José López',
    status: 'active',
    platform: ['Uber'],
    lastLocation: 'Gran Vía',
    fuelLevel: 55,
    mileage: 89012,
    revenue: '2.780,00 €',
    efficiency: 85,
    lastActivity: 'En línea',
  },
];

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
  maintenance: {
    label: 'Mantenimiento',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: AlertTriangle,
  },
};

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'maintenance'>('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    inactive: vehicles.filter(v => v.status === 'inactive').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    avgEfficiency: Math.round(vehicles.reduce((acc, v) => acc + v.efficiency, 0) / vehicles.length),
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar por matrícula, modelo o conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-zinc-800 text-white placeholder-zinc-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(['all', 'active', 'inactive', 'maintenance'] as const).map((status) => (
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Añadir Vehículo</span>
          <span className="sm:hidden">Añadir</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Total Vehículos</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-600 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
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
        <Card className="bg-black border border-zinc-900/50">
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
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Mantenimiento</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-500">{stats.maintenance}</p>
              </div>
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black border border-zinc-900/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Eficiencia Media</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-500">{stats.avgEfficiency}%</p>
              </div>
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500/50 hidden sm:block" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredVehicles.map((vehicle) => {
          const status = statusConfig[vehicle.status];
          const StatusIcon = status.icon;

          return (
            <Card key={vehicle.id} className="bg-black border border-zinc-900/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                    {/* Vehicle Icon */}
                    <div className="bg-zinc-900/50 p-3 sm:p-4">
                      <Car className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400" />
                    </div>

                    {/* Vehicle Info */}
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-base sm:text-lg font-semibold text-white">{vehicle.plate}</h3>
                        <div className={`px-2 py-1 ${status.bgColor} flex items-center gap-1`}>
                          <StatusIcon className={`h-3 w-3 ${status.color}`} />
                          <span className={`text-xs ${status.color}`}>{status.label}</span>
                        </div>
                        {vehicle.platform.map((platform) => (
                          <Badge key={platform} variant="outline" className="border-zinc-800 text-zinc-400">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500">
                        {vehicle.model} ({vehicle.year}) • {vehicle.driver}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-zinc-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {vehicle.lastLocation}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {vehicle.lastActivity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Fuel className="h-3 w-3" />
                          {vehicle.fuelLevel}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Metrics */}
                  <div className="grid grid-cols-3 sm:flex sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-zinc-500">Kilometraje</p>
                      <p className="text-sm sm:text-lg font-semibold text-white">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-zinc-500">Ingresos</p>
                      <p className="text-sm sm:text-lg font-semibold text-green-500">{vehicle.revenue}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-zinc-500">Eficiencia</p>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <p className="text-sm sm:text-lg font-semibold text-white">{vehicle.efficiency}%</p>
                        {vehicle.efficiency > 85 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <Activity className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hidden sm:flex">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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