import { z } from 'zod';

const isServer = typeof window === 'undefined';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE: z.string().optional(),
  // These are only required on the server
  CLERK_SECRET_KEY: isServer ? z.string().min(1) : z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: isServer ? z.string().min(1) : z.string().optional(),
  JWT_SECRET: isServer ? z.string().min(1) : z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE: process.env.NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined),
  NODE_ENV: process.env.NODE_ENV,
};

const parsedEnv = envSchema.safeParse(processEnv);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Invalid environment variables');
  }
}

export const env = parsedEnv.success 
  ? parsedEnv.data 
  : (processEnv as unknown as z.infer<typeof envSchema>);
