"use server";

import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import { revalidatePath } from "next/cache";

export async function createServiceAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const duration = parseInt(formData.get("duration_minutes")?.toString() || "0", 10);
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const isActive = formData.get("is_active") === "true";

  if (!name || duration <= 0 || price < 0) {
    return { success: false, error: "Invalid input" };
  }

  const result = await ServiceUseCases.createService({
    name,
    duration_minutes: duration,
    price,
    is_active: isActive,
    category_id: null
  });

  if (result.success) {
    revalidatePath("/services");
  }
  return result;
}

export async function deleteServiceAction(id: string) {
  const result = await ServiceUseCases.deleteService(id);
  if (result.success) {
    revalidatePath("/services");
  }
  return result;
}
