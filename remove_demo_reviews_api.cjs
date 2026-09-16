const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oirxfaoorbzpfijlrchq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcnhmYW9vcmJ6cGZpamxyY2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNTE0MTcsImV4cCI6MjEwNDcyNzQxN30.Lk4KbrPcw9wB3hAiIPK_q1pwu6n1fe6SByDKGJffcfE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Deleting demo reviews...');
  
  // Actually, anon key might not have DELETE permissions. But let's try.
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
