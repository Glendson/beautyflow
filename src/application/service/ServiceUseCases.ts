import { ServiceRepository } from "@/infrastructure/repositories/supabase/ServiceRepository";
import { Service } from "@/domain/service/Service";
import { Result } from "@/lib/result";
import { getClinicId } from "@/lib/auth";

const repository = new ServiceRepository();

export class ServiceUseCases {
  static async getServices(): Promise<Result<Service[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }

  static async getServiceById(id: string): Promise<Result<Service>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findById(id, clinicId);
  }

  static async createService(data: Omit<Service, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Service>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.create({ ...data, clinic_id: clinicId });
  }

  static async updateService(id: string, data: Partial<Service>): Promise<Result<Service>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.update(id, data, clinicId);
  }

  static async deleteService(id: string): Promise<Result<void>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.delete(id, clinicId);
  }
}
