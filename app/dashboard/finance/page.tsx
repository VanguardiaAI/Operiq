'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  Percent
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const evolutionData = [
  { month: 'Enero', ingresos: 28000, gastos: 18000, balance: 10000 },
  { month: 'Febrero', ingresos: 30000, gastos: 19000, balance: 11000 },
  { month: 'Marzo', ingresos: 29000, gastos: 20000, balance: 9000 },
  { month: 'Abril', ingresos: 31000, gastos: 19500, balance: 11500 },
  { month: 'Mayo', ingresos: 32000, gastos: 21000, balance: 11000 },
  { month: 'Junio', ingresos: 32800, gastos: 22300, balance: 10500 },
];

const expenseDistribution = [
  { name: 'Combustible', value: 38, amount: '8.436,00 €', color: '#3b82f6' },
  { name: 'Mantenimiento', value: 19, amount: '4.218,00 €', color: '#ec4899' },
  { name: 'Seguros', value: 17, amount: '3.774,00 €', color: '#f59e0b' },
  { name: 'Impuestos', value: 10, amount: '2.220,00 €', color: '#10b981' },
  { name: 'Comisiones', value: 16, amount: '3.552,00 €', color: '#8b5cf6' },
];

export default function FinancePage() {
  const [period, setPeriod] = useState<'mensual' | 'trimestral' | 'anual'>('mensual');

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={period === 'mensual' ? 'default' : 'outline'}
            onClick={() => setPeriod('mensual')}
            className={period === 'mensual' 
              ? 'bg-white text-black hover:bg-gray-100' 
              : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}
          >
            Mensual
          </Button>
          <Button
            variant={period === 'trimestral' ? 'default' : 'outline'}
            onClick={() => setPeriod('trimestral')}
            className={period === 'trimestral' 
              ? 'bg-white text-black hover:bg-gray-100' 
              : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}
          >
            Trimestral
          </Button>
          <Button
            variant={period === 'anual' ? 'default' : 'outline'}
            onClick={() => setPeriod('anual')}
            className={period === 'anual' 
              ? 'bg-white text-black hover:bg-gray-100' 
              : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}
          >
            Anual
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Último mes
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-black border border-zinc-900/50 p-6">
          <div className="space-y-3">
            <p className="text-sm font-normal text-zinc-500">Ingresos Totales</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">162.800,00 €</p>
              <div className="h-8 w-8 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs flex items-center gap-1 text-green-500">
              <span className="text-lg">↗</span>
              +12% vs periodo anterior
            </p>
          </div>
        </div>

        <div className="bg-black border border-zinc-900/50 p-6">
          <div className="space-y-3">
            <p className="text-sm font-normal text-zinc-500">Gastos Totales</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">121.000,00 €</p>
              <div className="h-8 w-8 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <p className="text-xs flex items-center gap-1 text-red-500">
              <span className="text-lg">↗</span>
              +8% vs periodo anterior
            </p>
          </div>
        </div>

        <div className="bg-black border border-zinc-900/50 p-6">
          <div className="space-y-3">
            <p className="text-sm font-normal text-zinc-500">Balance Neto</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">41.800,00 €</p>
              <div className="h-8 w-8 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs flex items-center gap-1 text-green-500">
              <span className="text-lg">↗</span>
              +15% vs periodo anterior
            </p>
          </div>
        </div>

        <div className="bg-black border border-zinc-900/50 p-6">
          <div className="space-y-3">
            <p className="text-sm font-normal text-zinc-500">Rendimiento</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">26%</p>
              <div className="h-8 w-8 flex items-center justify-center">
                <Percent className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs flex items-center gap-1 text-green-500">
              <span className="text-lg">↗</span>
              +2% vs periodo anterior
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evolution Chart */}
        <Card className="bg-black border border-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white text-lg font-medium">Evolución Financiera</CardTitle>
            <p className="text-xs text-zinc-500">
              Ingresos, gastos y balance en los últimos 6 meses
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolutionData}>
                <CartesianGrid strokeDasharray="0" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#71717a" 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                  axisLine={{ stroke: '#27272a' }} 
                />
                <YAxis 
                  stroke="#71717a" 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                  axisLine={{ stroke: '#27272a' }}
                  tickFormatter={(value) => `${value/1000}k€`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
                  labelStyle={{ color: '#71717a' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stackId="1"
                  stroke="transparent" 
                  fill="#f59e0b"
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="gastos" 
                  stackId="1"
                  stroke="transparent" 
                  fill="#ec4899"
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="ingresos" 
                  stackId="1"
                  stroke="transparent" 
                  fill="#3b82f6"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Tendencia positiva del 12.5% este semestre</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-xs text-zinc-600">Enero - Junio 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* Expense Distribution */}
        <Card className="bg-black border border-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white text-lg font-medium">Distribución de Gastos</CardTitle>
            <p className="text-xs text-zinc-500">
              Desglose por categorías
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
                    labelStyle={{ color: '#71717a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-4">
              {expenseDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-zinc-400">{item.name}: {item.value}%</span>
                  </div>
                  <span className="text-sm text-white font-medium">{item.amount}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-zinc-900/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">Total gastos: 22.300,00 €</span>
                <span className="text-xs text-zinc-600">Mayor gasto: Combustible</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}