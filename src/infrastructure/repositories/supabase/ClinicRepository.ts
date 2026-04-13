import { IClinicRepository } from "@/domain/clinic/IClinicRepository";
import { Clinic } from "@/domain/clinic/Clinic";
import { Result } from "@/lib/result";
import { createClient } from "@/infrastructure/supabase/server";

export class ClinicRepository implements IClinicRepository {
  async findById(id: string): Promise<Result<Clinic>> {
    return this.findByIdDirect(id);
  }

  async findByIdDirect(id: string): Promise<Result<Clinic>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Clinic not found");
    }

    return Result.ok(this.mapToEntity(data as DBClinic));
  }

  async findAll(): Promise<Result<Clinic[]>> {
    // Not used for clinics, but required by interface
    return Result.fail("Not implemented");
  }

  async create(entity: Partial<Clinic>): Promise<Result<Clinic>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clinics")
      .insert({
        name: entity.name!,
        email: entity.email,
        phone: entity.phone,
        address: entity.address,
        working_hours_start: entity.working_hours_start || "08:00",
        working_hours_end: entity.working_hours_end || "18:00",
        logo_url: entity.logo_url || null,
      })
      .select()
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Failed to create clinic");
    }

    return Result.ok(this.mapToEntity(data as DBClinic));
  }

  async update(
    id: string,
    data: Partial<Clinic>,
    _clinicId?: string
  ): Promise<Result<Clinic>> {
    const supabase = await createClient();

    // Build update payload - only include fields that are being updated
    const updatePayload: Partial<DBClinic> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.email !== undefined) updatePayload.email = data.email;
    if (data.phone !== undefined) updatePayload.phone = data.phone;
    if (data.address !== undefined) updatePayload.address = data.address;
    if (data.working_hours_start !== undefined) updatePayload.working_hours_start = data.working_hours_start;
    if (data.working_hours_end !== undefined) updatePayload.working_hours_end = data.working_hours_end;
    if (data.logo_url !== undefined) updatePayload.logo_url = data.logo_url;

    const { data: updatedData, error } = await supabase
      .from("clinics")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !updatedData) {
      return Result.fail(error?.message || "Failed to update clinic");
    }

    return Result.ok(this.mapToEntity(updatedData as DBClinic));
  }

  async delete(id: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase.from("clinics").delete().eq("id", id);

    if (error) {
      return Result.fail(error.message);
    }

    return Result.ok<void>(undefined);
  }

  private mapToEntity(data: DBClinic): Clinic {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      working_hours_start: data.working_hours_start,
      working_hours_end: data.working_hours_end,
      logo_url: data.logo_url || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}

interface DBClinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  working_hours_start: string;
  working_hours_end: string;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
}
