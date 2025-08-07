import { NextRequest, NextResponse } from 'next/server';
import { BoltService } from '@/services/bolt/boltService';
import { BoltAuthService } from '@/lib/integrations/bolt/auth';

export async function GET(request: NextRequest) {
  try {
    const boltService = BoltService.getInstance();
    const authService = BoltAuthService.getInstance();
    
    const status = {
      configured: boltService.isConfigured(),
      credentials: {
        clientId: process.env.BOLT_CLIENT_ID ? 'Set' : 'Not set',
        clientSecret: process.env.BOLT_CLIENT_SECRET ? 'Set' : 'Not set',
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
      }
    };
    
    // Try to get a token if configured
    if (boltService.isConfigured()) {
      try {
        const token = await authService.getAccessToken();
        status.auth = {
          tokenObtained: !!token,
          tokenLength: token ? token.length : 0,
        };
        
        // Try to get companies
        try {
          const companies = await boltService.getCompanyIds();
          status.companies = {
            success: true,
            count: companies.length,
            ids: companies,
          };
        } catch (error: any) {
          console.error('Company fetch error:', error);
          status.companies = {
            success: false,
            error: error.message,
            errorType: error.constructor.name,
            cause: error.cause?.message,
            stack: error.stack?.split('\n').slice(0, 3),
          };
        }
      } catch (error: any) {
        status.auth = {
          tokenObtained: false,
          error: error.message,
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error',
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}