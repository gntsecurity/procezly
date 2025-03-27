// src/utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables are missing.");
  throw new Error("Missing Supabase environment variables: check .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
