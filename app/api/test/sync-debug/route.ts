import { NextResponse } from 'next/server';
import { BoltService } from '@/services/bolt/boltService';
import { SyncService } from '@/services/syncService';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    
    const boltService = BoltService.getInstance();
    const syncService = new SyncService();
    const companyId = 132642;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Step 1: Get vehicles from Bolt
    let boltVehicles = [];
    let vehicleError = null;
    try {
      boltVehicles = await boltService.getVehicles(companyId, startDate, endDate, { limit: 1000 });
    } catch (e: any) {
      vehicleError = e.message;
    }
    
    // Step 2: Get drivers from Bolt
    let boltDrivers = [];
    let driverError = null;
    try {
      boltDrivers = await boltService.getDrivers(companyId, startDate, endDate, { limit: 1000 });
    } catch (e: any) {
      driverError = e.message;
    }
    
    // Step 3: Try to sync
    let syncResult = null;
    let syncError = null;
    try {
      const vehicleSync = await syncService.syncVehicles(companyId);
      const driverSync = await syncService.syncDrivers(companyId);
      syncResult = { vehicles: vehicleSync, drivers: driverSync };
    } catch (e: any) {
      syncError = e.message;
    }
    
    return NextResponse.json({
      bolt: {
        vehicles: {
          count: boltVehicles.length,
          data: boltVehicles.slice(0, 3),
          error: vehicleError
        },
        drivers: {
          count: boltDrivers.length,
          data: boltDrivers.slice(0, 3),
          error: driverError
        }
      },
      sync: {
        result: syncResult,
        error: syncError
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack });
  }
}