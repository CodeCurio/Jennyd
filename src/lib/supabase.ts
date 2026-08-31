import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://brfwzlhjryvyifpgyryp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZnd6bGhqcnl2eWlmcGd5cnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjU5ODgsImV4cCI6MjA5NzkwMTk4OH0.AWq3BnwvmC0wg1CZKI20ERKuN1-nZ95ouOdYNINq5Gs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceRoleKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZnd6bGhqcnl2eWlmcGd5cnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjMyNTk4OCwiZXhwIjoyMDk3OTAxOTg4fQ.HRObB8j0wN0ErBEtnPWC9pofpzdmrdc_VxobsPp_03g';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
