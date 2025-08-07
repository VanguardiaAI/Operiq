import { BoltService } from '@/services/bolt/boltService';
import Vehicle, { IVehicle } from '@/models/Vehicle';
import Driver, { IDriver } from '@/models/Driver';
import connectDB from '@/lib/mongodb';

export class SyncService {
  private boltService: BoltService;

  constructor() {
    this.boltService = BoltService.getInstance();
  }

  async syncVehicles(companyId: number): Promise<{ synced: number; errors: number }> {
    await connectDB();
    
    let synced = 0;
    let errors = 0;
    
    try {
      // Obtener datos de los últimos 30 días
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const vehicles = await this.boltService.getVehicles(
        companyId,
        startDate,
        endDate,
        { limit: 1000 }
      );

      for (const vehicle of vehicles) {
        try {
          await Vehicle.findOneAndUpdate(
            { boltId: vehicle.id },
            {
              boltId: vehicle.id,
              uuid: vehicle.uuid,
              model: vehicle.model,
              year: vehicle.year,
              regNumber: vehicle.reg_number,
              state: vehicle.state,
              suspensionReason: vehicle.suspension_reason,
              companyId,
              lastSyncedAt: new Date(),
            },
            { upsert: true, new: true }
          );
          synced++;
        } catch (error) {
          console.error(`Error syncing vehicle ${vehicle.id}:`, error);
          errors++;
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles from Bolt:', error);
      throw error;
    }

    return { synced, errors };
  }

  async syncDrivers(companyId: number): Promise<{ synced: number; errors: number }> {
    await connectDB();
    
    let synced = 0;
    let errors = 0;
    
    try {
      // Obtener datos de los últimos 30 días
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const drivers = await this.boltService.getDrivers(
        companyId,
        startDate,
        endDate,
        { limit: 1000 }
      );

      for (const driver of drivers) {
        try {
          await Driver.findOneAndUpdate(
            { driverUuid: driver.driver_uuid },
            {
              driverUuid: driver.driver_uuid,
              partnerUuid: driver.partner_uuid,
              firstName: driver.first_name,
              lastName: driver.last_name,
              email: driver.email,
              phone: driver.phone,
              state: driver.state,
              hasCashPayment: driver.has_cash_payment,
              suspensionReason: driver.suspension_reason,
              companyId,
              lastSyncedAt: new Date(),
            },
            { upsert: true, new: true }
          );
          synced++;
        } catch (error) {
          console.error(`Error syncing driver ${driver.driver_uuid}:`, error);
          errors++;
        }
      }
    } catch (error) {
      console.error('Error fetching drivers from Bolt:', error);
      throw error;
    }

    return { synced, errors };
  }

  async syncAll(): Promise<{
    vehicles: { synced: number; errors: number };
    drivers: { synced: number; errors: number };
  }> {
    const companyIds = await this.boltService.getCompanyIds();
    
    if (companyIds.length === 0) {
      throw new Error('No companies found for this account');
    }

    // Por ahora, sincronizar solo la primera compañía
    const companyId = companyIds[0];

    const [vehiclesResult, driversResult] = await Promise.all([
      this.syncVehicles(companyId),
      this.syncDrivers(companyId),
    ]);

    return {
      vehicles: vehiclesResult,
      drivers: driversResult,
    };
  }
}