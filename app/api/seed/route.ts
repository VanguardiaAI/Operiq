import { NextResponse } from 'next/server';

export async function GET() {
  // Mock seed endpoint for prototype
  // No actual database operations
  return NextResponse.json({ 
    message: 'Seed endpoint (prototype mode - no database operations)',
    status: 'success'
  }, { status: 200 });
}