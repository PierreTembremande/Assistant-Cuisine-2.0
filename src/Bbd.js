import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dlxbqveeumnczybgfpty.supabase.co';
const supabaseKey = 'your-api-keyeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRseGJxdmVldW1uY3p5YmdmcHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkxMDk1OTEsImV4cCI6MjAxNDY4NTU5MX0.3Xxz3dAYYQ6AL-J6zqUhqWyFSzQMnc_z5b7MmMg2Ks0';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };