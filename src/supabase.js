import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://aahqhtvvevqlgotljnha.supabase.co/rest/v1/'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaHFodHZ2ZXZxbGdvdGxqbmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTI1MDAsImV4cCI6MjA5Mzg4ODUwMH0.iQNBo33nIZUWqRnkuD37sv2K50Nv4uoq-NxtUqSVpRY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)