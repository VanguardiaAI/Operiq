import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Driver from '@/models/Driver';
import { SyncService } from '@/services/syncService';
import { BoltService } from '@/services/bolt/boltService';

// Mock data for prototype mode
const mockDrivers = [
  {
    _id: '1',
    driverUuid: 'driver-uuid-1',
    partnerUuid: 'partner-uuid-1',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos@example.com',
    phone: '+34 612 345 678',
    state: 'active',
    hasCashPayment: true,
    companyId: 1,
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    driverUuid: 'driver-uuid-2',
    partnerUuid: 'partner-uuid-2',
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana@example.com',
    phone: '+34 623 456 789',
    state: 'active',
    hasCashPayment: false,
    companyId: 1,
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    driverUuid: 'driver-uuid-3',
    partnerUuid: 'partner-uuid-3',
    firstName: 'Miguel',
    lastName: 'Fernández',
    email: 'miguel@example.com',
    phone: '+34 634 567 890',
    state: 'suspended',
    hasCashPayment: true,
    suspensionReason: 'Documentación pendiente',
    companyId: 1,
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    driverUuid: 'driver-uuid-4',
    partnerUuid: 'partner-uuid-4',
    firstName: 'Laura',
    lastName: 'Martín',
    email: 'laura@example.com',
    phone: '+34 645 678 901',
    state: 'inactive',
    hasCashPayment: false,
    companyId: 1,
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sync = searchParams.get('sync') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const state = searchParams.get('state');
    const search = searchParams.get('search');
    
    // Try to connect to MongoDB
    const conn = await connectDB();
    
    // If no MongoDB connection, use mock data
    if (!conn) {
      console.log('Using mock data for drivers (prototype mode)');
      
      // Filter mock data
      let filteredDrivers = [...mockDrivers];
      
      if (state && state !== '') {
        filteredDrivers = filteredDrivers.filter(d => d.state === state);
      }
      
      if (search && search !== '') {
        const searchLower = search.toLowerCase();
        filteredDrivers = filteredDrivers.filter(d => 
          d.firstName.toLowerCase().includes(searchLower) ||
          d.lastName.toLowerCase().includes(searchLower) ||
          d.email.toLowerCase().includes(searchLower) ||
          d.phone.toLowerCase().includes(searchLower)
        );
      }
      
      // Paginate
      const start = (page - 1) * limit;
      const paginatedDrivers = filteredDrivers.slice(start, start + limit);
      
      return NextResponse.json({
        success: true,
        data: {
          drivers: paginatedDrivers,
          total: filteredDrivers.length,
          page,
          totalPages: Math.ceil(filteredDrivers.length / limit),
        },
      });
    }
    
    // Si se solicita sincronización, sincronizar primero
    if (sync) {
      try {
        const syncService = new SyncService();
        const boltService = BoltService.getInstance();
        
        if (!boltService.isConfigured()) {
          console.log('Bolt API not configured, skipping sync');
        } else {
          // Obtener el primer company ID disponible si no hay uno por defecto
          let companyId = parseInt(process.env.BOLT_DEFAULT_COMPANY_ID || '0');
          if (companyId === 0) {
            const companyIds = await boltService.getCompanyIds();
            if (companyIds.length > 0) {
              companyId = companyIds[0];
            }
          }
          
          const result = await syncService.syncDrivers(companyId);
          console.log('Sync result:', result);
        }
      } catch (syncError) {
        console.error('Sync error (non-fatal):', syncError);
        // Continuar mostrando los datos existentes aunque falle la sincronización
      }
    }
    
    // Construir query
    const query: any = {};
    
    if (state && state !== '') {
      query.state = state;
    }
    
    if (search && search !== '') {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Obtener conductores con paginación
    const skip = (page - 1) * limit;
    
    const [drivers, total] = await Promise.all([
      Driver.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Driver.countDocuments(query),
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        drivers,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching drivers:', error);
    
    // If MongoDB error, return mock data
    if (error.message?.includes('buffering timed out')) {
      console.log('MongoDB timeout, returning mock data');
      return NextResponse.json({
        success: true,
        data: {
          drivers: mockDrivers.slice(0, 10),
          total: mockDrivers.length,
          page: 1,
          totalPages: 1,
        },
      });
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}