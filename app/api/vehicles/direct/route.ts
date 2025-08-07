import { NextRequest, NextResponse } from 'next/server';
import { BoltService } from '@/services/bolt/boltService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const state = searchParams.get('state');
    const search = searchParams.get('search');
    
    const boltService = BoltService.getInstance();
    
    console.log('Direct vehicles endpoint - Bolt configured:', boltService.isConfigured());
    console.log('Company ID from env:', process.env.BOLT_DEFAULT_COMPANY_ID);
    console.log('All Bolt env vars:', {
      CLIENT_ID: process.env.BOLT_CLIENT_ID ? 'SET' : 'NOT SET',
      CLIENT_SECRET: process.env.BOLT_CLIENT_SECRET ? 'SET' : 'NOT SET',
      COMPANY_ID: process.env.BOLT_DEFAULT_COMPANY_ID,
    });
    
    if (!boltService.isConfigured()) {
      console.log('Bolt not configured, returning empty data');
      // Return mock data if Bolt is not configured
      return NextResponse.json({
        success: true,
        data: {
          vehicles: [],
          total: 0,
          page,
          totalPages: 0,
        },
      });
    }
    
    // Get data directly from Bolt
    // Hardcoded company ID while env is not loaded
    const companyId = 132642;
    console.log('Using company ID:', companyId);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
    
    try {
      const vehicles = await boltService.getVehicles(
        companyId,
        startDate,
        endDate,
        {
          limit: 1000, // Get all vehicles
          portalStatus: state as any,
          search: search || undefined,
        }
      );
      
      // Transform Bolt data to match our format
      const transformedVehicles = vehicles.map((v, index) => ({
        _id: v.uuid || `bolt-${v.id}`,
        boltId: v.id,
        uuid: v.uuid,
        model: v.model,
        year: v.year,
        regNumber: v.reg_number,
        state: v.state,
        suspensionReason: v.suspension_reason,
        companyId,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      // Apply pagination
      const start = (page - 1) * limit;
      const paginatedVehicles = transformedVehicles.slice(start, start + limit);
      
      return NextResponse.json({
        success: true,
        data: {
          vehicles: paginatedVehicles,
          total: transformedVehicles.length,
          page,
          totalPages: Math.ceil(transformedVehicles.length / limit),
        },
      });
    } catch (error: any) {
      console.error('Error fetching from Bolt:', error);
      return NextResponse.json({
        success: true,
        data: {
          vehicles: [],
          total: 0,
          page,
          totalPages: 0,
        },
      });
    }
  } catch (error: any) {
    console.error('Error in vehicles direct endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}