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
    
    if (!boltService.isConfigured()) {
      // Return mock data if Bolt is not configured
      return NextResponse.json({
        success: true,
        data: {
          drivers: [],
          total: 0,
          page,
          totalPages: 0,
        },
      });
    }
    
    // Get data directly from Bolt
    const companyId = parseInt(process.env.BOLT_DEFAULT_COMPANY_ID || '132642');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
    
    try {
      const drivers = await boltService.getDrivers(
        companyId,
        startDate,
        endDate,
        {
          limit: 1000, // Get all drivers
          portalStatus: state as any,
          search: search || undefined,
        }
      );
      
      // Transform Bolt data to match our format
      const transformedDrivers = drivers.map((d, index) => ({
        _id: d.driver_uuid || `bolt-driver-${index}`,
        driverUuid: d.driver_uuid,
        partnerUuid: d.partner_uuid,
        firstName: d.first_name,
        lastName: d.last_name,
        email: d.email,
        phone: d.phone,
        state: d.state,
        hasCashPayment: d.has_cash_payment,
        suspensionReason: d.suspension_reason,
        companyId,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      // Apply pagination
      const start = (page - 1) * limit;
      const paginatedDrivers = transformedDrivers.slice(start, start + limit);
      
      return NextResponse.json({
        success: true,
        data: {
          drivers: paginatedDrivers,
          total: transformedDrivers.length,
          page,
          totalPages: Math.ceil(transformedDrivers.length / limit),
        },
      });
    } catch (error: any) {
      console.error('Error fetching from Bolt:', error);
      return NextResponse.json({
        success: true,
        data: {
          drivers: [],
          total: 0,
          page,
          totalPages: 0,
        },
      });
    }
  } catch (error: any) {
    console.error('Error in drivers direct endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}