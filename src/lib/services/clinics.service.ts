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
   * Update clinic information
   */
  async update(
    data: Partial<Clinic>
  ): Promise<Result<Clinic>> {
    return ClinicUseCases.updateClinic(data);
  },
};
