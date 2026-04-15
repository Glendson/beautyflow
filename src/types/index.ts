/**
 * Shared Types for BeautyFlow
 */

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'canceled' | 'completed' | 'no_show';
export type UserRole = 'admin' | 'employee' | 'client';
export type RoomType = 'room' | 'station';
export type PlanType = 'free' | 'pro';

export interface Clinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logo?: string;
  planType: PlanType;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  clinic_id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  clinic_id: string;
  name: string;
  description?: string;
  category: string;
  duration: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  clinic_id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  active: boolean;
  avatar_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  clinic_id: string;
  name: string;
  type: RoomType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  clinic_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  date_of_birth?: Date;
  notes?: string;
  avatar_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  client_id: string;
  employee_id?: string;
  room_id?: string;
  service_id: string;
  start_time: Date;
  end_time: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  totalAppointments: number;
  completedAppointments: number;
  totalClients: number;
  totalRevenue: number;
  appointmentCompletionRate: number;
  averageRating?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
