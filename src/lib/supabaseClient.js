import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Bantu debugging saat env var belum diisi (mis. lupa set di Vercel)
  console.error(
    'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diset. ' +
    'Salin .env.example ke .env untuk lokal, atau set Environment Variables di Vercel.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
