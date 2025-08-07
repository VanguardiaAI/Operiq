import { NextRequest, NextResponse } from 'next/server';
import { BoltService } from '@/services/bolt/boltService';

export async function GET(request: NextRequest) {
  try {
    const boltService = BoltService.getInstance();
    
    if (!boltService.isConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Bolt API not configured'
      });
    }

    const companyId = parseInt(process.env.BOLT_DEFAULT_COMPANY_ID || '132642');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    console.log('Testing with company ID:', companyId);
    console.log('Date range:', { startDate, endDate });

    // Test getting vehicles
    let vehiclesResult = null;
    try {
      const vehicles = await boltService.getVehicles(
        companyId,
        startDate,
        endDate,
        { limit: 10 }
      );
      vehiclesResult = {
        success: true,
        count: vehicles.length,
        data: vehicles
      };
    } catch (error: any) {
      console.error('Vehicles error:', error);
      vehiclesResult = {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }

    // Test getting drivers
    let driversResult = null;
    try {
      const drivers = await boltService.getDrivers(
        companyId,
        startDate,
        endDate,
        { limit: 10 }
      );
      driversResult = {
        success: true,
        count: drivers.length,
        data: drivers
      };
    } catch (error: any) {
      console.error('Drivers error:', error);
      driversResult = {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }

    // Test getting orders
    let ordersResult = null;
    try {
      const orders = await boltService.getOrders(
        companyId,
        startDate,
        endDate,
        10,
        0
      );
      ordersResult = {
        success: true,
        count: orders.orders.length,
        total: orders.total,
        companyName: orders.companyName,
        data: orders.orders
      };
    } catch (error: any) {
      console.error('Orders error:', error);
      ordersResult = {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }

    return NextResponse.json({
      success: true,
      companyId,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      vehicles: vehiclesResult,
      drivers: driversResult,
      orders: ordersResult
    });
  } catch (error: any) {
    console.error('Test real data error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}