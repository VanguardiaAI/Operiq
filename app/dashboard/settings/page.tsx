'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Bell,
  Link,
  Webhook,
  Globe,
  Mail,
  Phone,
  Building,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Trash2,
  Plus,
  Copy,
} from 'lucide-react';

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const configSections: ConfigSection[] = [
  {
    id: 'profile',
    title: 'Perfil de Empresa',
    description: 'Información básica de la organización',
    icon: Building,
    color: 'text-blue-500',
  },
  {
    id: 'platforms',
    title: 'Integraciones',
    description: 'Conexiones con plataformas externas',
    icon: Link,
    color: 'text-green-500',
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    description: 'Alertas y comunicaciones',
    icon: Bell,
    color: 'text-yellow-500',
  },
  {
    id: 'security',
    title: 'Seguridad',
    description: 'Autenticación y permisos',
    icon: Shield,
    color: 'text-red-500',
  },
  {
    id: 'api',
    title: 'API y Webhooks',
    description: 'Configuración de desarrolladores',
    icon: Webhook,
    color: 'text-purple-500',
  },
  {
    id: 'billing',
    title: 'Facturación',
    description: 'Plan y métodos de pago',
    icon: CreditCard,
    color: 'text-emerald-500',
  },
];

const platformIntegrations = [
  { name: 'Uber', status: 'connected', lastSync: 'Hace 5 minutos' },
  { name: 'Cabify', status: 'connected', lastSync: 'Hace 30 minutos' },
  { name: 'Bolt', status: 'disconnected', lastSync: 'No conectado' },
  { name: 'FreeNow', status: 'pending', lastSync: 'Configurando...' },
];

const apiKeys = [
  { id: '1', name: 'Production API Key', key: 'sk_live_...abc123', created: '2024-01-15', lastUsed: '2024-06-15' },
  { id: '2', name: 'Test API Key', key: 'sk_test_...xyz789', created: '2024-03-20', lastUsed: '2024-06-14' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [companyName, setCompanyName] = useState('Operiq Fleet Management');
  const [email, setEmail] = useState('admin@operiq.com');
  const [phone, setPhone] = useState('+34 912 345 678');
  const [address, setAddress] = useState('Calle Gran Vía 123, Madrid');
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationPush, setNotificationPush] = useState(true);
  const [notificationSMS, setNotificationSMS] = useState(false);
  const [fraudThreshold, setFraudThreshold] = useState('medium');

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card className="bg-black border border-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-1">
              {configSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-zinc-900/50 text-white border-l-2 border-blue-500'
                        : 'text-zinc-500 hover:bg-zinc-900/30 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${section.color}`} />
                    <div className="text-left">
                      <p className="font-medium">{section.title}</p>
                      <p className="text-xs text-zinc-600">{section.description}</p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <>
            <Card className="bg-black border border-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Información de la Empresa</CardTitle>
                <p className="text-xs text-zinc-500">Datos básicos de la organización</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-zinc-400">Nombre de la empresa</Label>
                    <Input
                      id="company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-black border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-400">Email corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-zinc-400">Teléfono</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-black border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-zinc-400">Dirección</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-black border-zinc-800 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white">
                    Cancelar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Integrations Section */}
        {activeSection === 'platforms' && (
          <>
            <Card className="bg-black border border-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Plataformas Conectadas</CardTitle>
                <p className="text-xs text-zinc-500">Gestiona las integraciones con servicios externos</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {platformIntegrations.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between p-4 border border-zinc-900/50">
                    <div className="flex items-center gap-4">
                      <div className="bg-zinc-900/50 p-3">
                        <Globe className="h-6 w-6 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{platform.name}</p>
                        <p className="text-xs text-zinc-500">{platform.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {platform.status === 'connected' && (
                        <Badge variant="outline" className="border-green-500/50 text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Conectado
                        </Badge>
                      )}
                      {platform.status === 'disconnected' && (
                        <Badge variant="outline" className="border-red-500/50 text-red-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Desconectado
                        </Badge>
                      )}
                      {platform.status === 'pending' && (
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Configurando
                        </Badge>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                      >
                        {platform.status === 'connected' ? 'Configurar' : 'Conectar'}
                      </Button>
                    </div>
                  </div>
                ))}
                <Button className="w-full bg-transparent border border-dashed border-zinc-800 text-zinc-400 hover:bg-zinc-900/50 hover:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir nueva integración
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <>
            <Card className="bg-black border border-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Preferencias de Notificación</CardTitle>
                <p className="text-xs text-zinc-500">Configura cómo recibir alertas</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-zinc-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Notificaciones por Email</p>
                        <p className="text-xs text-zinc-500">Recibe alertas en tu correo</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationEmail(!notificationEmail)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notificationEmail ? 'bg-blue-600' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          notificationEmail ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-zinc-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Notificaciones Push</p>
                        <p className="text-xs text-zinc-500">Alertas en tiempo real</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationPush(!notificationPush)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notificationPush ? 'bg-blue-600' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          notificationPush ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-zinc-400" />
                      <div>
                        <p className="text-sm font-medium text-white">SMS</p>
                        <p className="text-xs text-zinc-500">Alertas críticas por SMS</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationSMS(!notificationSMS)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notificationSMS ? 'bg-blue-600' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          notificationSMS ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t border-zinc-900/50">
                  <Label className="text-zinc-400">Umbral de detección de fraudes</Label>
                  <select
                    value={fraudThreshold}
                    onChange={(e) => setFraudThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 text-white"
                  >
                    <option value="low">Bajo - Más alertas</option>
                    <option value="medium">Medio - Balanceado</option>
                    <option value="high">Alto - Solo críticas</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* API Section */}
        {activeSection === 'api' && (
          <>
            <Card className="bg-black border border-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">API Keys</CardTitle>
                  <p className="text-xs text-zinc-500">Gestiona las claves de acceso a la API</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva clave
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-4 border border-zinc-900/50">
                    <div className="space-y-1">
                      <p className="font-medium text-white">{key.name}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-zinc-900/50 px-2 py-1 text-zinc-400">{key.key}</code>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-500 hover:text-white">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>Creada: {key.created}</span>
                        <span>Último uso: {key.lastUsed}</span>
                      </div>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-black border border-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Webhooks</CardTitle>
                <p className="text-xs text-zinc-500">Endpoints para recibir eventos</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="webhook" className="text-zinc-400">URL del Webhook</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhook"
                      placeholder="https://tu-dominio.com/webhook"
                      className="bg-black border-zinc-800 text-white"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Security & Billing sections would follow similar patterns */}
      </div>
    </div>
  );
}