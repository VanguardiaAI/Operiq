'use client';

import StatCard from '@/components/dashboard/stat-card';
import { DollarSign, Car, Users, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
  { name: 'Uber', value: 65 },
  { name: 'Cabify', value: 25 },
  { name: 'Otros', value: 10 },
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
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white">Rendimiento Financiero</h3>
          <p className="text-sm text-zinc-400 mt-1">Ingresos vs Gastos en los últimos 6 meses</p>
          <ResponsiveContainer width="100%" height={288} className="mt-4">
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="month" 
                stroke="#a1a1aa" 
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
              />
              <YAxis 
                stroke="#a1a1aa" 
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                tickFormatter={(value) => `€${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: '#a1a1aa' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => `€${value.toLocaleString()}`}
              />
              <Legend 
                wrapperStyle={{ color: '#a1a1aa' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="ingresos" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Ingresos"
              />
              <Line 
                type="monotone" 
                dataKey="gastos" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
                name="Gastos"
              />
              <Line 
                type="monotone" 
                dataKey="beneficio" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
                name="Beneficio"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white">Distribución por Plataforma</h3>
          <p className="text-sm text-zinc-400 mt-1">Porcentaje de ingresos por plataforma</p>
          <ResponsiveContainer width="100%" height={288} className="mt-4">
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#8b5cf6" />
                <Cell fill="#64748b" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: '#a1a1aa' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-zinc-400">Uber</span>
              </div>
              <span className="text-white font-medium">65%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-500 rounded-full" />
                <span className="text-zinc-400">Cabify</span>
              </div>
              <span className="text-white font-medium">25%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-500 rounded-full" />
                <span className="text-zinc-400">Otros</span>
              </div>
              <span className="text-white font-medium">10%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white">Rendimiento de la Flota</h3>
          <p className="text-sm text-zinc-400 mt-1">Eficiencia de cada vehículo (0-100%)</p>
          <ResponsiveContainer width="100%" height={288} className="mt-4">
            <BarChart data={fleetPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis 
                dataKey="vehicle" 
                stroke="#a1a1aa" 
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
              />
              <YAxis 
                stroke="#a1a1aa" 
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: '#a1a1aa' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => `${value}%`}
              />
              <Bar 
                dataKey="efficiency" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Alertas de Fraude</h3>
              <p className="text-sm text-zinc-400 mt-1">Últimas alertas detectadas por IA</p>
            </div>
            <div className="bg-yellow-500/10 p-1.5 sm:p-2 rounded">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {fraudAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border border-zinc-900/50 bg-zinc-900/20 p-3 sm:p-4 rounded"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-red-500 rounded-full" />
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
        </div>
      </div>
    </div>
  );
}