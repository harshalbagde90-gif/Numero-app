import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Deleting demo reviews...');
  const { data, error } = await supabase
    .from('reviews')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
    
  if (error) {
    console.error('Error deleting reviews:', error);
  } else {
    console.log('Reviews deleted successfully');
  }
}

run();
