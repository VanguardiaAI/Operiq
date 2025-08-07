import { NextResponse } from 'next/server';
import { BoltAPIClient } from '@/lib/integrations/bolt/client';
import { configureBoltAPI } from '@/lib/integrations/bolt/config';

export async function GET() {
  try {
    configureBoltAPI();
    const client = new BoltAPIClient();
    const companyId = 132642;
    
    // Try different date ranges
    const ranges = [
      { days: 30, label: 'Last 30 days' },
      { days: 90, label: 'Last 90 days' },
      { days: 365, label: 'Last year' },
    ];
    
    const results = [];
    
    for (const range of ranges) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - range.days);
      
      try {
        const response = await client.getVehicles({
          company_id: companyId,
          start_ts: Math.floor(startDate.getTime() / 1000),
          end_ts: Math.floor(endDate.getTime() / 1000),
          limit: 100,
          offset: 0,
        });
        
        results.push({
          range: range.label,
          vehicleCount: response.data?.vehicles?.length || 0,
          vehicles: response.data?.vehicles || []
        });
      } catch (error: any) {
        results.push({
          range: range.label,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}