'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Calendar,
  Car,
  DollarSign,
  FileSpreadsheet,
  File,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const performanceData = [
  { month: 'Ene', viajes: 4500, ingresos: 145000, conductores: 45 },
  { month: 'Feb', viajes: 5200, ingresos: 168000, conductores: 48 },
  { month: 'Mar', viajes: 4800, ingresos: 155000, conductores: 46 },
  { month: 'Abr', viajes: 5500, ingresos: 178000, conductores: 50 },
  { month: 'May', viajes: 5800, ingresos: 187000, conductores: 52 },
  { month: 'Jun', viajes: 6200, ingresos: 200000, conductores: 55 },
];

const platformComparison = [
  { platform: 'Uber', ingresos: 125000, viajes: 3200, conductores: 28 },
  { platform: 'Cabify', ingresos: 45000, viajes: 1500, conductores: 15 },
  { platform: 'Bolt', ingresos: 30000, viajes: 1500, conductores: 12 },
];

const efficiencyData = [
  { name: 'Muy Alta (>90%)', value: 15, color: '#10b981' },
  { name: 'Alta (80-90%)', value: 35, color: '#3b82f6' },
  { name: 'Media (70-80%)', value: 30, color: '#f59e0b' },
  { name: 'Baja (<70%)', value: 20, color: '#ef4444' },
];

const recentReports = [
  {
    id: '1',
    title: 'Informe Mensual - Junio 2024',
    type: 'monthly',
    status: 'completed',
    generatedAt: '2024-07-01 09:00',
    size: '2.4 MB',
    format: 'pdf',
  },
  {
    id: '2',
    title: 'Análisis de Fraudes Q2 2024',
    type: 'fraud',
    status: 'completed',
    generatedAt: '2024-06-30 15:30',
    size: '1.8 MB',
    format: 'pdf',
  },
  {
    id: '3',
    title: 'Rendimiento de Conductores',
    type: 'drivers',
    status: 'processing',
    generatedAt: '2024-06-29 11:15',
    size: '-',
    format: 'xlsx',
  },
  {
    id: '4',
    title: 'Comparativa de Plataformas',
    type: 'platforms',
    status: 'completed',
    generatedAt: '2024-06-28 14:20',
    size: '3.1 MB',
    format: 'pdf',
  },
];

const reportTypes = [
  {
    id: 'financial',
    title: 'Informe Financiero',
    description: 'Análisis completo de ingresos, gastos y rentabilidad',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'operations',
    title: 'Informe Operacional',
    description: 'Métricas de flota, conductores y eficiencia',
    icon: Car,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'fraud',
    title: 'Informe de Fraudes',
    description: 'Detección y análisis de actividades sospechosas',
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'custom',
    title: 'Informe Personalizado',
    description: 'Crea un informe con métricas específicas',
    icon: FileText,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white'}
            >
              {period === 'week' && 'Semana'}
              {period === 'month' && 'Mes'}
              {period === 'quarter' && 'Trimestre'}
              {period === 'year' && 'Año'}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white">
            <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
            Último mes
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Exportar Todo</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card 
              key={report.id} 
              className={`bg-black border border-zinc-900/50 cursor-pointer transition-all hover:border-zinc-700 ${
                selectedReport === report.id ? 'border-blue-500' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className={`inline-flex p-2 sm:p-3 ${report.bgColor}`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${report.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">{report.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 hidden sm:block">{report.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                  >
                    Generar
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Performance Chart */}
        <Card className="bg-black border border-zinc-900/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-base sm:text-lg font-medium">Rendimiento General</CardTitle>
            <p className="text-xs text-zinc-500">Evolución de métricas clave</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={200}>
              <RechartsLineChart data={performanceData}>
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
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
                  labelStyle={{ color: '#71717a' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="viajes" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="conductores" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Comparison */}
        <Card className="bg-black border border-zinc-900/50">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-base sm:text-lg font-medium">Comparativa de Plataformas</CardTitle>
            <p className="text-xs text-zinc-500">Rendimiento por plataforma</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={platformComparison}>
                <CartesianGrid strokeDasharray="0" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="platform" 
                  stroke="#71717a" 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                  axisLine={{ stroke: '#27272a' }} 
                />
                <YAxis 
                  stroke="#71717a" 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                  axisLine={{ stroke: '#27272a' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
                  labelStyle={{ color: '#71717a' }}
                />
                <Bar dataKey="ingresos" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="viajes" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Distribution */}
      <Card className="bg-black border border-zinc-900/50">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-base sm:text-lg font-medium">Distribución de Eficiencia</CardTitle>
          <p className="text-xs text-zinc-500">Conductores por nivel de rendimiento</p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
                  labelStyle={{ color: '#71717a' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {efficiencyData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-zinc-400">{item.name}</span>
                  </div>
                  <span className="text-sm text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-black border border-zinc-900/50">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-6">
          <div>
            <CardTitle className="text-white text-base sm:text-lg font-medium">Informes Recientes</CardTitle>
            <p className="text-xs text-zinc-500">Últimos informes generados</p>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white">
            Ver todos
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-zinc-900/50 gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  {report.format === 'pdf' ? (
                    <div className="bg-red-500/10 p-2">
                      <File className="h-6 w-6 text-red-500" />
                    </div>
                  ) : (
                    <div className="bg-green-500/10 p-2">
                      <FileSpreadsheet className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white">{report.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-zinc-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {report.generatedAt}
                      </span>
                      <span className="text-xs text-zinc-500">{report.size}</span>
                      {report.status === 'completed' ? (
                        <Badge variant="outline" className="border-green-500/50 text-green-500 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Procesando
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                    disabled={report.status !== 'completed'}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}