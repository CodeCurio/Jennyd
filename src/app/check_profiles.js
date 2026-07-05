const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://brfwzlhjryvyifpgyryp.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZnd6bGhqcnl2eWlmcGd5cnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjMyNTk4OCwiZXhwIjoyMDk3OTAxOTg4fQ.HRObB8j0wN0ErBEtnPWC9pofpzdmrdc_VxobsPp_03g';
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function check() {
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('AUTH ERROR:', authError);
  } else {
    console.log('AUTH USERS:');
    authUsers.users.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}, Provider: ${u.app_metadata.provider}`));
  }

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*');
  
  if (profileError) {
    console.error('PROFILES ERROR:', profileError);
  } else {
    console.log('PROFILES:');
    profiles.forEach(p => console.log(`- ID: ${p.id}, Email: ${p.email}, Name: ${p.full_name}`));
  }
}

check();
