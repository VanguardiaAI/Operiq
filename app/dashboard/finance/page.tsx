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
  Card,
  AreaChart,
  DonutChart,
  Title,
  Text,
  Flex,
  Metric,
  BadgeDelta,
  List,
  ListItem,
} from '@tremor/react';

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
        <Card className="bg-zinc-950 border-zinc-800 p-4 sm:p-6">
          <Text className="text-zinc-500">Ingresos Totales</Text>
          <Flex className="items-baseline gap-2 mt-2">
            <Metric className="text-white">162.800,00 €</Metric>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </Flex>
          <Flex className="mt-2">
            <BadgeDelta deltaType="increase" className="text-green-500">
              +12% vs periodo anterior
            </BadgeDelta>
          </Flex>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 p-4 sm:p-6">
          <Text className="text-zinc-500">Gastos Totales</Text>
          <Flex className="items-baseline gap-2 mt-2">
            <Metric className="text-white">121.000,00 €</Metric>
            <TrendingDown className="h-6 w-6 text-red-500" />
          </Flex>
          <Flex className="mt-2">
            <BadgeDelta deltaType="increase" className="text-red-500">
              +8% vs periodo anterior
            </BadgeDelta>
          </Flex>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 p-4 sm:p-6">
          <Text className="text-zinc-500">Balance Neto</Text>
          <Flex className="items-baseline gap-2 mt-2">
            <Metric className="text-white">41.800,00 €</Metric>
            <DollarSign className="h-6 w-6 text-blue-500" />
          </Flex>
          <Flex className="mt-2">
            <BadgeDelta deltaType="increase" className="text-green-500">
              +15% vs periodo anterior
            </BadgeDelta>
          </Flex>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 p-4 sm:p-6">
          <Text className="text-zinc-500">Rendimiento</Text>
          <Flex className="items-baseline gap-2 mt-2">
            <Metric className="text-white">26%</Metric>
            <Percent className="h-6 w-6 text-purple-500" />
          </Flex>
          <Flex className="mt-2">
            <BadgeDelta deltaType="increase" className="text-green-500">
              +2% vs periodo anterior
            </BadgeDelta>
          </Flex>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Evolution Chart */}
        <Card className="bg-zinc-950 border-zinc-800 p-4 sm:p-6">
          <Title className="text-white">Evolución Financiera</Title>
          <Text className="text-zinc-500">Ingresos, gastos y balance en los últimos 6 meses</Text>
          <AreaChart
            className="mt-4 h-72"
            data={evolutionData}
            index="month"
            categories={['ingresos', 'gastos', 'balance']}
            colors={['blue', 'rose', 'amber']}
            valueFormatter={(value) => `€${(value/1000).toFixed(0)}k`}
            yAxisWidth={60}
            showAnimation={true}
            showLegend={true}
            showGridLines={true}
            curveType="monotone"
          />
          <Flex className="mt-4 justify-between">
            <Flex className="items-center gap-2">
              <Text className="text-zinc-500">Tendencia positiva del 12.5% este semestre</Text>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </Flex>
            <Text className="text-zinc-600 text-xs">Enero - Junio 2024</Text>
          </Flex>
        </Card>

        {/* Expense Distribution */}
        <Card className="bg-zinc-950 border-zinc-800 p-4 sm:p-6">
          <Title className="text-white">Distribución de Gastos</Title>
          <Text className="text-zinc-500">Desglose por categorías</Text>
          <DonutChart
            className="mt-4 h-64"
            data={expenseDistribution}
            category="value"
            index="name"
            valueFormatter={(value) => `${value}%`}
            colors={['blue', 'violet', 'amber', 'emerald', 'cyan']}
            showAnimation={true}
            showTooltip={true}
            variant="donut"
          />
          <List className="mt-4">
            {expenseDistribution.map((item) => (
              <ListItem key={item.name} className="text-zinc-400">
                <Flex justifyContent="between" className="w-full">
                  <Text className="text-zinc-400">{item.name}: {item.value}%</Text>
                  <Text className="text-white font-medium">{item.amount}</Text>
                </Flex>
              </ListItem>
            ))}
          </List>
          <div className="mt-4 pt-4 border-t border-zinc-900/50">
            <Flex justifyContent="between">
              <Text className="text-zinc-500">Total gastos: 22.300,00 €</Text>
              <Text className="text-zinc-600 text-xs">Mayor gasto: Combustible</Text>
            </Flex>
          </div>
        </Card>
      </div>
    </div>
  );
}