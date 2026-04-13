import { ClinicRepository } from "@/infrastructure/repositories/supabase/ClinicRepository";
import { Clinic } from "@/domain/clinic/Clinic";
import { Result } from "@/lib/result";
import { getClinicId } from "@/lib/auth";

const repository = new ClinicRepository();

export class ClinicUseCases {
  static async getClinic(): Promise<Result<Clinic>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findByIdDirect(clinicId);
  }

  static async updateClinic(data: Partial<Clinic>): Promise<Result<Clinic>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // Validate data
    if (data.name && data.name.trim().length === 0) {
      return Result.fail("Clinic name cannot be empty");
    }

    if (data.email && !this.isValidEmail(data.email)) {
      return Result.fail("Invalid email format");
    }

    if (data.phone && data.phone.trim().length === 0) {
      return Result.fail("Phone cannot be empty");
    }

    return repository.update(clinicId, data, clinicId);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
