import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// null until .env is filled in. Nothing calls it yet — see src/lib/api.js.
export const supabase = url && key ? createClient(url, key) : null
