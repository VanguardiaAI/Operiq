import { NextRequest, NextResponse } from 'next/server';
import { BoltService } from '@/services/bolt/boltService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_ids } = body;

    if (!company_ids || !Array.isArray(company_ids) || company_ids.length === 0) {
      return NextResponse.json(
        { error: 'company_ids array is required' },
        { status: 400 }
      );
    }

    const boltService = BoltService.getInstance();

    // Debug info
    console.log('Test endpoint - Bolt configured:', boltService.isConfigured());
    console.log('Test endpoint - Env vars:', {
      clientId: process.env.BOLT_CLIENT_ID ? 'Set' : 'Not set',
      clientSecret: process.env.BOLT_CLIENT_SECRET ? 'Set' : 'Not set',
    });

    if (!boltService.isConfigured()) {
      return NextResponse.json(
        { 
          error: 'Bolt API is not configured. Please set BOLT_CLIENT_ID and BOLT_CLIENT_SECRET environment variables.',
          debug: {
            clientId: process.env.BOLT_CLIENT_ID ? 'Set' : 'Not set',
            clientSecret: process.env.BOLT_CLIENT_SECRET ? 'Set' : 'Not set',
          }
        },
        { status: 503 }
      );
    }

    const isConnected = await boltService.testConnection(company_ids);

    return NextResponse.json({
      success: isConnected,
      message: isConnected ? 'Connection successful' : 'Connection failed',
    });
  } catch (error: any) {
    console.error('Bolt test endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}