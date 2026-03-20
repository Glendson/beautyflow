import { IRoomRepository } from "@/domain/room/IRoomRepository";
import { Room } from "@/domain/room/Room";
import { Result } from "@/lib/result";
import { createClient } from "@/infrastructure/supabase/server";

export class RoomRepository implements IRoomRepository {
  async findById(id: string, clinicId: string): Promise<Result<Room>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .eq('clinic_id', clinicId)
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Room not found");
    }

    return Result.ok(this.mapToEntity(data));
  }

  async findAll(clinicId: string): Promise<Result<Room[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('clinic_id', clinicId)
      .order('name');

    if (error) {
      return Result.fail(error.message);
    }

    return Result.ok((data || []).map(this.mapToEntity));
  }

  async create(entity: Partial<Room> & { clinic_id: string }): Promise<Result<Room>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        clinic_id: entity.clinic_id,
        name: entity.name!,
        type: entity.type || 'room',
        is_active: entity.is_active ?? true,
      })
      .select()
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Failed to create room");
    }

    return Result.ok(this.mapToEntity(data));
  }

  async update(id: string, entity: Partial<Room>, clinicId: string): Promise<Result<Room>> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('rooms')
      .update({
        name: entity.name,
        type: entity.type,
        is_active: entity.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('clinic_id', clinicId)
      .select()
      .single();

    if (error || !data) {
      return Result.fail(error?.message || "Failed to update room");
    }

    return Result.ok(this.mapToEntity(data));
  }

  async delete(id: string, clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id)
      .eq('clinic_id', clinicId);

    if (error) {
      return Result.fail(error.message);
    }

    return Result.ok(undefined as any);
  }

  private mapToEntity(data: any): Room {
    return {
      id: data.id,
      clinic_id: data.clinic_id,
      name: data.name,
      type: data.type,
      is_active: data.is_active,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  }
}
