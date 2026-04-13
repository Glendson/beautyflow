import { ClientRepository } from "@/infrastructure/repositories/supabase/ClientRepository";
import { Client } from "@/domain/client/Client";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";
import { getClinicId } from "@/lib/auth";

const repository = new ClientRepository();

export class ClientUseCases {
  static async getClients(): Promise<Result<Client[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }

  static async getClientsPaginated(
    page: number,
    pageSize: number,
    filters?: { search?: string }
  ): Promise<Result<PaginatedResult<Client>>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAllPaginated(clinicId, page, pageSize, filters);
  }

  static async getClientById(id: string): Promise<Result<Client>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findById(id, clinicId);
  }

  static async createClient(data: Omit<Client, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Client>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // Validation: name not empty
    if (!data.name || data.name.trim().length === 0) {
      return Result.fail("Client name cannot be empty");
    }

    // Validation: email format (if provided)
    if (data.email && !this.isValidEmail(data.email)) {
      return Result.fail("Invalid email format");
    }

    // Validation: phone format (if provided)
    if (data.phone && !this.isValidPhone(data.phone)) {
      return Result.fail("Invalid phone format");
    }

    return repository.create({ ...data, clinic_id: clinicId });
  }

  static async updateClient(id: string, data: Partial<Client>): Promise<Result<Client>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // Validation: name not empty
    if (data.name && data.name.trim().length === 0) {
      return Result.fail("Client name cannot be empty");
    }

    // Validation: email format (if provided)
    if (data.email && !this.isValidEmail(data.email)) {
      return Result.fail("Invalid email format");
    }

    // Validation: phone format (if provided)
    if (data.phone && !this.isValidPhone(data.phone)) {
      return Result.fail("Invalid phone format");
    }

    return repository.update(id, data, clinicId);
  }

  static async deleteClient(id: string): Promise<Result<void>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.delete(id, clinicId);
  }

  // Helper validation methods
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    // Basic phone validation: at least 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length >= 10;
  }
}
