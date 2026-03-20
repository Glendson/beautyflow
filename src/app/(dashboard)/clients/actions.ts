"use server";
import { ClientUseCases } from "@/application/client/ClientUseCases";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString() || null;
  const phone = formData.get("phone")?.toString() || null;
  const notes = formData.get("notes")?.toString() || null;

  if (!name) return { success: false, error: "Name is required" };

  const result = await ClientUseCases.createClient({ name, email, phone, notes });
  if (result.success) revalidatePath("/clients");
  return result;
}

export async function deleteClientAction(id: string) {
  const result = await ClientUseCases.deleteClient(id);
  if (result.success) revalidatePath("/clients");
  return result;
}
