import { RoomRepository } from "@/infrastructure/repositories/supabase/RoomRepository";
import { Room } from "@/domain/room/Room";
import { Result } from "@/lib/result";
import { getClinicId } from "@/lib/auth";

const repository = new RoomRepository();

export class RoomUseCases {
  static async getRooms(): Promise<Result<Room[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }

  static async getRoomById(id: string): Promise<Result<Room>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findById(id, clinicId);
  }

  static async createRoom(data: Omit<Room, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Room>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.create({ ...data, clinic_id: clinicId });
  }

  static async updateRoom(id: string, data: Partial<Room>): Promise<Result<Room>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.update(id, data, clinicId);
  }

  static async deleteRoom(id: string): Promise<Result<void>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.delete(id, clinicId);
  }
}
