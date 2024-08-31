import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qyfrfgcefvwpkqtzjjxi.supabase.co/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5ZnJmZ2NlZnZ3cGtxdHpqanhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5NzY1MDEsImV4cCI6MjA0MDU1MjUwMX0.GNOj175EL5XrpSHlwD2l_uz0Z6_SYOKiyFwOVJ5NtVo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);