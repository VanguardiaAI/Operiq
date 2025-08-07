import { BoltTokenResponse, BoltCredentials } from './types';

export class BoltAuthService {
  private static instance: BoltAuthService;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private credentials: BoltCredentials | null = null;

  private constructor() {}

  static getInstance(): BoltAuthService {
    if (!BoltAuthService.instance) {
      BoltAuthService.instance = new BoltAuthService();
    }
    return BoltAuthService.instance;
  }

  setCredentials(credentials: BoltCredentials) {
    this.credentials = credentials;
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return Date.now() >= this.tokenExpiry;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }

    if (!this.credentials) {
      throw new Error('Bolt API credentials not configured');
    }

    const tokenResponse = await this.requestNewToken();
    this.accessToken = tokenResponse.access_token;
    this.tokenExpiry = Date.now() + (tokenResponse.expires_in * 1000) - 30000;
    
    return this.accessToken;
  }

  private async requestNewToken(): Promise<BoltTokenResponse> {
    if (!this.credentials) {
      throw new Error('Bolt API credentials not configured');
    }

    const formData = new URLSearchParams();
    formData.append('client_id', this.credentials.clientId);
    formData.append('client_secret', this.credentials.clientSecret);
    formData.append('grant_type', 'client_credentials');
    formData.append('scope', 'fleet-integration:api');

    const response = await fetch('https://oidc.bolt.eu/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get Bolt access token: ${response.status} - ${errorText}`);
    }

    const data: BoltTokenResponse = await response.json();
    return data;
  }

  async makeAuthenticatedRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = await this.getAccessToken();

      console.log(`Making request to: ${url}`);
      console.log(`Method: ${options.method || 'GET'}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Bolt API error response: ${response.status} - ${errorText}`);
        throw new Error(`Bolt API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Response received from ${url}`);
      return data;
    } catch (error: any) {
      console.error('Request error:', error);
      throw error;
    }
  }

  clearToken() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }
}