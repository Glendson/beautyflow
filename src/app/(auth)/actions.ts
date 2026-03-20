"use server";

import { AuthUseCase } from "@/application/auth/AuthUseCase";
import { redirect } from "next/navigation";
import { Result } from "@/lib/result";

export async function loginAction(formData: FormData): Promise<Result<void>> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return Result.fail("Email and password are required.");
  }

  const result = await AuthUseCase.signIn(email, password);
  
  if (result.success) {
    redirect("/dashboard");
  }

  return result;
}

export async function signupAction(formData: FormData): Promise<Result<{ clinicId: string }>> {
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const clinicName = formData.get("clinicName")?.toString();

  if (!email || !password || !clinicName || !firstName) {
    return Result.fail("All fields are required.");
  }

  const result = await AuthUseCase.signUp(email, password, clinicName, firstName, lastName ?? "");

  if (result.success) {
    redirect("/dashboard");
  }

  return result;
}

export async function logoutAction() {
  await AuthUseCase.signOut();
  redirect("/login");
}
