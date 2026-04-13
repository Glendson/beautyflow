import { EmployeeRepository } from "@/infrastructure/repositories/supabase/EmployeeRepository";
import { Employee } from "@/domain/employee/Employee";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";
import { getClinicId } from "@/lib/auth";

const repository = new EmployeeRepository();

export class EmployeeUseCases {
  static async getEmployees(): Promise<Result<Employee[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }

  static async getEmployeesPaginated(
    page: number,
    pageSize: number,
    filters?: { search?: string }
  ): Promise<Result<PaginatedResult<Employee>>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAllPaginated(clinicId, page, pageSize, filters);
  }

  static async getEmployeeById(id: string): Promise<Result<Employee>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findById(id, clinicId);
  }

  static async createEmployee(data: { name: string }, serviceIds?: string[]): Promise<Result<Employee>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // Validation: name not empty
    if (!data.name || data.name.trim().length === 0) {
      return Result.fail("Employee name cannot be empty");
    }

    const result = await repository.create({ ...data, clinic_id: clinicId });
    if (result.success && result.data && serviceIds && serviceIds.length > 0) {
      await repository.assignServices(result.data.id, serviceIds, clinicId);
    }
    return result;
  }

  static async updateEmployee(id: string, data: Partial<Employee>, serviceIds?: string[]): Promise<Result<Employee>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // Validation: name not empty (if provided)
    if (data.name && data.name.trim().length === 0) {
      return Result.fail("Employee name cannot be empty");
    }

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
