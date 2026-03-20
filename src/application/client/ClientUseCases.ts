import { ClientRepository } from "@/infrastructure/repositories/supabase/ClientRepository";
import { Client } from "@/domain/client/Client";
import { Result } from "@/lib/result";
import { getClinicId } from "@/lib/auth";

const repository = new ClientRepository();

export class ClientUseCases {
  static async getClients(): Promise<Result<Client[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }
  static async createClient(data: Omit<Client, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Client>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.create({ ...data, clinic_id: clinicId });
  }
  static async deleteClient(id: string): Promise<Result<void>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.delete(id, clinicId);
  }
}
