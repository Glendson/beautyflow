"use server";
import { RoomService } from "@/lib/services";
import { revalidatePath } from "next/cache";

export async function createRoomAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const type = formData.get("type")?.toString() as 'room' | 'station';

  if (!name || (type !== 'room' && type !== 'station')) {
    return { success: false, error: "Invalid input" };
  }

  const result = await RoomService.create({ name, type });
  if (result.success) revalidatePath("/rooms");
  return result;
}

export async function deleteRoomAction(id: string) {
  const result = await RoomService.delete(id);
  if (result.success) revalidatePath("/rooms");
  return result;
}
