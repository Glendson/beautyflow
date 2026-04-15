import { IRepository } from "@/domain/repository";
import { Client } from "@/domain/client/Client";
import { Result } from "@/lib/result";
import { PaginatedResult, createPaginatedResult, getPaginationParams } from "@/lib/pagination";
import { createClient } from "@/infrastructure/supabase/server";
import { escapeLike, validateSearchInput } from "@/lib/sql-escaping";

export interface IClientRepository extends IRepository<Client> {}

export class ClientRepository implements IClientRepository {
  // Explicit column selection to avoid N+1 queries and unnecessary data transfer
  private readonly defaultColumns = 'id,clinic_id,name,email,phone';

  async findById(id: string, clinicId: string): Promise<Result<Client>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').select(this.defaultColumns).eq('id', id).eq('clinic_id', clinicId).single();
    if (error || !data) return Result.fail(error?.message || "Client not found");
    return Result.ok(this.mapToEntity(data as DBClient));
  }
  async findAll(clinicId: string): Promise<Result<Client[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').select(this.defaultColumns).eq('clinic_id', clinicId).order('name');
    if (error) return Result.fail(error.message);
    return Result.ok(((data || []) as DBClient[]).map(d => this.mapToEntity(d)));
  }

  /**
   * Find clients with pagination support
   * Supports search: name, email
   * PERFORMANCE: Uses explicit select() and indexes on (clinic_id, name, email)
   * Response time target: < 100ms
   */
  async findAllPaginated(
    clinicId: string,
    page: number,
    pageSize: number,
    filters?: { search?: string }
  ): Promise<Result<PaginatedResult<Client>>> {
    const supabase = await createClient();
    const { limit, offset } = getPaginationParams(page, pageSize);

    // Build queries
    let countQuery = supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .eq('clinic_id', clinicId);

    let dataQuery = supabase
      .from('clients')
      .select(this.defaultColumns)
      .eq('clinic_id', clinicId);

    // Apply search filter with proper escaping
    if (filters?.search) {
      const validatedSearch = validateSearchInput(filters.search);
      if (validatedSearch) {
        // Escape % and _ to prevent SQL injection via LIKE pattern
        const escaped = escapeLike(validatedSearch);
        const searchPattern = `%${escaped}%`;
        
        countQuery = countQuery.or(`name.ilike.${searchPattern},email.ilike.${searchPattern}`);
        // For data query, use ilike for either name or email
        dataQuery = supabase
          .from('clients')
          .select(this.defaultColumns)
          .eq('clinic_id', clinicId)
          .or(`name.ilike.${searchPattern},email.ilike.${searchPattern}`);
      }
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
    const clients = (data || []).map((d) => this.mapToEntity(d as DBClient));
    
    return Result.ok(createPaginatedResult(clients, total, page, pageSize));
  }
  async create(entity: Partial<Client> & { clinic_id: string }): Promise<Result<Client>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').insert({ clinic_id: entity.clinic_id, name: entity.name!, email: entity.email || null, phone: entity.phone || null }).select(this.defaultColumns).single();
    if (error || !data) return Result.fail(error?.message || "Failed to create client");
    return Result.ok(this.mapToEntity(data as DBClient));
  }
  async update(id: string, entity: Partial<Client>, clinicId: string): Promise<Result<Client>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').update({ name: entity.name, email: entity.email, phone: entity.phone }).eq('id', id).eq('clinic_id', clinicId).select(this.defaultColumns).single();
    if (error || !data) return Result.fail(error?.message || "Failed to update client");
    return Result.ok(this.mapToEntity(data as DBClient));
  }
  async delete(id: string, clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase.from('clients').delete().eq('id', id).eq('clinic_id', clinicId);
    if (error) return Result.fail(error.message);
    return Result.ok<void>(undefined);
  }

  private mapToEntity(data: DBClient): Client {
    return {
      id: data.id,
      clinic_id: data.clinic_id,
      name: data.name,
      email: data.email,
      phone: data.phone
    };
  }
}

interface DBClient {
  id: string;
  clinic_id: string;
  name: string;
  email: string | null;
  phone: string | null;
}
