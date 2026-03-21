import { IEmployeeRepository } from "@/domain/employee/IEmployeeRepository";
import { Employee } from "@/domain/employee/Employee";
import { Result } from "@/lib/result";
import { createClient } from "@/infrastructure/supabase/server";

export class EmployeeRepository implements IEmployeeRepository {
  async findById(id: string, clinicId: string): Promise<Result<Employee>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('employees').select('*').eq('id', id).eq('clinic_id', clinicId).single();
    if (error || !data) return Result.fail(error?.message || "Employee not found");
    return Result.ok(this.mapToEntity(data as DBEmployee));
  }
  async findAll(clinicId: string): Promise<Result<Employee[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('employees').select('*').eq('clinic_id', clinicId).order('name');
    if (error) return Result.fail(error.message);
    return Result.ok(((data || []) as DBEmployee[]).map(d => this.mapToEntity(d)));
  }
  async create(entity: Partial<Employee> & { clinic_id: string }): Promise<Result<Employee>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('employees').insert({ clinic_id: entity.clinic_id, name: entity.name! }).select().single();
    if (error || !data) return Result.fail(error?.message || "Failed to create employee");
    return Result.ok(this.mapToEntity(data as DBEmployee));
  }
  async update(id: string, entity: Partial<Employee>, clinicId: string): Promise<Result<Employee>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('employees').update({ name: entity.name }).eq('id', id).eq('clinic_id', clinicId).select().single();
    if (error || !data) return Result.fail(error?.message || "Failed to update employee");
    return Result.ok(this.mapToEntity(data as DBEmployee));
  }
  async delete(id: string, clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase.from('employees').delete().eq('id', id).eq('clinic_id', clinicId);
    if (error) return Result.fail(error.message);
    return Result.ok<void>(undefined);
  }
  async getAssignedServices(employeeId: string, clinicId: string): Promise<Result<string[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('employee_services').select('service_id').eq('employee_id', employeeId);
    if (error) return Result.fail(error.message);
    return Result.ok(((data || []) as { service_id: string }[]).map(r => r.service_id));
  }
  async assignServices(employeeId: string, serviceIds: string[], clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    await supabase.from('employee_services').delete().eq('employee_id', employeeId);
    if (serviceIds.length > 0) {
      const { error } = await supabase.from('employee_services').insert(serviceIds.map(sid => ({ employee_id: employeeId, service_id: sid })));
      if (error) return Result.fail(error.message);
    }
    return Result.ok<void>(undefined);
  }

  private mapToEntity(data: DBEmployee): Employee {
    return {
      id: data.id,
      clinic_id: data.clinic_id,
      name: data.name
    };
  }
}

interface DBEmployee {
  id: string;
  clinic_id: string;
  name: string;
}
