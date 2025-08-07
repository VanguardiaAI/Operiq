import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      BOLT_CLIENT_ID: process.env.BOLT_CLIENT_ID ? 'SET' : 'NOT SET',
      BOLT_CLIENT_SECRET: process.env.BOLT_CLIENT_SECRET ? 'SET' : 'NOT SET',
      BOLT_DEFAULT_COMPANY_ID: process.env.BOLT_DEFAULT_COMPANY_ID || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}