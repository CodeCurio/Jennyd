import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://brfwzlhjryvyifpgyryp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZnd6bGhqcnl2eWlmcGd5cnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjU5ODgsImV4cCI6MjA5NzkwMTk4OH0.AWq3BnwvmC0wg1CZKI20ERKuN1-nZ95ouOdYNINq5Gs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
