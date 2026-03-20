import { Result } from "@/lib/result";

export interface IRepository<T, ID = string> {
  findById(id: ID, clinicId: string): Promise<Result<T>>;
  findAll(clinicId: string): Promise<Result<T[]>>;
  create(entity: Partial<T> & { clinic_id: string }): Promise<Result<T>>;
  update(id: ID, entity: Partial<T>, clinicId: string): Promise<Result<T>>;
  delete(id: ID, clinicId: string): Promise<Result<void>>;
}
