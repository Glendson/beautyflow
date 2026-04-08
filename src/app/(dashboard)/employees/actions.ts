"use server";
import { EmployeeService } from "@/lib/services";
import { revalidatePath } from "next/cache";

export async function createEmployeeAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString() || "";
  const phone = formData.get("phone")?.toString();
  const serviceIdsRaw = formData.get("service_ids")?.toString();

  if (!name || !email) return { success: false, error: "Name and email are required" };
  
  const serviceIds = serviceIdsRaw ? serviceIdsRaw.split(",") : [];

  const result = await EmployeeService.create({ name, email, phone });
  
  if (result.success && serviceIds.length > 0) {
    await EmployeeService.assignServices(result.data!.id, serviceIds);
  }

  if (result.success) revalidatePath("/employees");
  return result;
}

export async function deleteEmployeeAction(id: string) {
  const result = await EmployeeService.delete(id);
  if (result.success) revalidatePath("/employees");
  return result;
}
