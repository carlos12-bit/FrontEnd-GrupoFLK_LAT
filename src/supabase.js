import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gfyptcfhfzpsrhfphftb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeXB0Y2ZoZnpwc3JoZnBoZnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExNzI4ODMsImV4cCI6MjAzNjc0ODg4M30.vHpuZ1fu2O1Uc29MC3Uppbrn5b1B8txDJ8_qOMYg07Y";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);