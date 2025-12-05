import { createClient } from '@supabase/supabase-js'

// REPLACE THESE WITH YOUR ACTUAL SUPABASE KEYS
const supabaseUrl = 'https://kisvhybujkjoszbsjhcr.supabase.co'
const supabaseKey = 'sb_publishable_Q6QjvN96na9li7F3VknzEw_gOAt0e2Y'

export const supabase = createClient(supabaseUrl, supabaseKey)