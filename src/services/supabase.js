import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jxmnkjceomoudahviwym.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bW5ramNlb21vdWRhaHZpd3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxODg2MjksImV4cCI6MjEwODc2NDYyOX0.v9zB1KfLs9R6ZzK9p_5jWF0uzFpjPhsTQ08Vc-cuZL4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
