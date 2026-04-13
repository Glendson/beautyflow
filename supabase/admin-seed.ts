#!/usr/bin/env node

/**
 * 🔧 ADMIN SEED SCRIPT
 * 
 * Creates a test user directly in Supabase using SERVICE_ROLE_KEY
 * Bypasses email confirmation requirement
 * 
 * Usage:
 * 1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local
 * 2. Run: npx tsx supabase/admin-seed.ts
 */

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.error('');
  console.error('📋 HOW TO GET IT:');
  console.error('1. Open: https://app.supabase.com/project/epkkwyrebbsyeougwswd/settings/api');
  console.error('2. Copy the "Service Role" secret (NOT the public key)');
  console.error('3. Add to .env.local:');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...');
  console.error('4. Run this script again');
  process.exit(1);
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const adminClient = createClient(supabaseUrl, serviceRoleKey);

async function seedTestUser() {
  try {
    console.log('🔑 Using SERVICE_ROLE_KEY to bypass email validation...\n');

    const testEmail = 'qa-test-user@example.com';
    const testPassword = 'QATest@123!';
    const testClinicName = 'QA Test Clinic';

    // Step 1: Create auth user with admin client
    console.log('📝 Step 1: Creating auth user...');
    const {
      data: { user },
      error: authError,
    } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // ✅ Skip email confirmation!
      user_metadata: {
        first_name: 'QA',
        last_name: 'Tester',
      },
    });

    if (authError) {
      console.error('❌ Failed to create auth user:', authError);
      return;
    }

    const userId = user?.id;
    console.log(`✅ Auth user created: ${testEmail}`);
    console.log(`   User ID: ${userId}\n`);

    // Step 2: Create clinic
    console.log('🏥 Step 2: Creating clinic...');
    const { data: clinic, error: clinicError } = await adminClient
      .from('clinics')
      .insert({
        name: testClinicName,
        slug: `qa-test-${userId?.substring(0, 8)}`,
      })
      .select()
      .single();

    if (clinicError) {
      console.error('❌ Failed to create clinic:', clinicError);
      return;
    }

    console.log(`✅ Clinic created: ${clinic.name}`);
    console.log(`   Clinic ID: ${clinic.id}\n`);

    // Step 3: Create user profile
    console.log('👤 Step 3: Creating user profile...');
    const { data: profile, error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        id: userId,
        clinic_id: clinic.id,
        first_name: 'QA',
        last_name: 'Tester',
        role: 'admin',
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Failed to create user profile:', profileError);
      return;
    }

    console.log(`✅ User profile created: ${profile.first_name} ${profile.last_name}\n`);

    // Success summary
    console.log('═'.repeat(50));
    console.log('🎉 TEST USER CREATED SUCCESSFULLY!\n');
    console.log('📋 Credentials:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}\n`);
    console.log('✅ Email confirmation: ALREADY VERIFIED');
    console.log('✅ Clinic: READY TO USE\n');
    console.log('🧪 Next steps:');
    console.log('   1. Run the test suite: npm run test:e2e:debug');
    console.log('   2. Or manually test: npm run dev');
    console.log('═'.repeat(50));
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

seedTestUser();
