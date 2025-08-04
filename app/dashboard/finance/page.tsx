'use client';

import { useState } from 'react';
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
  Legend,
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
  { name: 'Combustible', value: 38, amount: '8.436,00 €' },
  { name: 'Mantenimiento', value: 19, amount: '4.218,00 €' },
  { name: 'Seguros', value: 17, amount: '3.774,00 €' },
  { name: 'Impuestos', value: 10, amount: '2.220,00 €' },
  { name: 'Comisiones', value: 16, amount: '3.552,00 €' },
];

export default function FinancePage() {
  const [period, setPeriod] = useState<'mensual' | 'trimestral' | 'anual'>('mensual');

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
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
        
        <div className="flex items-center gap-2 sm:gap-3">
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
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <p className="text-sm text-zinc-400">Ingresos Totales</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-white">162.800,00 €</h3>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">
              +12% vs periodo anterior
            </span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <p className="text-sm text-zinc-400">Gastos Totales</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-white">121.000,00 €</h3>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-medium">
              +8% vs periodo anterior
            </span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <p className="text-sm text-zinc-400">Balance Neto</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-white">41.800,00 €</h3>
            <DollarSign className="h-6 w-6 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">
              +15% vs periodo anterior
            </span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <p className="text-sm text-zinc-400">Rendimiento</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-bold text-white">26%</h3>
            <Percent className="h-6 w-6 text-purple-500" />
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">
              +2% vs periodo anterior
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Evolution Chart */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white">Evolución Financiera</h3>
          <p className="text-sm text-zinc-400 mt-1">Ingresos, gastos y balance en los últimos 6 meses</p>
          <ResponsiveContainer width="100%" height={288} className="mt-4">
            <AreaChart data={evolutionData}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="ingresos" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIngresos)"
                name="Ingresos"
              />
              <Area 
                type="monotone" 
                dataKey="gastos" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGastos)"
                name="Gastos"
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#f59e0b" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBalance)"
                name="Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-400">Tendencia positiva del 12.5% este semestre</p>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-zinc-500">Enero - Junio 2024</p>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white">Distribución de Gastos</h3>
          <p className="text-sm text-zinc-400 mt-1">Desglose por categorías</p>
          <ResponsiveContainer width="100%" height={256} className="mt-4">
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
                <Cell fill="#3b82f6" />
                <Cell fill="#8b5cf6" />
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
                <Cell fill="#06b6d4" />
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
            {expenseDistribution.map((item, index) => {
              const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#06b6d4'];
              return (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index] }}
                    />
                    <span className="text-zinc-400">{item.name}: {item.value}%</span>
                  </div>
                  <span className="text-white font-medium">{item.amount}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-900/50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-zinc-400">Total gastos: 22.300,00 €</p>
              <p className="text-xs text-zinc-500">Mayor gasto: Combustible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}