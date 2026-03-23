"use server";
import { ClientUseCases } from "@/application/client/ClientUseCases";
import { revalidatePath } from "next/cache";
import { getClinicId } from "@/lib/auth";

export async function createClientAction(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString() || null;
  const phone = formData.get("phone")?.toString() || null;

  if (!name) return { success: false, error: "Name is required" };

  // Debug: verificar se clinic_id está sendo encontrado
  const clinicId = await getClinicId();
  console.log("🔍 [createClientAction] clinicId:", clinicId);

  const result = await ClientUseCases.createClient({ name, email, phone });
  console.log("🔍 [createClientAction] result:", JSON.stringify(result));
  
  if (result.success) revalidatePath("/clients");
  return result as any;
}

export async function deleteClientAction(id: string) {
  const result = await ClientUseCases.deleteClient(id);
  if (result.success) revalidatePath("/clients");
  return result;
}