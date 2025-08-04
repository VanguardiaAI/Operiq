'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/stat-card';
import { DollarSign, Car, Users, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const financialData = [
  { month: 'Enero', ingresos: 5000, gastos: 3500, beneficio: 1500 },
  { month: 'Febrero', ingresos: 5200, gastos: 3800, beneficio: 1400 },
  { month: 'Marzo', ingresos: 4800, gastos: 3600, beneficio: 1200 },
  { month: 'Abril', ingresos: 6000, gastos: 4200, beneficio: 1800 },
  { month: 'Mayo', ingresos: 5800, gastos: 4000, beneficio: 1800 },
  { month: 'Junio', ingresos: 6500, gastos: 4300, beneficio: 2200 },
];

const platformData = [
  { name: 'Uber', value: 65, color: '#3b82f6' },
  { name: 'Cabify', value: 25, color: '#ec4899' },
  { name: 'Otros', value: 10, color: '#71717a' },
];

const fleetPerformance = [
  { vehicle: 'VEH001', efficiency: 95 },
  { vehicle: 'VEH002', efficiency: 88 },
  { vehicle: 'VEH003', efficiency: 92 },
  { vehicle: 'VEH004', efficiency: 78 },
  { vehicle: 'VEH005', efficiency: 90 },
];

const fraudAlerts = [
  {
    id: 1,
    type: 'Inactividad sospechosa',
    vehicle: 'VEH002 - Carlos Rodríguez',
    description: 'Vehículo inactivo durante horas pico con app abierta',
    timestamp: '2024-06-15',
    severity: 'high',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          value="32.800,00 €"
          icon={<DollarSign className="h-8 w-8" />}
          trend={{ value: '+12% vs mes anterior', isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Gastos Operativos"
          value="23.000,00 €"
          icon={<DollarSign className="h-8 w-8" />}
          trend={{ value: '-5% vs mes anterior', isPositive: false }}
          variant="danger"
        />
        <StatCard
          title="Flota Total"
          value="5 vehículos"
          icon={<Car className="h-8 w-8" />}
          trend={{ value: '+1 este mes', isPositive: true }}
          variant="info"
        />
        <StatCard
          title="Conductores Activos"
          value="7"
          icon={<Users className="h-8 w-8" />}
          trend={{ value: '+2 este mes', isPositive: true }}
          variant="success"
        />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-black border border-zinc-900/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-base sm:text-lg font-medium">Rendimiento Financiero</CardTitle>
            <p className="text-xs text-zinc-500">
              Ingresos vs Gastos en los últimos 6 meses
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="0" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: '#27272a' }} />
                <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: '#27272a' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
                  labelStyle={{ color: '#71717a' }}
                />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gastos"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="beneficio"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-black border border-zinc-900/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-base sm:text-lg font-medium">Distribución por Plataforma</CardTitle>
            <p className="text-xs text-zinc-500">
              Porcentaje de ingresos por plataforma
            </p>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
                  labelStyle={{ color: '#71717a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-black border border-zinc-900/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-base sm:text-lg font-medium">Rendimiento de la Flota</CardTitle>
            <p className="text-xs text-zinc-500">
              Eficiencia de cada vehículo (0-100%)
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fleetPerformance}>
                <CartesianGrid strokeDasharray="0" stroke="#27272a" vertical={false} />
                <XAxis dataKey="vehicle" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: '#27272a' }} />
                <YAxis stroke="#71717a" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: '#27272a' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
                  labelStyle={{ color: '#71717a' }}
                />
                <Bar dataKey="efficiency" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-black border border-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <div>
              <CardTitle className="text-white text-base sm:text-lg font-medium">Alertas de Fraude</CardTitle>
              <p className="text-xs text-zinc-500">
                Últimas alertas detectadas por IA
              </p>
            </div>
            <div className="bg-yellow-500/10 p-1.5 sm:p-2">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {fraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border border-zinc-900/50 bg-zinc-900/20 p-3 sm:p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 bg-red-500" />
                          <span className="text-xs text-red-500">{alert.type}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white">{alert.vehicle}</p>
                      <p className="text-xs text-gray-400">
                        {alert.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}