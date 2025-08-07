import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // First, get the token
    const tokenFormData = new URLSearchParams();
    tokenFormData.append('client_id', process.env.BOLT_CLIENT_ID || '');
    tokenFormData.append('client_secret', process.env.BOLT_CLIENT_SECRET || '');
    tokenFormData.append('grant_type', 'client_credentials');
    tokenFormData.append('scope', 'fleet-integration:api');

    console.log('Getting token...');
    const tokenResponse = await fetch('https://oidc.bolt.eu/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenFormData.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return NextResponse.json({
        success: false,
        error: 'Token request failed',
        status: tokenResponse.status,
        details: errorText,
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('Token obtained successfully');

    // Now test the companies endpoint
    console.log('Testing companies endpoint...');
    const companiesResponse = await fetch('https://api.bolt.eu/fleetIntegration/v1/getCompanies', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const companiesText = await companiesResponse.text();
    console.log('Companies response status:', companiesResponse.status);
    console.log('Companies response:', companiesText);

    let companiesData;
    try {
      companiesData = JSON.parse(companiesText);
    } catch (e) {
      companiesData = { rawText: companiesText };
    }

    return NextResponse.json({
      success: true,
      token: {
        obtained: true,
        expiresIn: tokenData.expires_in,
      },
      companies: {
        status: companiesResponse.status,
        ok: companiesResponse.ok,
        data: companiesData,
      },
    });
  } catch (error: any) {
    console.error('Direct test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.constructor.name,
      cause: error.cause,
    });
  }
}