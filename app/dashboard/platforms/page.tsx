'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Settings, 
  Plus, 
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Key
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Platform {
  id: string;
  name: string;
  vehicles: number;
  drivers: number;
  lastSync: string;
  status: 'connected' | 'pending' | 'disconnected';
  logo?: string;
  isConfigured?: boolean;
}

const statusConfig = {
  connected: {
    label: 'Conectado',
    icon: CheckCircle,
    className: 'text-green-500',
    dotClassName: 'bg-green-500',
  },
  pending: {
    label: 'Pendiente',
    icon: AlertCircle,
    className: 'text-yellow-500',
    dotClassName: 'bg-yellow-500',
  },
  disconnected: {
    label: 'Desconectado',
    icon: XCircle,
    className: 'text-red-500',
    dotClassName: 'bg-red-500',
  },
};

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [apiCredentials, setApiCredentials] = useState({ clientId: '', clientSecret: '' });
  const { toast } = useToast();

  const checkBoltStatus = async () => {
    try {
      // Simply check if we can access the Bolt API
      const response = await fetch('/api/bolt/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_ids: [1] })
      });
      
      const data = await response.json();
      // If we get a response (even with error), credentials are configured
      return response.ok || (data.error && !data.error.includes('credentials'));
    } catch (error) {
      console.error('Error checking Bolt status:', error);
      // If there's any data in the database, assume it's configured
      return true;
    }
  };

  const loadPlatforms = async () => {
    setLoading(true);
    
    // Get counts from local data
    let vehicleCount = 0;
    let driverCount = 0;
    
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        fetch('/api/vehicles?limit=1'),
        fetch('/api/drivers?limit=1')
      ]);
      
      const vehiclesData = await vehiclesRes.json();
      const driversData = await driversRes.json();
      
      if (vehiclesData.success) vehicleCount = vehiclesData.data.total || 0;
      if (driversData.success) driverCount = driversData.data.total || 0;
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
    
    // Check Bolt status - if we have data, it's configured
    const isBoltConfigured = (vehicleCount > 0 || driverCount > 0) ? true : await checkBoltStatus();
    
    const platformsData: Platform[] = [
      {
        id: '1',
        name: 'Uber',
        vehicles: 0,
        drivers: 0,
        lastSync: 'No disponible',
        status: 'pending',
        logo: '/uber.png',
        isConfigured: false,
      },
      {
        id: '2',
        name: 'Bolt',
        vehicles: vehicleCount,
        drivers: driverCount,
        lastSync: vehicleCount > 0 ? new Date().toLocaleString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          day: '2-digit',
          month: 'short'
        }) : 'No sincronizado',
        status: isBoltConfigured && (vehicleCount > 0 || driverCount > 0) ? 'connected' : isBoltConfigured ? 'pending' : 'disconnected',
        logo: '/bolt.webp',
        isConfigured: isBoltConfigured,
      },
      {
        id: '3',
        name: 'Webfleet',
        vehicles: 0,
        drivers: 0,
        lastSync: 'No disponible',
        status: 'pending',
        logo: '/webfleet.webp',
        isConfigured: false,
      },
    ];
    
    setPlatforms(platformsData);
    setLoading(false);
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  const handleSync = async (platformId: string, platformName: string) => {
    if (platformId === '2') { // Bolt
      try {
        const response = await fetch('/api/sync', {
          method: 'POST',
        });
        
        const data = await response.json();
        
        if (data.success) {
          toast({
            title: 'Sincronización completada',
            description: `Se sincronizaron los datos de ${platformName}`,
          });
          
          // Reload platforms to update counts
          await loadPlatforms();
        } else {
          throw new Error(data.error || 'Error en la sincronización');
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'No se pudo sincronizar',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'No disponible',
        description: `La sincronización con ${platformName} aún no está implementada`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Plataformas Integradas</h1>
          <p className="text-sm text-zinc-500 mt-1">Gestiona las conexiones con las plataformas VTC</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full sm:w-auto transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Plataforma
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => {
            const StatusIcon = statusConfig[platform.status].icon;
            
            return (
              <Card key={platform.id} className="bg-black border border-zinc-900/50">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {platform.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-500">
                        {platform.vehicles} vehículos · {platform.drivers} conductores
                      </p>
                    </div>
                    {platform.logo ? (
                      <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-lg"></div>
                        <div className="relative h-14 w-14 sm:h-16 sm:w-16 bg-black rounded-full p-1.5 overflow-hidden shadow-md shadow-white/10 flex items-center justify-center">
                          <Image 
                            src={platform.logo} 
                            alt={`${platform.name} logo`}
                            width={platform.name === 'Webfleet' ? 100 : 60}
                            height={platform.name === 'Webfleet' ? 100 : 60}
                            className={`${
                              platform.name === 'Webfleet' 
                                ? 'h-16 w-16 sm:h-20 sm:w-20' 
                                : 'h-10 w-10 sm:h-12 sm:w-12'
                            } object-contain relative z-10`}
                          />
                          <div className="absolute inset-0 rounded-full border-2 border-white/60 pointer-events-none z-20"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-900/50 p-2 sm:p-3">
                        <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-500" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0 space-y-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Última sincronización:</span>
                    <span className="text-zinc-300 text-xs sm:text-sm">{platform.lastSync}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 ${statusConfig[platform.status].className}`} />
                    <span className={`text-sm ${statusConfig[platform.status].className}`}>
                      {statusConfig[platform.status].label}
                    </span>
                    <div className={`h-2 w-2 rounded-full ${statusConfig[platform.status].dotClassName} animate-pulse ml-auto`} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-[#232c43] border-0 text-white hover:bg-[#232c43]/80 transition-colors text-xs sm:text-sm"
                      disabled={!platform.isConfigured}
                      onClick={() => handleSync(platform.id, platform.name)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Sincronizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-[#232c43] border-0 text-white hover:bg-[#232c43]/80 transition-colors text-xs sm:text-sm"
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setShowConfigModal(true);
                      }}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configurar
                    </Button>
                  </div>
                  
                  {platform.id === '2' && !platform.isConfigured && (
                    <p className="text-xs text-yellow-500 text-center">
                      Configura las credenciales de Bolt en las variables de entorno
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal para añadir plataforma */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir Nueva Plataforma</DialogTitle>
            <DialogDescription>
              Selecciona la plataforma que deseas integrar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Card 
              className="bg-zinc-900/50 border-zinc-800 cursor-pointer hover:bg-zinc-900/70 transition-colors"
              onClick={() => {
                toast({
                  title: 'Próximamente',
                  description: 'La integración con Cabify estará disponible pronto',
                });
                setShowAddModal(false);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Image 
                    src="/cabify.jpg" 
                    alt="Cabify logo" 
                    width={60} 
                    height={60} 
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-white">Cabify</h3>
                    <p className="text-sm text-zinc-500">Conecta tu flota con Cabify</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de configuración */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configurar {selectedPlatform?.name}</DialogTitle>
            <DialogDescription>
              Gestiona las credenciales de API y la configuración de la plataforma
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedPlatform?.isConfigured ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-900/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Plataforma conectada</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Última sincronización</Label>
                    <p className="text-sm text-white">{selectedPlatform.lastSync}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Estado de la conexión</Label>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${statusConfig[selectedPlatform.status].dotClassName}`} />
                      <span className="text-sm text-white">{statusConfig[selectedPlatform.status].label}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <Button 
                    variant="destructive" 
                    className="w-full bg-red-900/50 hover:bg-red-900/70 border-0"
                    onClick={() => {
                      toast({
                        title: 'Función no disponible',
                        description: 'La desconexión de plataformas estará disponible pronto',
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Desconectar Plataforma
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input 
                    id="clientId" 
                    value={apiCredentials.clientId}
                    onChange={(e) => setApiCredentials({...apiCredentials, clientId: e.target.value})}
                    placeholder="Ingresa tu Client ID" 
                    className="bg-zinc-900/50 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input 
                    id="clientSecret" 
                    type="password"
                    value={apiCredentials.clientSecret}
                    onChange={(e) => setApiCredentials({...apiCredentials, clientSecret: e.target.value})}
                    placeholder="Ingresa tu Client Secret" 
                    className="bg-zinc-900/50 border-zinc-800"
                  />
                </div>
                <div className="bg-yellow-900/20 border border-yellow-900/50 p-3">
                  <p className="text-xs text-yellow-500">
                    Necesitas configurar las credenciales en las variables de entorno del servidor
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfigModal(false)}
              className="bg-transparent border-zinc-800"
            >
              Cancelar
            </Button>
            {!selectedPlatform?.isConfigured && (
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={() => {
                  toast({
                    title: 'Información',
                    description: 'Configura las variables de entorno en el servidor',
                  });
                  setShowConfigModal(false);
                }}
              >
                <Key className="h-4 w-4 mr-2" />
                Guardar Credenciales
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}