import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const envs = Object.fromEntries(env.split('\n').filter(Boolean).map(l => l.split('=')))

const supabase = createClient(envs.NEXT_PUBLIC_SUPABASE_URL, envs.SUPABASE_SERVICE_ROLE_KEY)

async function run() {
  const { data, error } = await supabase
    .from('products')
    .update({ price: 1599, sale_price: 1199 })
    .eq('price', 1999)
    .eq('sale_price', 1599)
  
  if (error) {
    console.error("Error updating:", error)
  } else {
    console.log("Success updated with service role!")
  }
}
run()
