import { NextResponse } from 'next/server';
import { BoltAPIClient } from '@/lib/integrations/bolt/client';
import { configureBoltAPI } from '@/lib/integrations/bolt/config';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function GET() {
  try {
    await connectDB();
    configureBoltAPI();
    
    const client = new BoltAPIClient();
    const companyId = 132642;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Get vehicles from Bolt
    const response = await client.getVehicles({
      company_id: companyId,
      start_ts: Math.floor(startDate.getTime() / 1000),
      end_ts: Math.floor(endDate.getTime() / 1000),
      limit: 100,
      offset: 0,
    });
    
    const vehicles = response.data?.vehicles || [];
    console.log('Found vehicles:', vehicles);
    
    // Save each vehicle
    const results = [];
    for (const vehicle of vehicles) {
      try {
        const saved = await Vehicle.findOneAndUpdate(
          { boltId: vehicle.id },
          {
            boltId: vehicle.id,
            uuid: vehicle.uuid,
            model: vehicle.model,
            year: vehicle.year,
            regNumber: vehicle.reg_number,
            state: vehicle.state,
            suspensionReason: vehicle.suspension_reason,
            companyId,
            lastSyncedAt: new Date(),
          },
          { upsert: true, new: true }
        );
        results.push({ id: vehicle.id, saved: true, doc: saved });
      } catch (error: any) {
        results.push({ id: vehicle.id, saved: false, error: error.message });
      }
    }
    
    // Check what's in DB now
    const dbVehicles = await Vehicle.find().lean();
    
    return NextResponse.json({
      fromBolt: vehicles,
      saveResults: results,
      inDatabase: dbVehicles
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack });
  }
}