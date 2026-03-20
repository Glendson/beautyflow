import { IRepository } from "@/domain/repository";
import { Employee } from "./Employee";
import { Result } from "@/lib/result";

export interface IEmployeeRepository extends IRepository<Employee> {
  // Methods for assigning services
  assignServices(employeeId: string, serviceIds: string[], clinicId: string): Promise<Result<void>>;
  getAssignedServices(employeeId: string, clinicId: string): Promise<Result<string[]>>;
}
