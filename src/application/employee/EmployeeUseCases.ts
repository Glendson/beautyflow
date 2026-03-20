import { EmployeeRepository } from "@/infrastructure/repositories/supabase/EmployeeRepository";
import { Employee } from "@/domain/employee/Employee";
import { Result } from "@/lib/result";
import { getClinicId } from "@/lib/auth";

const repository = new EmployeeRepository();

export class EmployeeUseCases {
  static async getEmployees(): Promise<Result<Employee[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }

  static async getEmployeeById(id: string): Promise<Result<Employee>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findById(id, clinicId);
  }

  static async createEmployee(data: Omit<Employee, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Employee>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    
    // First create employee
    const res = await repository.create({ ...data, clinic_id: clinicId });
    if (!res.success || !res.data) return res;

    // Then assign services if provided
    if (data.service_ids && data.service_ids.length > 0) {
      await repository.assignServices(res.data.id, data.service_ids, clinicId);
      res.data.service_ids = data.service_ids;
    }

    return res;
  }

  static async updateEmployee(id: string, data: Partial<Employee>): Promise<Result<Employee>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    
    const res = await repository.update(id, data, clinicId);
    if (!res.success) return res;

    if (data.service_ids) {
      await repository.assignServices(id, data.service_ids, clinicId);
      if (res.data) res.data.service_ids = data.service_ids;
    }

    return res;
  }

  static async deleteEmployee(id: string): Promise<Result<void>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.delete(id, clinicId);
  }
}
