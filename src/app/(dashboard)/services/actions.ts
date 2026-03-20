"use server";

import { ServiceUseCases } from "@/application/service/ServiceUseCases";
import { revalidatePath } from "next/cache";

export async function createServiceAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const duration = parseInt(formData.get("duration")?.toString() || "0");
  const requires_room = formData.get("requires_room") === "true";

  if (!name || duration <= 0) {
    return { success: false, error: "Invalid input" };
  }

  const result = await ServiceUseCases.createService({
    name,
    duration,
    requires_room,
    requires_specialist: false,
    category_id: null,
    is_active: true
  });

  if (result.success) revalidatePath("/services");
  return result as any; // Narrowing bypass for actions
}

export async function deleteServiceAction(id: string) {
  const result = await ServiceUseCases.deleteService(id);
  if (result.success) revalidatePath("/services");
  return result;
}
