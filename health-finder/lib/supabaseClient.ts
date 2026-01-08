// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Database types
export interface Database {
  public: {
    Tables: {
      facilities: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          phone: string | null;
          category: string;
          rating: number | null;
          latitude: number | null;
          longitude: number | null;
          is_open: boolean | null;
          blood_groups: string[] | null;
          insurance_accepted: string[] | null;
          services: string[] | null;
          emergency_available: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          city: string;
          phone?: string | null;
          category: string;
          rating?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          is_open?: boolean | null;
          blood_groups?: string[] | null;
          insurance_accepted?: string[] | null;
          services?: string[] | null;
          emergency_available?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          city?: string;
          phone?: string | null;
          category?: string;
          rating?: number | null;
          latitude?: number | null;
          longitude?: number | null;
          is_open?: boolean | null;
          blood_groups?: string[] | null;
          insurance_accepted?: string[] | null;
          services?: string[] | null;
          emergency_available?: boolean | null;
          created_at?: string;
        };
      };
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
