import { NextRequest, NextResponse } from 'next/server';
import { SyncService } from '@/services/syncService';
import { BoltService } from '@/services/bolt/boltService';

export async function POST(request: NextRequest) {
  try {
    const boltService = BoltService.getInstance();
    
    if (!boltService.isConfigured()) {
      return NextResponse.json(
        { error: 'Bolt API is not configured. Please set BOLT_CLIENT_ID and BOLT_CLIENT_SECRET environment variables.' },
        { status: 503 }
      );
    }
    
    const syncService = new SyncService();
    const result = await syncService.syncAll();
    
    return NextResponse.json({
      success: true,
      message: 'Sincronización completada',
      data: result,
    });
  } catch (error: any) {
    console.error('Sync endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Error durante la sincronización' },
      { status: 500 }
    );
  }
}