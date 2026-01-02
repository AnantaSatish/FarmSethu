
import { createClient } from '@supabase/supabase-js';

// Environment variables are expected to be present in the execution context.
const supabaseUrl = (process.env as any).SUPABASE_URL || '';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || '';

// Only initialize if URL is provided to avoid "supabaseUrl is required" error.
// If missing, dbService will fallback to mock data.
export const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
