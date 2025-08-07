import { BoltAuthService } from './auth';
import {
  BoltTestRequest,
  BoltTestResponse,
  BoltOrdersRequest,
  BoltOrdersResponse,
  BoltStateLogsRequest,
  BoltStateLogsResponse,
  BoltDriversRequest,
  BoltDriversResponse,
  BoltCompaniesResponse,
  BoltVehiclesRequest,
  BoltVehiclesResponse,
} from './types';

export class BoltAPIClient {
  private authService: BoltAuthService;
  private baseUrl = 'https://node.bolt.eu/fleet-integration-gateway/fleetIntegration/v1';

  constructor() {
    this.authService = BoltAuthService.getInstance();
  }

  async test(request: BoltTestRequest): Promise<BoltTestResponse> {
    return this.authService.makeAuthenticatedRequest<BoltTestResponse>(
      `${this.baseUrl}/test`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async getFleetOrders(request: BoltOrdersRequest): Promise<BoltOrdersResponse> {
    return this.authService.makeAuthenticatedRequest<BoltOrdersResponse>(
      `${this.baseUrl}/getFleetOrders`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async getFleetStateLogs(request: BoltStateLogsRequest): Promise<BoltStateLogsResponse> {
    return this.authService.makeAuthenticatedRequest<BoltStateLogsResponse>(
      `${this.baseUrl}/getFleetStateLogs`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async getDrivers(request: BoltDriversRequest): Promise<BoltDriversResponse> {
    return this.authService.makeAuthenticatedRequest<BoltDriversResponse>(
      `${this.baseUrl}/getDrivers`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async getCompanies(): Promise<BoltCompaniesResponse> {
    return this.authService.makeAuthenticatedRequest<BoltCompaniesResponse>(
      `${this.baseUrl}/getCompanies`,
      {
        method: 'GET',
      }
    );
  }

  async getVehicles(request: BoltVehiclesRequest): Promise<BoltVehiclesResponse> {
    return this.authService.makeAuthenticatedRequest<BoltVehiclesResponse>(
      `${this.baseUrl}/getVehicles`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }
}