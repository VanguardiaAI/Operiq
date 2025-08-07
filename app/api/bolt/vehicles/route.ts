import { NextRequest, NextResponse } from 'next/server';
import { BoltService } from '@/services/bolt/boltService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      company_id, 
      start_date, 
      end_date, 
      portal_status,
      search,
      limit = 100, 
      offset = 0 
    } = body;

    if (!company_id) {
      return NextResponse.json(
        { error: 'company_id is required' },
        { status: 400 }
      );
    }

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      );
    }

    const boltService = BoltService.getInstance();

    if (!boltService.isConfigured()) {
      return NextResponse.json(
        { error: 'Bolt API is not configured. Please set BOLT_CLIENT_ID and BOLT_CLIENT_SECRET environment variables.' },
        { status: 503 }
      );
    }

    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    const vehicles = await boltService.getVehicles(
      company_id,
      startDateObj,
      endDateObj,
      {
        portalStatus: portal_status,
        search,
        limit,
        offset,
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        vehicles,
        total: vehicles.length,
      },
    });
  } catch (error: any) {
    console.error('Bolt vehicles endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}