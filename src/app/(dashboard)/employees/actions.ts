"use server";
import { EmployeeUseCases } from "@/application/employee/EmployeeUseCases";
import { revalidatePath } from "next/cache";

export async function createEmployeeAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const serviceIdsRaw = formData.get("service_ids")?.toString();

  if (!name) return { success: false, error: "Invalid input" };
  const serviceIds = serviceIdsRaw ? serviceIdsRaw.split(",") : [];

  const result = await EmployeeUseCases.createEmployee(
    { name },
    serviceIds.length > 0 ? serviceIds : undefined
  );

  if (result.success) revalidatePath("/employees");
  return result as any;
}

export async function deleteEmployeeAction(id: string) {
  const result = await EmployeeUseCases.deleteEmployee(id);
  if (result.success) revalidatePath("/employees");
  return result;
}
