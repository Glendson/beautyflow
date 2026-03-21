import { createClient } from "@/infrastructure/supabase/server";
import { Result } from "@/lib/result";

export class AuthUseCase {
  static async signUp(
    email: string,
    password: string,
    clinicName: string,
    firstName: string,
    lastName: string
  ): Promise<Result<{ clinicId: string }>> {
    const supabase = await createClient();

    // 1. Cria o usuário
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return Result.fail(authError?.message || "Failed to create user");
    }

    // 2. Faz signIn para estabelecer a sessão nos cookies do servidor
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return Result.fail(signInError.message);
    }

    // 3. Gera o slug da clínica
    const clinicSlug =
      clinicName.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
      "-" +
      Math.random().toString(36).substring(2, 6);

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
      return Result.fail(rpcError.message);
    }

    return Result.ok({ clinicId: clinicId as string });
  }

  static async signIn(
    email: string,
    password: string
  ): Promise<Result<void>> {
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