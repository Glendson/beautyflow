import { IRepository } from "@/domain/repository";
import { Service } from "./Service";
import { Result } from "@/lib/result";

export interface IServiceRepository extends IRepository<Service> {
  findByCategory(categoryId: string, clinicId: string): Promise<Result<Service[]>>;
}
