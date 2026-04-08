"use server";
import { ClientService } from "@/lib/services";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString() || null;
  const phone = formData.get("phone")?.toString() || null;

  if (!name) return { success: false, error: "Name is required" };

  const result = await ClientService.create({ name, email, phone });
  
  if (result.success) revalidatePath("/clients");
  return result;
}

export async function deleteClientAction(id: string) {
  const result = await ClientService.delete(id);
  if (result.success) revalidatePath("/clients");
  return result;
}