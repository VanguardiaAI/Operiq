import { BoltAPIClient } from '@/lib/integrations/bolt/client';
import { configureBoltAPI, isBoltConfigured } from '@/lib/integrations/bolt/config';
import {
  BoltOrder,
  BoltDriver,
  BoltVehicle,
  BoltStateLog,
  BoltErrorCodes,
} from '@/lib/integrations/bolt/types';

export class BoltService {
  private static instance: BoltService;
  private client: BoltAPIClient;

  private constructor() {
    configureBoltAPI();
    this.client = new BoltAPIClient();
  }

  static getInstance(): BoltService {
    if (!BoltService.instance) {
      BoltService.instance = new BoltService();
    }
    return BoltService.instance;
  }

  isConfigured(): boolean {
    return isBoltConfigured();
  }

  async testConnection(companyIds: number[]): Promise<boolean> {
    try {
      const response = await this.client.test({
        offset: 0,
        limit: 1,
        company_ids: companyIds,
        start_ts: Math.floor(Date.now() / 1000) - 86400,
        end_ts: Math.floor(Date.now() / 1000),
      });
      return response.code === 0;
    } catch (error) {
      console.error('Bolt connection test failed:', error);
      return false;
    }
  }

  async getCompanyIds(): Promise<number[]> {
    try {
      const response = await this.client.getCompanies();
      return response.data.company_ids;
    } catch (error: any) {
      console.error('Failed to get company IDs:', error);
      console.error('Error details:', {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getOrders(
    companyId: number,
    startDate: Date,
    endDate: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<{ orders: BoltOrder[]; total: number; companyName: string }> {
    try {
      const response = await this.client.getFleetOrders({
        company_id: companyId,
        start_ts: Math.floor(startDate.getTime() / 1000),
        end_ts: Math.floor(endDate.getTime() / 1000),
        limit,
        offset,
      });

      return {
        orders: response.data?.orders || [],
        total: response.data?.total_orders || 0,
        companyName: response.data?.company_name || '',
      };
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async getDrivers(
    companyId: number,
    startDate: Date,
    endDate: Date,
    options?: {
      portalStatus?: 'active' | 'inactive' | 'suspended';
      search?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<BoltDriver[]> {
    try {
      const response = await this.client.getDrivers({
        company_id: companyId,
        start_ts: Math.floor(startDate.getTime() / 1000),
        end_ts: Math.floor(endDate.getTime() / 1000),
        limit: options?.limit || 100,
        offset: options?.offset || 0,
        portal_status: options?.portalStatus,
        search: options?.search,
      });

      return response.data?.drivers || [];
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async getVehicles(
    companyId: number,
    startDate: Date,
    endDate: Date,
    options?: {
      portalStatus?: 'active' | 'inactive' | 'suspended';
      search?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<BoltVehicle[]> {
    try {
      const response = await this.client.getVehicles({
        company_id: companyId,
        start_ts: Math.floor(startDate.getTime() / 1000),
        end_ts: Math.floor(endDate.getTime() / 1000),
        limit: options?.limit || 100,
        offset: options?.offset || 0,
        portal_status: options?.portalStatus,
        search: options?.search,
      });

      return response.data?.vehicles || [];
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async getStateLogs(
    companyId: number,
    startDate: Date,
    endDate: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<{ logs: BoltStateLog[]; total: number }> {
    try {
      const response = await this.client.getFleetStateLogs({
        company_id: companyId,
        start_ts: Math.floor(startDate.getTime() / 1000),
        end_ts: Math.floor(endDate.getTime() / 1000),
        limit,
        offset,
      });

      return {
        logs: response.data.state_logs,
        total: response.data.total_rows,
      };
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async getAllOrdersForDateRange(
    companyId: number,
    startDate: Date,
    endDate: Date
  ): Promise<BoltOrder[]> {
    const allOrders: BoltOrder[] = [];
    let offset = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      const { orders, total } = await this.getOrders(
        companyId,
        startDate,
        endDate,
        limit,
        offset
      );

      allOrders.push(...orders);
      offset += limit;
      hasMore = offset < total;
    }

    return allOrders;
  }

  private handleError(error: any) {
    const errorCode = error.response?.data?.code;

    switch (errorCode) {
      case BoltErrorCodes.INVALID_START_DATE:
        throw new Error('La fecha de inicio es anterior a la fecha permitida');
      case BoltErrorCodes.INVALID_DATE_RANGE:
        throw new Error('El rango de fechas es demasiado largo');
      case BoltErrorCodes.COMPANY_NOT_FOUND:
        throw new Error('La compañía no fue encontrada');
      case BoltErrorCodes.COMPANY_NOT_ACTIVE:
        throw new Error('La compañía no está activa');
      case BoltErrorCodes.COMPANY_NOT_ALLOWED:
        throw new Error('No tienes acceso a esta compañía');
      default:
        console.error('Bolt API error:', error);
    }
  }
}