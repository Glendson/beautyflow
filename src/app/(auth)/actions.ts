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

  console.log("🔐 [LOGIN] Starting login for:", email);

  const result = await AuthUseCase.signIn(email, password);
  console.log("🔐 [LOGIN] AuthUseCase result:", result.success ? "✅ SUCCESS" : "❌ FAILED");
  
  if (result.success) {
    // Verify clinic_id is available before redirecting
    console.log("🔐 [LOGIN] Getting clinic ID...");
    const clinicId = await getClinicId();
    
    if (!clinicId) {
      console.error("❌ [LOGIN] No clinic ID found!");
      return Result.fail("User authenticated but clinic information not found. Please contact support.");
    }
    
    console.log("✅ [LOGIN] Clinic ID found:", clinicId);
    console.log("🔐 [LOGIN] Redirecting to /dashboard...");
    
    // Add delay to ensure JWT is fully propagated through all systems
    await new Promise(resolve => setTimeout(resolve, 800));
    
    redirect("/dashboard");
  }

  console.log("❌ [LOGIN] Login failed:", result.error);
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

  console.log("🔐 [SIGNUP] Starting signup for:", email);

  const result = await AuthUseCase.signUp(email, password, clinicName, firstName, lastName ?? "");
  console.log("🔐 [SIGNUP] AuthUseCase result:", result.success ? "✅ SUCCESS" : "❌ FAILED");

  if (result.success) {
    // Verify clinic_id is available before redirecting (with retry logic)
    console.log("🔐 [SIGNUP] Getting clinic ID...");
    const clinicId = await getClinicId();
    
    if (!clinicId) {
      console.error("❌ [SIGNUP] No clinic ID found after signup!");
      return Result.fail("Registration successful, but clinic information could not be retrieved. Please try logging in.");
    }
    
    console.log("✅ [SIGNUP] Clinic ID found:", clinicId);
    console.log("🔐 [SIGNUP] Redirecting to /dashboard...");
    
    // Add delay to ensure JWT is fully propagated through all systems
    await new Promise(resolve => setTimeout(resolve, 800));
    
    redirect("/dashboard");
  }

  console.log("❌ [SIGNUP] Signup failed:", result.error);
  return result;
}

export async function logoutAction() {
  await AuthUseCase.signOut();
  redirect("/login");
}
