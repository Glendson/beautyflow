/**
 * Room Service
 *
 * Orquestrates room/station-related operations:
 * - Create, read, update, delete rooms
 * - Manage room availability
 * - Handle multi-tenancy
 */

import { RoomUseCases } from "@/application/room/RoomUseCases";
import { Room } from "@/domain/room/Room";
import { Result } from "@/lib/result";
import { PaginatedResult } from "@/lib/pagination";

export const RoomService = {
  /**
   * Get all rooms for the clinic
   */
  async getAll(): Promise<Result<Room[]>> {
    return RoomUseCases.getRooms();
  },

  /**
   * Get paginated rooms
   */
  async getPaginated(
    page: number,
    pageSize: number
  ): Promise<Result<PaginatedResult<Room>>> {
    return RoomUseCases.getRoomsPaginated(page, pageSize);
  },

  /**
   * Get room by ID
   */
  async getById(id: string): Promise<Result<Room>> {
    return RoomUseCases.getRoomById(id);
  },

  /**
   * Create a new room
   */
  async create(data: {
    name: string;
    type: "room" | "station";
  }): Promise<Result<Room>> {
    return RoomUseCases.createRoom(data);
  },

  /**
   * Update room information
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      type: "room" | "station";
    }>
  ): Promise<Result<Room>> {
    return RoomUseCases.updateRoom(id, data);
  },

  /**
   * Delete a room
   */
  async delete(id: string): Promise<Result<void>> {
    return RoomUseCases.deleteRoom(id);
  },
};
