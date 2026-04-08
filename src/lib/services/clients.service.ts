/**
 * Client Service
 *
 * Orquestrates client-related operations:
 * - Create, read, update, delete clients
 * - Manage client history and preferences
 * - Handle multi-tenancy
 */

import { ClientUseCases } from "@/application/client/ClientUseCases";
import { Client } from "@/domain/client/Client";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";

export const ClientService = {
  /**
   * Get all clients for the clinic
   */
  async getAll(): Promise<Result<Client[]>> {
    return ClientUseCases.getClients();
  },

  /**
   * Get paginated clients
   */
  async getPaginated(
    page: number,
    pageSize: number
  ): Promise<Result<PaginatedResult<Client>>> {
    return ClientUseCases.getClientsPaginated(page, pageSize);
  },

  /**
   * Get client by ID
   */
  async getById(id: string): Promise<Result<Client>> {
    return ClientUseCases.getClientById(id);
  },

  /**
   * Create a new client
   */
  async create(data: {
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
  }): Promise<Result<Client>> {
    return ClientUseCases.createClient(data);
  },

  /**
   * Update client information
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      email?: string;
      phone?: string;
      notes?: string;
    }>
  ): Promise<Result<Client>> {
    return ClientUseCases.updateClient(id, data);
  },

  /**
   * Delete a client
   */
  async delete(id: string): Promise<Result<void>> {
    return ClientUseCases.deleteClient(id);
  },

  /**
   * Search clients by name, email, or phone
   */
  async search(query: string): Promise<Result<Client[]>> {
    return ClientUseCases.searchClients(query);
  },

  /**
   * Get client by email
   */
  async getByEmail(email: string): Promise<Result<Client | null>> {
    return ClientUseCases.getClientByEmail(email);
  },

  /**
   * Get client by phone
   */
  async getByPhone(phone: string): Promise<Result<Client | null>> {
    return ClientUseCases.getClientByPhone(phone);
  },

  /**
   * Add notes to client profile
   */
  async addNotes(clientId: string, notes: string): Promise<Result<Client>> {
    return ClientUseCases.updateClient(clientId, { notes });
  },
};
