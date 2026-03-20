import { createClient } from "@/infrastructure/supabase/server";
import { Result } from "@/lib/result";

export class AuthUseCase {
  static async signUp(email: string, password: string, clinicName: string, firstName: string, lastName: string): Promise<Result<{ clinicId: string }>> {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return Result.fail(authError?.message || "Failed to create user");
    }

    const clinicSlug = clinicName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

    // @ts-expect-error RPC types not refreshed yet
    const { data: clinicId, error: rpcError } = await supabase.rpc('register_clinic', {
      clinic_name: clinicName,
      clinic_slug: clinicSlug,
      first_name: firstName,
      last_name: lastName
    });

    if (rpcError) {
      return Result.fail(rpcError.message);
    }

    // Refresh session to get new custom claims
    await supabase.auth.refreshSession();

    return Result.ok({ clinicId: clinicId as string });
  }

  static async signIn(email: string, password: string): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Result.fail(error.message);
    }

    return Result.ok(undefined);
  }

  static async signOut(): Promise<Result<void>> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return Result.fail(error.message);
    }
    return Result.ok(undefined);
  }
}
