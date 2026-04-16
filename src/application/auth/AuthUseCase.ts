import { createClient } from "@/infrastructure/supabase/server";
import { Result } from "@/lib/result";
import { signUpWithBypass } from "@/lib/auth-admin";
import { logger } from "@/lib/logger";

export class AuthUseCase {
  static async signUp(
    email: string,
    password: string,
    clinicName: string,
    firstName: string,
    lastName: string
  ): Promise<Result<{ clinicId: string }>> {
    const supabase = await createClient();

    logger.debug("SignUp - Step 1: Creating user");
    
    // Try admin signup first (bypasses email validation if SERVICE_ROLE_KEY available)
    let authData: { user?: { id: string } } | undefined;
    let authError: { message?: string } | null;
    
    logger.debug("SignUp - Attempting admin signup");
    const adminResult = await signUpWithBypass(email, password, {
      emailConfirmed: true,
    });

    if (adminResult.data) {
      logger.success("Admin signup succeeded");
      authData = adminResult.data;
      authError = null;
    } else {
      logger.info("Admin signup not available, trying regular signup");
      // Fallback to regular signup (may fail if email validation is strict)
      const signupResult = await supabase.auth.signUp({
        email,
        password,
      });
      
      authData = signupResult.data as typeof authData;
      authError = signupResult.error;
    }

    if (authError || !authData?.user) {
      logger.error("User creation failed", authError);
      return Result.fail(authError?.message || "Failed to create user");
    }
    
    logger.success("User created successfully");

    logger.debug("SignUp - Step 2: Signing in to establish session");
    // 2. Faz signIn para estabelecer a sessão nos cookies do servidor
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      logger.error("SignIn failed", signInError);
      return Result.fail(signInError.message);
    }
    
    logger.success("Session established");

    // 3. Gera o slug da clínica
    const clinicSlug =
      clinicName.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 6);

    logger.debug("SignUp - Step 3: Calling register_clinic RPC");
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
      logger.error("RPC register_clinic failed", rpcError);
      return Result.fail(rpcError.message);
    }
    
    logger.success("Clinic created successfully");

    return Result.ok({ clinicId: clinicId as string });
  }

  static async signIn(
    email: string,
    password: string
  ): Promise<Result<void>> {
    const supabase = await createClient();

    logger.debug("SignIn - Attempting login");
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error("Login failed", error);
      return Result.fail(error.message);
    }
    
    logger.success("Login successful");

    return Result.ok(undefined);
  }

  static async signOut(): Promise<Result<void>> {
    const supabase = await createClient();

    logger.debug("SignOut - Signing out");

    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error("Signout failed", error);
      return Result.fail(error.message);
    }
    
    logger.success("Signed out successfully");

    return Result.ok(undefined);
  }
}