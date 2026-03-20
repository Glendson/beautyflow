import { IRepository } from "@/domain/repository";
import { Client } from "@/domain/client/Client";
import { Result } from "@/lib/result";
import { createClient } from "@/infrastructure/supabase/server";

export interface IClientRepository extends IRepository<Client> {}

export class ClientRepository implements IClientRepository {
  async findById(id: string, clinicId: string): Promise<Result<Client>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).eq('clinic_id', clinicId).single();
    if (error || !data) return Result.fail(error?.message || "Client not found");
    return Result.ok(this.mapToEntity(data));
  }
  async findAll(clinicId: string): Promise<Result<Client[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').select('*').eq('clinic_id', clinicId).order('name');
    if (error) return Result.fail(error.message);
    return Result.ok((data || []).map(this.mapToEntity));
  }
  async create(entity: Partial<Client> & { clinic_id: string }): Promise<Result<Client>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').insert({ clinic_id: entity.clinic_id, name: entity.name!, email: entity.email || null, phone: entity.phone || null, notes: entity.notes || null }).select().single();
    if (error || !data) return Result.fail(error?.message || "Failed to create client");
    return Result.ok(this.mapToEntity(data));
  }
  async update(id: string, entity: Partial<Client>, clinicId: string): Promise<Result<Client>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').update({ name: entity.name, email: entity.email, phone: entity.phone, notes: entity.notes, updated_at: new Date().toISOString() }).eq('id', id).eq('clinic_id', clinicId).select().single();
    if (error || !data) return Result.fail(error?.message || "Failed to update client");
    return Result.ok(this.mapToEntity(data));
  }
  async delete(id: string, clinicId: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase.from('clients').delete().eq('id', id).eq('clinic_id', clinicId);
    if (error) return Result.fail(error.message);
    return Result.ok(undefined as any);
  }
  private mapToEntity(data: any): Client {
    return { id: data.id, clinic_id: data.clinic_id, name: data.name, email: data.email, phone: data.phone, notes: data.notes, created_at: new Date(data.created_at), updated_at: new Date(data.updated_at) };
  }
}
