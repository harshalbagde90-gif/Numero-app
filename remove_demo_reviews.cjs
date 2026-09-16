const { Client } = require('pg');

async function run() {
  const pwd = '[numguru]';
  const connStr = `postgresql://postgres:${encodeURIComponent(pwd)}@db.oirxfaoorbzpfijlrchq.supabase.co:5432/postgres`;
  const client = new Client({ connectionString: connStr });
  try {
    await client.connect();
    
    // Delete all reviews (this will remove the 3 demo reviews we just added)
    await client.query('DELETE FROM public.reviews');
    console.log('Removed demo reviews successfully!');
    
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  } finally {
    await client.end();
  }
}

run();
