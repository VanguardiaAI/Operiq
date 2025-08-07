import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import Driver from '@/models/Driver';

export async function GET() {
  try {
    await connectDB();
    
    const vehicleCount = await Vehicle.countDocuments();
    const driverCount = await Driver.countDocuments();
    
    const vehicles = await Vehicle.find().limit(5).lean();
    const drivers = await Driver.find().limit(5).lean();
    
    return NextResponse.json({
      counts: {
        vehicles: vehicleCount,
        drivers: driverCount
      },
      samples: {
        vehicles,
        drivers
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}