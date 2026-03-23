import { createClient } from "@/infrastructure/supabase/server";
import { Result } from "@/lib/result";
import { signUpWithBypass } from "@/lib/auth-admin";

export class AuthUseCase {
  static async signUp(
    email: string,
    password: string,
    clinicName: string,
    firstName: string,
    lastName: string
  ): Promise<Result<{ clinicId: string }>> {
    const supabase = await createClient();

    console.log("👤 [AuthUseCase.signUp] Step 1: Creating user...");
    
    // Try admin signup first (bypasses email validation if SERVICE_ROLE_KEY available)
    let authData: any;
    let authError: any;
    
    console.log("👤 [AuthUseCase.signUp] Attempting admin signup (bypasses email validation)...");
    const adminResult = await signUpWithBypass(email, password, {
      emailConfirmed: true,
    });

    if (adminResult.data) {
      console.log("✅ [AuthUseCase.signUp] Admin signup succeeded!");
      authData = adminResult.data;
      authError = null;
    } else {
      console.log("⚠️ [AuthUseCase.signUp] Admin signup not available, trying regular signup...");
      // Fallback to regular signup (may fail if email validation is strict)
      const signupResult = await supabase.auth.signUp({
        email,
        password,
      });
      
      authData = signupResult.data;
      authError = signupResult.error;
    }

    if (authError || !authData.user) {
      console.error("❌ [AuthUseCase.signUp] User creation failed:", authError?.message);
      return Result.fail(authError?.message || "Failed to create user");
    }
    
    console.log("✅ [AuthUseCase.signUp] User created:", authData.user.id);

    console.log("👤 [AuthUseCase.signUp] Step 2: Signing in to establish session...");
    // 2. Faz signIn para estabelecer a sessão nos cookies do servidor
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("❌ [AuthUseCase.signUp] SignIn failed:", signInError.message);
      return Result.fail(signInError.message);
    }
    
    console.log("✅ [AuthUseCase.signUp] Session established");

    // 3. Gera o slug da clínica
    const clinicSlug =
      clinicName.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 6);

    console.log("👤 [AuthUseCase.signUp] Step 3: Calling register_clinic RPC...");
    // 4. Registra a clínica via RPC (agora com sessão ativa)
    const { data: clinicId, error: rpcError } = await supabase.rpc(
      "register_clinic",
      {
        clinic_name: clinicName,
        clinic_slug: clinicSlug,
        first_name: firstName,
        last_name: lastName,
      }
    );

    if (rpcError) {
      console.error("❌ [AuthUseCase.signUp] RPC failed:", rpcError.message);
      return Result.fail(rpcError.message);
    }
    
    console.log("✅ [AuthUseCase.signUp] Clinic created:", clinicId);

    return Result.ok({ clinicId: clinicId as string });
  }

  static async signIn(
    email: string,
    password: string
  ): Promise<Result<void>> {
    const supabase = await createClient();

    console.log("🔐 [AuthUseCase.signIn] Attempting login...");
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ [AuthUseCase.signIn] Login failed:", error.message);
      return Result.fail(error.message);
    }
    
    console.log("✅ [AuthUseCase.signIn] Login successful");

    return Result.ok(undefined);
  }

  static async signOut(): Promise<Result<void>> {
    const supabase = await createClient();

    console.log("🚪 [AuthUseCase.signOut] Signing out...");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ [AuthUseCase.signOut] Signout failed:", error.message);
      return Result.fail(error.message);
    }
    
    console.log("✅ [AuthUseCase.signOut] Signed out");

    return Result.ok(undefined);
  }
}