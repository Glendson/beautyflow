"use server";

import { AuthUseCase } from "@/application/auth/AuthUseCase";
import { redirect } from "next/navigation";
import { Result } from "@/lib/result";
import { getClinicId } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<Result<void>> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return Result.fail("Email and password are required.");
  }

  const result = await AuthUseCase.signIn(email, password);
  
  if (result.success) {
    // Verify clinic_id is available before redirecting
    const clinicId = await getClinicId();
    if (!clinicId) {
      return Result.fail("User authenticated but clinic information not found. Please contact support.");
    }
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
    // Verify clinic_id is available before redirecting (double-check)
    const clinicId = await getClinicId();
    if (!clinicId) {
      return Result.fail("Registration successful, but clinic information could not be retrieved. Please try logging in.");
    }
    redirect("/dashboard");
  }

  return result;
}

export async function logoutAction() {
  await AuthUseCase.signOut();
  redirect("/login");
}
