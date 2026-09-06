import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase URL and Anon Key from your Supabase Dashboard
const supabaseUrl = "https://vmmkcxtkcrhunpebvozz.supabase.co"
const supabaseKey = "sb_publishable_yHVBNntAWayxT_cci7gnRg_v-4aLTPy"

export const supabase = createClient(supabaseUrl, supabaseKey)