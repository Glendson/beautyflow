/**
 * Email Validation Bypass for Development/Testing
 * 
 * This script handles the Supabase email validation issue where:
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY has strict email validation
 * - This is by design for security, but blocks testing
 * 
 * SOLUTION 1: Use Admin Client (requires SERVICE_ROLE_KEY)
 * SOLUTION 2: Disable "Email Confirmations" in Supabase Dashboard:
 *   1. Go to: https://app.supabase.com/project/epkkwyrebbsyeougwswd/settings/auth
 *   2. Under "Auth" settings, find "Email Confirmations"
 *   3. Toggle OFF: "Require email confirmation to sign up"
 *   4. Save changes
 * 
 * SOLUTION 3: Use test domains configured in whitelist
 * 
 * STATUS: Implemented admin client as fallback
 */

import { createClient as createDefaultClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { logger } from './logger';

export async function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    logger.warn('SUPABASE_SERVICE_ROLE_KEY not found - admin client unavailable');
    return null;
  }

  return createDefaultClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function signUpWithBypass(
  email: string,
  password: string,
  options?: {
    emailConfirmed?: boolean;
    customMetadata?: Record<string, any>;
  }
) {
  try {
    // Try admin client first (bypasses email validation)
    const adminClient = await createAdminClient();
    
    if (adminClient) {
      logger.info('Using Admin Client to bypass email validation');
      
      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: options?.emailConfirmed ?? true, // Auto-confirm
        user_metadata: options?.customMetadata,
      });

      if (error) {
        logger.error('Admin signup failed', error);
        return { data: null, error };
      }

      logger.success('User created with admin client');
      return { data, error: null };
    }
  } catch (err) {
    logger.error('Admin client error', err as Error);
  }

  // Fallback: return null to let caller know admin signup wasn't possible
  return { data: null, error: { message: 'Admin signup not available' } };
}
