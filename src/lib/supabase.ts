import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We use a warning instead of a crash for build-time safety if envs aren't present yet
  console.warn('Supabase environment variables are missing. Please check .env.local');
}

// 1. Standard Client: Used in Frontend and authenticated user contexts.
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// 2. Admin Client: Used ONLY in the /api (Server Actions/Route Handlers).
// This client bypasses RLS and should be used with extreme caution.
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl || '', supabaseServiceKey)
  : null;
