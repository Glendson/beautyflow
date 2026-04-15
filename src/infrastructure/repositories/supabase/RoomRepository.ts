import { IRoomRepository } from "@/domain/room/IRoomRepository";
import { Room } from "@/domain/room/Room";
import { Result } from "@/lib/result";
import { PaginatedResult, createPaginatedResult, getPaginationParams } from "@/lib/pagination";
import { createClient } from "@/infrastructure/supabase/server";

export class RoomRepository implements IRoomRepository {
  // Explicit column selection to avoid N+1 queries and unnecessary data transfer
  private readonly defaultColumns = 'id,clinic_id,name,type';

  async findById(id: string, clinicId: string): Promise<Result<Room>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('rooms').select(this.defaultColumns).eq('id', id).eq('clinic_id', clinicId).single();
    if (error || !data) return Result.fail(error?.message || "Room not found");
    return Result.ok(this.mapToEntity(data as DBRoom));
  }
  async findAll(clinicId: string): Promise<Result<Room[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('rooms').select(this.defaultColumns).eq('clinic_id', clinicId).order('name');
    if (error) return Result.fail(error.message);
    return Result.ok(((data || []) as DBRoom[]).map(d => this.mapToEntity(d)));
  }

  /**
   * Find rooms with pagination support
   * Supports search: name, and filter by type
   * PERFORMANCE: Uses explicit select() and indexes on (clinic_id, type, name)
   * Response time target: < 100ms
   */
  async findAllPaginated(
    clinicId: string,
    page: number,
    pageSize: number,
    filters?: { search?: string; type?: 'room' | 'station' }
  ): Promise<Result<PaginatedResult<Room>>> {
    const supabase = await createClient();
    const { limit, offset } = getPaginationParams(page, pageSize);

    // Build queries
    let countQuery = supabase
      .from('rooms')
      .select('id', { count: 'exact' })
      .eq('clinic_id', clinicId);

    let dataQuery = supabase
      .from('rooms')
      .select(this.defaultColumns)
      .eq('clinic_id', clinicId);

    // Apply type filter
    if (filters?.type) {
      countQuery = countQuery.eq('type', filters.type);
      dataQuery = dataQuery.eq('type', filters.type);
    }

    // Apply search filter
    if (filters?.search) {
      const searchPattern = `%${filters.search}%`;
      countQuery = countQuery.ilike('name', searchPattern);
      dataQuery = dataQuery.ilike('name', searchPattern);
    }

    // Get count
    const { count, error: countError } = await countQuery;
    if (countError) return Result.fail(countError.message);

    // Get data with pagination
    const { data, error: dataError } = await dataQuery
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (dataError) return Result.fail(dataError.message);

    const total = count || 0;
    const rooms = (data || []).map((d) => this.mapToEntity(d as DBRoom));
    
    return Result.ok(createPaginatedResult(rooms, total, page, pageSize));
  }
  async create(entity: Partial<Room> & { clinic_id: string }): Promise<Result<Room>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('rooms').insert({
      clinic_id: entity.clinic_id,
      name: entity.name!,
      type: entity.type || 'room'
    }).select(this.defaultColumns).single();
    if (error || !data) return Result.fail(error?.message || "Failed to create room");
    return Result.ok(this.mapToEntity(data as DBRoom));
  }
  async update(id: string, entity: Partial<Room>, clinicId: string): Promise<Result<Room>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('rooms').update({
      name: entity.name,
      type: entity.type,
    }).eq('id', id).eq('clinic_id', clinicId).select(this.defaultColumns).single();
    if (error || !data) return Result.fail(error?.message || "Failed to update room");
    return Result.ok(this.mapToEntity(data as DBRoom));
  }
  async delete(id: string, clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase.from('rooms').delete().eq('id', id).eq('clinic_id', clinicId);
    if (error) return Result.fail(error.message);
    return Result.ok<void>(undefined);
  }
  
  private mapToEntity(data: DBRoom): Room {
    return {
      id: data.id,
      clinic_id: data.clinic_id,
      name: data.name,
      type: data.type === 'station' ? 'station' : 'room'
    };
  }
}

interface DBRoom {
  id: string;
  clinic_id: string;
  name: string;
  type: string;
}
