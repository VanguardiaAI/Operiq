import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({ error: 'MONGODB_URI not set' });
    }
    
    // Check if already connected
    if (mongoose.connections[0].readyState === 1) {
      return NextResponse.json({ 
        status: 'Already connected',
        database: mongoose.connections[0].name
      });
    }
    
    // Try to connect
    await mongoose.connect(mongoUri);
    
    return NextResponse.json({ 
      status: 'Connected successfully',
      database: mongoose.connections[0].name
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      mongoUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET'
    });
  }
}