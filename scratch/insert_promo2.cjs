const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oirxfaoorbzpfijlrchq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcnhmYW9vcmJ6cGZpamxyY2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNTE0MTcsImV4cCI6MjEwNDcyNzQxN30.Lk4KbrPcw9wB3hAiIPK_q1pwu6n1fe6SByDKGJffcfE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addPromoCode() {
  const { data, error } = await supabase
    .from('promo_codes')
    .upsert([
      { code: 'NUMGURU100', usage_count: 0, max_uses: 100 }
    ], { onConflict: 'code' });
    
  if (error) console.error('Error inserting promo code:', error);
  else console.log('Successfully inserted promo code:', data);
}

addPromoCode();
