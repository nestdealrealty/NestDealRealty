import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnrwffuzffoahmndyrnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucndmZnV6ZmZvYWhtbmR5cm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Mjc2NzcsImV4cCI6MjA4NjEwMzY3N30.Z-245itCHVc0_h_HxhLYnzHmEvLeGp3jdavMASqhQzo';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
