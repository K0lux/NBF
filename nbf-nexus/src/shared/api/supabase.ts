import { createClient } from '@supabase/supabase-js';
import { env } from '@/shared/config/env';

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Supabase configuration is missing in environment variables.');
}

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || 'http://placeholder-url.com',
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);
