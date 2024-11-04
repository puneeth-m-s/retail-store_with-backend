import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Replace with your Supabase project URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // Replace with your Supabase anon key
export const supabase = createClient(supabaseUrl, supabaseKey);