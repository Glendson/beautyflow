import { RoomRepository } from "@/infrastructure/repositories/supabase/RoomRepository";
import { Room } from "@/domain/room/Room";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";
import { getClinicId } from "@/lib/auth";

const repository = new RoomRepository();

export class RoomUseCases {
  static async getRooms(): Promise<Result<Room[]>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAll(clinicId);
  }

  static async getRoomsPaginated(
    page: number,
    pageSize: number,
    filters?: { search?: string; type?: 'room' | 'station' }
  ): Promise<Result<PaginatedResult<Room>>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findAllPaginated(clinicId, page, pageSize, filters);
  }

  static async getRoomById(id: string): Promise<Result<Room>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.findById(id, clinicId);
  }

  static async createRoom(data: Omit<Room, "id" | "clinic_id" | "created_at" | "updated_at">): Promise<Result<Room>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // Validation: name not empty
    if (!data.name || data.name.trim().length === 0) {
      return Result.fail("Room name cannot be empty");
    }

    // Validation: type must be valid
    if (data.type && !['room', 'station'].includes(data.type)) {
      return Result.fail("Room type must be either 'room' or 'station'");
    }

    return repository.create({ ...data, clinic_id: clinicId });
  }

  static async updateRoom(id: string, data: Partial<Room>): Promise<Result<Room>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");

    // Validation: name not empty (if provided)
    if (data.name && data.name.trim().length === 0) {
      return Result.fail("Room name cannot be empty");
    }

    // Validation: type must be valid (if provided)
    if (data.type && !['room', 'station'].includes(data.type)) {
      return Result.fail("Room type must be either 'room' or 'station'");
    }

    return repository.update(id, data, clinicId);
  }

  static async deleteRoom(id: string): Promise<Result<void>> {
    const clinicId = await getClinicId();
    if (!clinicId) return Result.fail("Unauthorized");
    return repository.delete(id, clinicId);
  }
}
