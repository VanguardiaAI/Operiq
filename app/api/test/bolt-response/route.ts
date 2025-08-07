import { NextResponse } from 'next/server';
import { BoltAPIClient } from '@/lib/integrations/bolt/client';
import { configureBoltAPI, isBoltConfigured } from '@/lib/integrations/bolt/config';

export async function GET() {
  try {
    configureBoltAPI();
    
    if (!isBoltConfigured()) {
      return NextResponse.json({ error: 'Bolt not configured' });
    }
    
    const client = new BoltAPIClient();
    const companyId = 132642;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    try {
      const response = await client.getVehicles({
        company_id: companyId,
        start_ts: Math.floor(startDate.getTime() / 1000),
        end_ts: Math.floor(endDate.getTime() / 1000),
        limit: 10,
        offset: 0,
      });
      
      return NextResponse.json({
        success: true,
        rawResponse: response,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : null,
      });
    } catch (error: any) {
      return NextResponse.json({
        error: error.message,
        response: error.response?.data || null,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}