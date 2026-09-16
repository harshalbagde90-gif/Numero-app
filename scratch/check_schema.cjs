const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oirxfaoorbzpfijlrchq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcnhmYW9vcmJ6cGZpamxyY2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNTE0MTcsImV4cCI6MjEwNDcyNzQxN30.Lk4KbrPcw9wB3hAiIPK_q1pwu6n1fe6SByDKGJffcfE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .limit(1);
    
  if (error) console.error('Error fetching promo codes:', error);
  else console.log('Row:', data);
}

checkSchema();
