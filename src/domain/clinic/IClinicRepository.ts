import { IRepository } from "@/domain/repository";
import { Clinic } from "./Clinic";
import { Result } from "@/lib/result";

export interface IClinicRepository extends IRepository<Clinic> {
  findByIdDirect(id: string): Promise<Result<Clinic>>;
}
