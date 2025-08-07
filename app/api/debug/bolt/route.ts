import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get all environment variables
  const envVars = {
    BOLT_CLIENT_ID: process.env.BOLT_CLIENT_ID,
    BOLT_CLIENT_SECRET: process.env.BOLT_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
  };

  // Test Bolt API
  let boltTestResult = null;
  try {
    const testResponse = await fetch('http://localhost:3001/api/bolt/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_ids: [1] }),
    });
    boltTestResult = await testResponse.json();
  } catch (error: any) {
    boltTestResult = { error: error.message };
  }

  // Get status
  let statusResult = null;
  try {
    const statusResponse = await fetch('http://localhost:3001/api/bolt/status');
    statusResult = await statusResponse.json();
  } catch (error: any) {
    statusResult = { error: error.message };
  }

  return NextResponse.json({
    envVars: {
      ...envVars,
      BOLT_CLIENT_ID: envVars.BOLT_CLIENT_ID ? `${envVars.BOLT_CLIENT_ID.substring(0, 10)}...` : 'Not set',
      BOLT_CLIENT_SECRET: envVars.BOLT_CLIENT_SECRET ? `${envVars.BOLT_CLIENT_SECRET.substring(0, 10)}...` : 'Not set',
    },
    boltTest: boltTestResult,
    boltStatus: statusResult,
    timestamp: new Date().toISOString(),
  });
}