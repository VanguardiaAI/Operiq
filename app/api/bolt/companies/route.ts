import { NextRequest, NextResponse } from 'next/server';
import { BoltService } from '@/services/bolt/boltService';

export async function GET(request: NextRequest) {
  try {
    const boltService = BoltService.getInstance();

    if (!boltService.isConfigured()) {
      return NextResponse.json(
        { error: 'Bolt API is not configured. Please set BOLT_CLIENT_ID and BOLT_CLIENT_SECRET environment variables.' },
        { status: 503 }
      );
    }

    const companyIds = await boltService.getCompanyIds();

    return NextResponse.json({
      success: true,
      data: {
        company_ids: companyIds,
      },
    });
  } catch (error: any) {
    console.error('Bolt companies endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}