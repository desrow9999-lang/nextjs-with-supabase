import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mwurdtuqkgnqplaqscrg.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXJkdHVxa2ducXBsYXFzY3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NTYyMTIsImV4cCI6MjEwNDEzMjIxMn0.JpcU343VYpelgIXB4V589KOc8M1ENGcWu7tVoqsUlMA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
