import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BoltService } from '@/services/bolt/boltService';
import { SyncService } from '@/services/syncService';

export async function GET() {
  try {
    // Test MongoDB connection
    const conn = await connectDB();
    
    if (!conn) {
      return NextResponse.json({
        mongodb: 'NOT CONNECTED',
        error: 'Could not connect to MongoDB'
      });
    }
    
    // Test Bolt configuration
    const boltService = BoltService.getInstance();
    const isBoltConfigured = boltService.isConfigured();
    
    // Get company ID
    const companyId = parseInt(process.env.BOLT_DEFAULT_COMPANY_ID || '132642');
    
    // Try to sync data if Bolt is configured
    let syncResult = null;
    if (isBoltConfigured) {
      try {
        const syncService = new SyncService();
        const vehicleSync = await syncService.syncVehicles(companyId);
        const driverSync = await syncService.syncDrivers(companyId);
        syncResult = {
          vehicles: vehicleSync,
          drivers: driverSync
        };
      } catch (syncError: any) {
        syncResult = { error: syncError.message };
      }
    }
    
    return NextResponse.json({
      mongodb: 'CONNECTED',
      bolt: {
        configured: isBoltConfigured,
        companyId: companyId,
        envVars: {
          CLIENT_ID: process.env.BOLT_CLIENT_ID ? 'SET' : 'NOT SET',
          CLIENT_SECRET: process.env.BOLT_CLIENT_SECRET ? 'SET' : 'NOT SET',
          COMPANY_ID: process.env.BOLT_DEFAULT_COMPANY_ID || 'NOT SET'
        }
      },
      syncResult
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}