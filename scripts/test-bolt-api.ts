#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const BASE_URL = 'http://localhost:3000/api/bolt';

async function testBoltAPI() {
  console.log('🚀 Testing Bolt API Integration\n');

  // Check if credentials are configured
  if (!process.env.BOLT_CLIENT_ID || !process.env.BOLT_CLIENT_SECRET) {
    console.error('❌ Error: BOLT_CLIENT_ID and BOLT_CLIENT_SECRET must be set in .env.local');
    process.exit(1);
  }

  try {
    // 1. Test getting companies
    console.log('📋 Testing GET /api/bolt/companies...');
    const companiesResponse = await fetch(`${BASE_URL}/companies`);
    const companiesData = await companiesResponse.json();
    
    if (!companiesResponse.ok) {
      throw new Error(`Companies endpoint failed: ${companiesData.error}`);
    }
    
    console.log('✅ Companies retrieved:', companiesData.data.company_ids);
    
    if (companiesData.data.company_ids.length === 0) {
      console.warn('⚠️  No companies found. Make sure your credentials have access to at least one company.');
      return;
    }

    const companyId = companiesData.data.company_ids[0];
    console.log(`\n🏢 Using company ID: ${companyId}\n`);

    // 2. Test connection
    console.log('🔌 Testing POST /api/bolt/test...');
    const testResponse = await fetch(`${BASE_URL}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_ids: [companyId] })
    });
    const testData = await testResponse.json();
    
    if (!testResponse.ok) {
      throw new Error(`Test endpoint failed: ${testData.error}`);
    }
    
    console.log('✅ Connection test:', testData.success ? 'Success' : 'Failed');

    // Set date range for tests (last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const dateRange = {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    };

    // 3. Test orders endpoint
    console.log('\n📦 Testing POST /api/bolt/orders...');
    const ordersResponse = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId,
        ...dateRange,
        limit: 10,
        offset: 0
      })
    });
    const ordersData = await ordersResponse.json();
    
    if (!ordersResponse.ok) {
      throw new Error(`Orders endpoint failed: ${ordersData.error}`);
    }
    
    console.log(`✅ Orders retrieved: ${ordersData.data.orders.length} of ${ordersData.data.total} total`);
    console.log(`   Company: ${ordersData.data.companyName}`);

    // 4. Test drivers endpoint
    console.log('\n👥 Testing POST /api/bolt/drivers...');
    const driversResponse = await fetch(`${BASE_URL}/drivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId,
        ...dateRange,
        limit: 10,
        offset: 0
      })
    });
    const driversData = await driversResponse.json();
    
    if (!driversResponse.ok) {
      throw new Error(`Drivers endpoint failed: ${driversData.error}`);
    }
    
    console.log(`✅ Drivers retrieved: ${driversData.data.drivers.length}`);

    // 5. Test vehicles endpoint
    console.log('\n🚗 Testing POST /api/bolt/vehicles...');
    const vehiclesResponse = await fetch(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId,
        ...dateRange,
        limit: 10,
        offset: 0
      })
    });
    const vehiclesData = await vehiclesResponse.json();
    
    if (!vehiclesResponse.ok) {
      throw new Error(`Vehicles endpoint failed: ${vehiclesData.error}`);
    }
    
    console.log(`✅ Vehicles retrieved: ${vehiclesData.data.vehicles.length}`);

    // 6. Test state logs endpoint
    console.log('\n📊 Testing POST /api/bolt/state-logs...');
    const stateLogsResponse = await fetch(`${BASE_URL}/state-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: companyId,
        ...dateRange,
        limit: 10,
        offset: 0
      })
    });
    const stateLogsData = await stateLogsResponse.json();
    
    if (!stateLogsResponse.ok) {
      throw new Error(`State logs endpoint failed: ${stateLogsData.error}`);
    }
    
    console.log(`✅ State logs retrieved: ${stateLogsData.data.logs.length} of ${stateLogsData.data.total} total`);

    console.log('\n✨ All tests passed successfully!');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testBoltAPI();
}