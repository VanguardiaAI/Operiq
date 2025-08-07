export interface BoltTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface BoltCredentials {
  clientId: string;
  clientSecret: string;
}

export interface BoltTestRequest {
  offset: number;
  limit: number;
  company_ids: number[];
  start_ts: number;
  end_ts: number;
}

export interface BoltTestResponse {
  code: number;
  message: string;
}

export interface BoltOrdersRequest {
  offset: number;
  limit: number;
  company_ids?: number[];
  company_id?: number;
  start_ts: number;
  end_ts: number;
  time_range_filter_type?: 'price_review';
}

export interface BoltOrderStop {
  type: 'pickup' | 'dropoff';
  lng: number;
  lat: number;
  real_lng?: number;
  real_lat?: number;
}

export interface BoltOrderPrice {
  ride_price: number;
  booking_fee: number;
  toll_fee: number;
  cancellation_fee: number;
  tip: number;
  net_earnings: number;
  cash_discount: number;
  in_app_discount: number;
  commission: number;
}

export interface BoltOrder {
  order_reference: string;
  driver_name: string;
  driver_uuid: string;
  partner_uuid: string;
  driver_phone: string;
  payment_method: string;
  payment_confirmed_timestamp: number;
  order_created_timestamp: number;
  order_status: 'driver_booking' | 'completed' | 'cancelled' | string;
  vehicle_model: string;
  vehicle_license_plate: string;
  price_review_reason?: string;
  pickup_address: string;
  order_stops: BoltOrderStop[];
  ride_distance: number;
  order_accepted_timestamp?: number;
  order_pickup_timestamp?: number;
  order_drop_off_timestamp?: number;
  order_finished_timestamp?: number;
  order_price: BoltOrderPrice;
}

export interface BoltOrdersResponse {
  code: number;
  message: string;
  data: {
    company_id: number;
    company_name: string;
    total_orders: number;
    orders: BoltOrder[];
  };
}

export interface BoltStateLogsRequest {
  offset: number;
  limit: number;
  company_id: number;
  start_ts: number;
  end_ts: number;
}

export interface BoltStateLog {
  driver_uuid: string;
  vehicle_uuid: string;
  created: number;
  state: 'inactive' | 'active' | 'busy' | string;
  lat: number;
  lng: number;
}

export interface BoltStateLogsResponse {
  code: number;
  message: string;
  data: {
    state_logs: BoltStateLog[];
    total_rows: number;
  };
}

export interface BoltDriversRequest {
  offset: number;
  limit: number;
  company_id: number;
  start_ts: number;
  end_ts: number;
  portal_status?: 'active' | 'inactive' | 'suspended';
  search?: string;
}

export interface BoltDriver {
  driver_uuid: string;
  partner_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  state: 'active' | 'inactive' | 'suspended';
  has_cash_payment: boolean;
  suspension_reason?: string;
}

export interface BoltDriversResponse {
  code: number;
  message: string;
  data: {
    drivers: BoltDriver[];
  };
}

export interface BoltCompaniesResponse {
  code: number;
  message: string;
  data: {
    company_ids: number[];
  };
}

export interface BoltVehiclesRequest {
  offset: number;
  company_id: number;
  start_ts: number;
  end_ts: number;
  limit: number;
  portal_status?: 'active' | 'inactive' | 'suspended';
  search?: string;
}

export interface BoltVehicle {
  id: number;
  model: string;
  year: number;
  reg_number: string;
  uuid: string;
  state: 'active' | 'inactive' | 'suspended';
  suspension_reason?: string;
}

export interface BoltVehiclesResponse {
  code: number;
  message: string;
  data: {
    vehicles: BoltVehicle[];
  };
}

export interface BoltError {
  code: number;
  message: string;
}

export enum BoltErrorCodes {
  INVALID_START_DATE = 498805,
  INVALID_DATE_RANGE = 498806,
  COMPANY_NOT_FOUND = 498807,
  COMPANY_NOT_ACTIVE = 498809,
  COMPANY_NOT_ALLOWED = 498810,
}