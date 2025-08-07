import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { SyncService } from '@/services/syncService';
import { BoltService } from '@/services/bolt/boltService';

// Mock data for prototype mode
const mockVehicles = [
  {
    _id: '1',
    boltId: 12345,
    uuid: 'mock-uuid-1',
    model: 'Toyota Prius',
    year: 2022,
    regNumber: 'MAD-4521-BC',
    state: 'active',
    companyId: 1,
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    boltId: 12346,
    uuid: 'mock-uuid-2',
    model: 'Nissan Leaf',
    year: 2023,
    regNumber: 'MAD-7823-CD',
    state: 'active',
    companyId: 1,
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    boltId: 12347,
    uuid: 'mock-uuid-3',
    model: 'Tesla Model 3',
    year: 2023,
    regNumber: 'MAD-9012-EF',
    state: 'suspended',
    suspensionReason: 'Mantenimiento programado',
    companyId: 1,
    lastSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '4',
    boltId: 12348,
    uuid: 'mock-uuid-4',
    model: 'Hyundai Ioniq',
    year: 2022,
    regNumber: 'MAD-3456-GH',
    state: 'inactive',
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
      console.log('Using mock data for vehicles (prototype mode)');
      
      // Filter mock data
      let filteredVehicles = [...mockVehicles];
      
      if (state && state !== '') {
        filteredVehicles = filteredVehicles.filter(v => v.state === state);
      }
      
      if (search && search !== '') {
        const searchLower = search.toLowerCase();
        filteredVehicles = filteredVehicles.filter(v => 
          v.model.toLowerCase().includes(searchLower) ||
          v.regNumber.toLowerCase().includes(searchLower)
        );
      }
      
      // Paginate
      const start = (page - 1) * limit;
      const paginatedVehicles = filteredVehicles.slice(start, start + limit);
      
      return NextResponse.json({
        success: true,
        data: {
          vehicles: paginatedVehicles,
          total: filteredVehicles.length,
          page,
          totalPages: Math.ceil(filteredVehicles.length / limit),
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
          
          const result = await syncService.syncVehicles(companyId);
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
        { model: { $regex: search, $options: 'i' } },
        { regNumber: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Obtener vehículos con paginación
    const skip = (page - 1) * limit;
    
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Vehicle.countDocuments(query),
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        vehicles,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching vehicles:', error);
    
    // If MongoDB error, return mock data
    if (error.message?.includes('buffering timed out')) {
      console.log('MongoDB timeout, returning mock data');
      return NextResponse.json({
        success: true,
        data: {
          vehicles: mockVehicles.slice(0, 10),
          total: mockVehicles.length,
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