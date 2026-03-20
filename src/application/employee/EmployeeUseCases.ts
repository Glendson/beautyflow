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

  static async createEmployee(data: { name: string }, serviceIds?: string[]): Promise<Result<Employee>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    const result = await repository.create({ ...data, clinic_id: clinicId });
    if (result.success && result.data && serviceIds && serviceIds.length > 0) {
      await repository.assignServices(result.data.id, serviceIds, clinicId);
    }
    return result;
  }

  static async updateEmployee(id: string, data: Partial<Employee>, serviceIds?: string[]): Promise<Result<Employee>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    const result = await repository.update(id, data, clinicId);
    if (result.success && serviceIds) {
      await repository.assignServices(id, serviceIds, clinicId);
    }
    return result;
  }

  static async deleteEmployee(id: string): Promise<Result<void>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.delete(id, clinicId);
  }

  static async getEmployeeServices(employeeId: string): Promise<Result<string[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.getAssignedServices(employeeId, clinicId);
  }
}
