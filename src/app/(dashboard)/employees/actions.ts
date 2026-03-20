"use server";

import { EmployeeUseCases } from "@/application/employee/EmployeeUseCases";
import { revalidatePath } from "next/cache";

export async function createEmployeeAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString() || null;
  const phone = formData.get("phone")?.toString() || null;
  const isActive = formData.get("is_active") === "true";
  const serviceIds = formData.getAll("service_ids").map(s => s.toString());

  if (!name) {
    return { success: false, error: "Name is required" };
  }

  const result = await EmployeeUseCases.createEmployee({
    name,
    email,
    phone,
    is_active: isActive,
    service_ids: serviceIds
  });

  if (result.success) {
    revalidatePath("/employees");
  }
  return result;
}

export async function deleteEmployeeAction(id: string) {
  const result = await EmployeeUseCases.deleteEmployee(id);
  if (result.success) {
    revalidatePath("/employees");
  }
  return result;
}
