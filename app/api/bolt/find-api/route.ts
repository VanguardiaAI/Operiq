import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // First get a valid token
  const tokenFormData = new URLSearchParams();
  tokenFormData.append('client_id', process.env.BOLT_CLIENT_ID || '');
  tokenFormData.append('client_secret', process.env.BOLT_CLIENT_SECRET || '');
  tokenFormData.append('grant_type', 'client_credentials');
  tokenFormData.append('scope', 'fleet-integration:api');

  const tokenResponse = await fetch('https://oidc.bolt.eu/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenFormData.toString(),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({
      error: 'Failed to get token',
      status: tokenResponse.status
    });
  }

  const tokenData = await tokenResponse.json();
  const token = tokenData.access_token;

  // Try different possible API URLs
  const possibleUrls = [
    'https://fleet.bolt.eu/fleetIntegration/v1/getCompanies',
    'https://fleet-api.bolt.eu/fleetIntegration/v1/getCompanies',
    'https://api.fleet.bolt.eu/fleetIntegration/v1/getCompanies',
    'https://oidc.bolt.eu/fleetIntegration/v1/getCompanies',
    'https://bolt.eu/api/fleetIntegration/v1/getCompanies',
    'https://platform.bolt.eu/fleetIntegration/v1/getCompanies',
    'https://partner.bolt.eu/fleetIntegration/v1/getCompanies',
    'https://partners-api.bolt.eu/fleetIntegration/v1/getCompanies',
  ];

  const results: any = {};

  for (const url of possibleUrls) {
    try {
      console.log(`Trying: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      results[url] = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data
      };

      // If we found a successful one, highlight it
      if (response.ok && response.status === 200) {
        results.FOUND_WORKING_URL = url;
      }
    } catch (error: any) {
      results[url] = {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  return NextResponse.json({
    token: !!token,
    results
  });
}