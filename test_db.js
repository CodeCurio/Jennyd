import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const envs = Object.fromEntries(env.split('\n').filter(Boolean).map(l => l.split('=')))

const supabase = createClient(envs.NEXT_PUBLIC_SUPABASE_URL, envs.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function run() {
  const { data } = await supabase.from('products').select('id, title, price, sale_price')
  console.log(data)
}
run()
