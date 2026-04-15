import { IServiceRepository } from "@/domain/service/IServiceRepository";
import { Service } from "@/domain/service/Service";
import { Result } from "@/lib/result";
import { PaginatedResult, createPaginatedResult, getPaginationParams } from "@/lib/pagination";
import { createClient } from "@/infrastructure/supabase/server";

export class ServiceRepository implements IServiceRepository {
  // Explicit column selection to avoid N+1 queries and unnecessary data transfer
  private readonly defaultColumns = 'id,clinic_id,category_id,name,duration,requires_room,requires_specialist,is_active';

  async findById(id: string, clinicId: string): Promise<Result<Service>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('services').select(this.defaultColumns).eq('id', id).eq('clinic_id', clinicId).single();
    if (error || !data) return Result.fail(error?.message || "Service not found");
    return Result.ok(this.mapToEntity(data as DBService));
  }

  async findAll(clinicId: string): Promise<Result<Service[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('services').select(this.defaultColumns).eq('clinic_id', clinicId).order('name');
    if (error) return Result.fail(error.message);
    return Result.ok(((data || []) as DBService[]).map(d => this.mapToEntity(d)));
  }

  async findByCategory(categoryId: string, clinicId: string): Promise<Result<Service[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('services').select(this.defaultColumns).eq('category_id', categoryId).eq('clinic_id', clinicId).order('name');
    if (error) return Result.fail(error.message);
    return Result.ok(((data || []) as DBService[]).map(d => this.mapToEntity(d)));
  }

  /**
   * Find services with pagination support
   * Supports search: name, and filter by category_id and is_active
   * PERFORMANCE: Uses explicit select() and indexes on (clinic_id, category_id, is_active, name)
   * Response time target: < 100ms
   */
  async findAllPaginated(
    clinicId: string,
    page: number,
    pageSize: number,
    filters?: { search?: string; categoryId?: string; isActive?: boolean }
  ): Promise<Result<PaginatedResult<Service>>> {
    const supabase = await createClient();
    const { limit, offset } = getPaginationParams(page, pageSize);

    // Build queries
    let countQuery = supabase
      .from('services')
      .select('id', { count: 'exact' })
      .eq('clinic_id', clinicId);

    let dataQuery = supabase
      .from('services')
      .select(this.defaultColumns)
      .eq('clinic_id', clinicId);

    // Apply category filter
    if (filters?.categoryId) {
      countQuery = countQuery.eq('category_id', filters.categoryId);
      dataQuery = dataQuery.eq('category_id', filters.categoryId);
    }

    // Apply active filter
    if (filters?.isActive !== undefined) {
      countQuery = countQuery.eq('is_active', filters.isActive);
      dataQuery = dataQuery.eq('is_active', filters.isActive);
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
    const services = (data || []).map((d) => this.mapToEntity(d as DBService));
    
    return Result.ok(createPaginatedResult(services, total, page, pageSize));
  }

  async create(entity: Partial<Service> & { clinic_id: string }): Promise<Result<Service>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('services').insert({
      clinic_id: entity.clinic_id,
      category_id: entity.category_id || null,
      name: entity.name!,
      duration: entity.duration!,
      requires_room: entity.requires_room ?? false,
      requires_specialist: entity.requires_specialist ?? false,
      is_active: entity.is_active ?? true,
    }).select(this.defaultColumns).single();
    if (error || !data) return Result.fail(error?.message || "Failed to create service");
    return Result.ok(this.mapToEntity(data as DBService));
  }

  async update(id: string, entity: Partial<Service>, clinicId: string): Promise<Result<Service>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('services').update({
      category_id: entity.category_id,
      name: entity.name,
      duration: entity.duration,
      requires_room: entity.requires_room,
      requires_specialist: entity.requires_specialist,
      is_active: entity.is_active,
    }).eq('id', id).eq('clinic_id', clinicId).select(this.defaultColumns).single();
    if (error || !data) return Result.fail(error?.message || "Failed to update service");
    return Result.ok(this.mapToEntity(data as DBService));
  }

  async delete(id: string, clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase.from('services').delete().eq('id', id).eq('clinic_id', clinicId);
    if (error) return Result.fail(error.message);
    return Result.ok<void>(undefined);
  }

  private mapToEntity(data: DBService): Service {
    return {
      id: data.id,
      clinic_id: data.clinic_id,
      category_id: data.category_id,
      name: data.name,
      duration: data.duration,
      requires_room: data.requires_room,
      requires_specialist: data.requires_specialist,
      is_active: data.is_active ?? true
    };
  }
}

interface DBService {
  id: string;
  clinic_id: string;
  category_id: string | null;
  name: string;
  duration: number;
  requires_room: boolean;
  requires_specialist: boolean;
  is_active?: boolean | null;
}

