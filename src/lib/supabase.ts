import { createClient } from "@supabase/supabase-js";

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We don't throw error here to prevent app crash during build or development without env
  console.warn("Missing Supabase environment variables. Admin features will not work.");
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);
