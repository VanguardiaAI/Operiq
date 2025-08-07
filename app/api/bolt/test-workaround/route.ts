import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

function httpsRequest(url: string, options: any, postData?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

export async function GET(request: NextRequest) {
  try {
    // Test 1: Token request using https module
    const tokenData = new URLSearchParams();
    tokenData.append('client_id', process.env.BOLT_CLIENT_ID || '');
    tokenData.append('client_secret', process.env.BOLT_CLIENT_SECRET || '');
    tokenData.append('grant_type', 'client_credentials');
    tokenData.append('scope', 'fleet-integration:api');

    console.log('Testing with https module...');
    
    const tokenResponse = await httpsRequest(
      'https://oidc.bolt.eu/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(tokenData.toString())
        }
      },
      tokenData.toString()
    );

    let tokenResult;
    try {
      tokenResult = JSON.parse(tokenResponse.data);
    } catch (e) {
      tokenResult = { error: 'Failed to parse token response', raw: tokenResponse.data };
    }

    // If we got a token, test the companies endpoint
    let companiesResult = null;
    if (tokenResult.access_token) {
      const companiesResponse = await httpsRequest(
        'https://api.bolt.eu/fleetIntegration/v1/getCompanies',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenResult.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      try {
        companiesResult = JSON.parse(companiesResponse.data);
      } catch (e) {
        companiesResult = { error: 'Failed to parse companies response', raw: companiesResponse.data };
      }
    }

    return NextResponse.json({
      success: true,
      method: 'https-module',
      token: {
        status: tokenResponse.statusCode,
        result: tokenResult
      },
      companies: companiesResult
    });
  } catch (error: any) {
    console.error('Workaround test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      hostname: error.hostname,
      syscall: error.syscall
    });
  }
}