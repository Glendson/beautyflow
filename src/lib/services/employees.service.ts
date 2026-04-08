/**
 * Employee Service
 *
 * Orquestrates employee-related operations:
 * - Create, read, update, delete employees
 * - Manage employee specializations
 * - Handle employee schedules
 * - Handle multi-tenancy
 */

import { EmployeeUseCases } from "@/application/employee/EmployeeUseCases";
import { Employee } from "@/domain/employee/Employee";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";

export const EmployeeService = {
  /**
   * Get all employees for the clinic
   */
  async getAll(): Promise<Result<Employee[]>> {
    return EmployeeUseCases.getEmployees();
  },

  /**
   * Get paginated employees
   */
  async getPaginated(
    page: number,
    pageSize: number
  ): Promise<Result<PaginatedResult<Employee>>> {
    return EmployeeUseCases.getEmployeesPaginated(page, pageSize);
  },

  /**
   * Get employee by ID
   */
  async getById(id: string): Promise<Result<Employee>> {
    return EmployeeUseCases.getEmployeeById(id);
  },

  /**
   * Create a new employee
   */
  async create(data: {
    name: string;
    email: string;
    phone?: string;
  }): Promise<Result<Employee>> {
    return EmployeeUseCases.createEmployee(data);
  },

  /**
   * Update employee information
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone?: string;
      is_active: boolean;
    }>
  ): Promise<Result<Employee>> {
    return EmployeeUseCases.updateEmployee(id, data);
  },

  /**
   * Delete an employee
   */
  async delete(id: string): Promise<Result<void>> {
    return EmployeeUseCases.deleteEmployee(id);
  },

  /**
   * Deactivate an employee
   */
  async deactivate(id: string): Promise<Result<Employee>> {
    return EmployeeUseCases.updateEmployee(id, { is_active: false });
  },

  /**
   * Activate an employee
   */
  async activate(id: string): Promise<Result<Employee>> {
    return EmployeeUseCases.updateEmployee(id, { is_active: true });
  },

  /**
   * Assign services to an employee
   */
  async assignServices(
    employeeId: string,
    serviceIds: string[]
  ): Promise<Result<void>> {
    return EmployeeUseCases.assignServices(employeeId, serviceIds);
  },

  /**
   * Get services offered by an employee
   */
  async getServices(employeeId: string): Promise<Result<string[]>> {
    return EmployeeUseCases.getEmployeeServices(employeeId);
  },

  /**
   * Check if employee can perform a service
   */
  async canPerformService(
    employeeId: string,
    serviceId: string
  ): Promise<Result<boolean>> {
    return EmployeeUseCases.canPerformService(employeeId, serviceId);
  },
};
