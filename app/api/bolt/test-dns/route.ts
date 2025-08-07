import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);
const dnsResolve4 = promisify(dns.resolve4);

export async function GET(request: NextRequest) {
  const results: any = {};

  // Test DNS resolution for various domains
  const domains = [
    'google.com',
    'oidc.bolt.eu', 
    'api.bolt.eu',
    'bolt.eu'
  ];

  for (const domain of domains) {
    try {
      // Try dns.lookup
      const lookupResult = await dnsLookup(domain);
      results[domain] = {
        success: true,
        method: 'lookup',
        address: lookupResult.address,
        family: lookupResult.family
      };
    } catch (lookupError: any) {
      // Try dns.resolve4
      try {
        const resolveResult = await dnsResolve4(domain);
        results[domain] = {
          success: true,
          method: 'resolve4',
          addresses: resolveResult
        };
      } catch (resolveError: any) {
        results[domain] = {
          success: false,
          lookupError: lookupError.message,
          resolveError: resolveError.message,
          code: lookupError.code
        };
      }
    }
  }

  // Test with curl command
  let curlTest = null;
  try {
    const { exec } = require('child_process');
    const execPromise = promisify(exec);
    
    const curlResult = await execPromise('curl -I https://api.bolt.eu 2>&1 | head -n 5');
    curlTest = {
      success: true,
      output: curlResult.stdout
    };
  } catch (error: any) {
    curlTest = {
      success: false,
      error: error.message
    };
  }

  // Get DNS servers
  const dnsServers = dns.getServers();

  return NextResponse.json({
    dnsResults: results,
    dnsServers,
    curlTest,
    platform: process.platform,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
}