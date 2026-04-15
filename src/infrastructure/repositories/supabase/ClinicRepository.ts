import { IClinicRepository } from "@/domain/clinic/IClinicRepository";
import { Clinic } from "@/domain/clinic/Clinic";
import { Result } from "@/lib/result";
import { createClient } from "@/infrastructure/supabase/server";

export class ClinicRepository implements IClinicRepository {
  // Explicit column selection: clinics table only has id, name, slug, created_at
  private readonly defaultColumns = 'id,name,slug,created_at';

  async findById(id: string): Promise<Result<Clinic>> {
    return this.findByIdDirect(id);
  }

  async findByIdDirect(id: string): Promise<Result<Clinic>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clinics")
      .select(this.defaultColumns)
      .eq("id", id)
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Clinic not found");
    }

    return Result.ok(this.mapToEntity(data as unknown as DBClinic));
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
        slug: entity.slug!
      })
      .select(this.defaultColumns)
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Failed to create clinic");
    }

    return Result.ok(this.mapToEntity(data as unknown as DBClinic));
  }

  async update(
    id: string,
    data: Partial<Clinic>,
    _clinicId?: string
  ): Promise<Result<Clinic>> {
    const supabase = await createClient();

    // Build update payload - only include fields that exist in database
    const updatePayload: Partial<DBClinic> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.slug !== undefined) updatePayload.slug = data.slug;

    const { data: updatedData, error } = await supabase
      .from("clinics")
      .update(updatePayload)
      .eq("id", id)
      .select(this.defaultColumns)
      .single();

    if (error || !updatedData) {
      return Result.fail(error?.message || "Failed to update clinic");
    }

    return Result.ok(this.mapToEntity(updatedData as unknown as DBClinic));
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
      slug: data.slug,
      created_at: data.created_at
    };
  }
}

interface DBClinic {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}
