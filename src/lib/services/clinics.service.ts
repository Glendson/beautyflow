/**
 * Clinic Service
 *
 * Orquestrates clinic-related operations:
 * - Get clinic information
 * - Update clinic settings
 * - Manage clinic configuration
 * - Handle multi-tenancy
 */

import { ClinicUseCases } from "@/application/clinic/ClinicUseCases";
import { Clinic } from "@/domain/clinic/Clinic";
import { Result } from "@/lib/result";

export const ClinicService = {
  /**
   * Get current clinic information
   */
  async getInfo(): Promise<Result<Clinic>> {
    return ClinicUseCases.getClinic();
  },

  /**
   * Get clinic by ID
   */
  async getById(id: string): Promise<Result<Clinic>> {
    return ClinicUseCases.getClinicById(id);
  },

  /**
   * Get clinic by slug
   */
  async getBySlug(slug: string): Promise<Result<Clinic>> {
    return ClinicUseCases.getClinicBySlug(slug);
  },

  /**
   * Update clinic information
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
    }>
  ): Promise<Result<Clinic>> {
    return ClinicUseCases.updateClinic(id, data);
  },

  /**
   * Get clinic settings
   */
  async getSettings(
    id: string
  ): Promise<Result<Record<string, unknown>>> {
    return ClinicUseCases.getClinicSettings(id);
  },

  /**
   * Update clinic settings
   */
  async updateSettings(
    id: string,
    settings: Record<string, unknown>
  ): Promise<Result<Record<string, unknown>>> {
    return ClinicUseCases.updateClinicSettings(id, settings);
  },

  /**
   * Get clinic statistics
   */
  async getStats(
    id: string
  ): Promise<
    Result<{
      total_appointments: number;
      total_clients: number;
      total_employees: number;
      total_services: number;
      total_rooms: number;
    }>
  > {
    return ClinicUseCases.getClinicStats(id);
  },

  /**
   * Get clinic dashboard data
   */
  async getDashboardData(
    id: string
  ): Promise<
    Result<{
      upcoming_appointments: unknown[];
      revenue_today: number;
      new_clients: number;
      appointments_completed: number;
    }>
  > {
    return ClinicUseCases.getClinicDashboard(id);
  },
};
