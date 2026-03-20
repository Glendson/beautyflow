import { IEmployeeRepository } from "@/domain/employee/IEmployeeRepository";
import { Employee } from "@/domain/employee/Employee";
import { Result } from "@/lib/result";
import { createClient } from "@/infrastructure/supabase/server";

export class EmployeeRepository implements IEmployeeRepository {
  async findById(id: string, clinicId: string): Promise<Result<Employee>> {
    const supabase = await createClient();
    const { data: emp, error } = await supabase
      .from('employees')
      .select('*, employee_services(service_id)')
      .eq('id', id)
      .eq('clinic_id', clinicId)
      .single();

    if (error || !emp) {
      return Result.fail(error?.message || "Employee not found");
    }

    const service_ids = emp.employee_services?.map((es: any) => es.service_id) || [];
    return Result.ok(this.mapToEntity({ ...emp, service_ids }));
  }

  async findAll(clinicId: string): Promise<Result<Employee[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('employees')
      .select('*, employee_services(service_id)')
      .eq('clinic_id', clinicId)
      .order('name');

    if (error) {
      return Result.fail(error.message);
    }

    return Result.ok((data || []).map(emp => {
      const service_ids = emp.employee_services?.map((es: any) => es.service_id) || [];
      return this.mapToEntity({ ...emp, service_ids });
    }));
  }

  async create(entity: Partial<Employee> & { clinic_id: string }): Promise<Result<Employee>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('employees')
      .insert({
        clinic_id: entity.clinic_id,
        name: entity.name!,
        email: entity.email || null,
        phone: entity.phone || null,
        is_active: entity.is_active ?? true,
      })
      .select()
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Failed to create employee");
    }

    return Result.ok(this.mapToEntity(data));
  }

  async update(id: string, entity: Partial<Employee>, clinicId: string): Promise<Result<Employee>> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('employees')
      .update({
        name: entity.name,
        email: entity.email,
        phone: entity.phone,
        is_active: entity.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('clinic_id', clinicId)
      .select()
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Failed to update employee");
    }

    return Result.ok(this.mapToEntity(data));
  }

  async delete(id: string, clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .eq('clinic_id', clinicId);

    if (error) {
      return Result.fail(error.message);
    }

    return Result.ok(undefined as any);
  }

  async assignServices(employeeId: string, serviceIds: string[], clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    // Delete existing
    await supabase.from('employee_services').delete().eq('employee_id', employeeId);
    
    // Insert new
    if (serviceIds.length > 0) {
      const { error } = await supabase.from('employee_services').insert(
        serviceIds.map(sid => ({ employee_id: employeeId, service_id: sid }))
      );
      if (error) return Result.fail(error.message);
    }
    
    return Result.ok(undefined as any);
  }

  async getAssignedServices(employeeId: string, clinicId: string): Promise<Result<string[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('employee_services')
      .select('service_id')
      .eq('employee_id', employeeId);

    if (error) return Result.fail(error.message);
    return Result.ok((data || []).map(r => r.service_id));
  }

  private mapToEntity(data: any): Employee {
    return {
      id: data.id,
      clinic_id: data.clinic_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      is_active: data.is_active,
      service_ids: data.service_ids || [],
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  }
}
