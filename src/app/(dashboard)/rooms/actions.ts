"use server";

import { RoomUseCases } from "@/application/room/RoomUseCases";
import { revalidatePath } from "next/cache";

export async function createRoomAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const type = formData.get("type")?.toString() as 'room' | 'station';
  const isActive = formData.get("is_active") === "true";

  if (!name || (type !== 'room' && type !== 'station')) {
    return { success: false, error: "Invalid input" };
  }

  const result = await RoomUseCases.createRoom({
    name,
    type,
    is_active: isActive
  });

  if (result.success) {
    revalidatePath("/rooms");
  }
  return result;
}

export async function deleteRoomAction(id: string) {
  const result = await RoomUseCases.deleteRoom(id);
  if (result.success) {
    revalidatePath("/rooms");
  }
  return result;
}
