/**
 * Service Service (Beauty Service)
 *
 * Orquestrates service/procedure-related operations:
 * - Create, read, update, delete services
 * - Manage service categories
 * - Manage service pricing and duration
 * - Handle multi-tenancy
 *
 * Note: Named "Service" to match domain terminology. Use as:
 * import { ServiceService } from "@/lib/services/beauty-services.service"
 */

import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import { Service } from "@/domain/service/Service";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";

export const ServiceService = {
  /**
   * Get all services for the clinic
   */
  async getAll(): Promise<Result<Service[]>> {
    return ServiceUseCases.getServices();
  },

  /**
   * Get paginated services
   */
  async getPaginated(
    page: number,
    pageSize: number
  ): Promise<Result<PaginatedResult<Service>>> {
    return ServiceUseCases.getServicesPaginated(page, pageSize);
  },

  /**
   * Get service by ID
   */
  async getById(id: string): Promise<Result<Service>> {
    return ServiceUseCases.getServiceById(id);
  },

  /**
   * Create a new service
   */
  async create(data: {
    category_id: string;
    name: string;
    duration: number;
    price: number;
    is_active?: boolean;
  }): Promise<Result<Service>> {
    return ServiceUseCases.createService(data as any);
  },

  /**
   * Update service information
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      duration: number;
      price: number;
      is_active: boolean;
      category_id: string;
    }>
  ): Promise<Result<Service>> {
    return ServiceUseCases.updateService(id, data);
  },

  /**
   * Delete a service
   */
  async delete(id: string): Promise<Result<void>> {
    return ServiceUseCases.deleteService(id);
  },

  /**
   * Deactivate a service
   */
  async deactivate(id: string): Promise<Result<Service>> {
    return ServiceUseCases.updateService(id, { is_active: false });
  },

  /**
   * Activate a service
   */
  async activate(id: string): Promise<Result<Service>> {
    return ServiceUseCases.updateService(id, { is_active: true });
  },

  /**
   * Update service pricing
   */
  async updatePrice(id: string, price: number): Promise<Result<Service>> {
    return ServiceUseCases.updateService(id, { price });
  },

  /**
   * Update service duration
   */
  async updateDuration(id: string, durationMinutes: number): Promise<Result<Service>> {
    return ServiceUseCases.updateService(id, { duration: durationMinutes });
  },
};
