import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// null until .env is filled in; src/lib/api.js falls back to localStorage then.
export const supabase = url && key ? createClient(url, key) : null
