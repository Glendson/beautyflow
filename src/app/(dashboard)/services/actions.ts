"use server";

import { ServiceService } from "@/lib/services";
import { revalidatePath } from "next/cache";

export async function createServiceAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const duration = parseInt(formData.get("duration")?.toString() || "0");
  const category_id = formData.get("category_id")?.toString() || "";
  const price = parseFloat(formData.get("price")?.toString() || "0");

  if (!name || duration <= 0) {
    return { success: false, error: "Invalid input" };
  }

  const result = await ServiceService.create({
    name,
    duration_minutes: duration,
    category_id,
    price
  });

  if (result.success) revalidatePath("/services");
  return result;
}

export async function deleteServiceAction(id: string) {
  const result = await ServiceService.delete(id);
  if (result.success) revalidatePath("/services");
  return result;
}
