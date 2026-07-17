
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqyoyrswqjqvsozttfxr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxeW95cnN3cWpxdnNvenR0ZnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwODY1NTcsImV4cCI6MjA5ODY2MjU1N30.kN-gkXz0Jteu00YmJ37W9T22K_FkwSqnhNvosQCvtic';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
