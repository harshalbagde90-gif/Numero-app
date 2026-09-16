const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:postgresql%3A%2F%2Fpostgres%3A%5Bnumguru%5D%40db.oirxfaoorbzpfijlrchq.supabase.co%3A5432%2Fpostgres@db.oirxfaoorbzpfijlrchq.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    
    // Create an RLS policy for the anon key to allow reading promo codes
    await client.query(`
      DROP POLICY IF EXISTS "Enable read access for all users" ON promo_codes;
      CREATE POLICY "Enable read access for all users" ON promo_codes FOR SELECT USING (true);
    `);
    
    // Update the promo code NUMGURU50 and insert NUMGURU100
    await client.query(`
      INSERT INTO promo_codes (code, max_uses, usage_count) 
      VALUES ('NUMGURU100', 100, 0)
      ON CONFLICT (code) DO UPDATE SET max_uses = 100;
    `);
    
    // Also make sure NUMGURU50 is set to 50
    await client.query(`
      INSERT INTO promo_codes (code, max_uses, usage_count) 
      VALUES ('NUMGURU50', 50, 0)
      ON CONFLICT (code) DO UPDATE SET max_uses = 50;
    `);

    console.log("Promo codes added successfully and RLS policy for reading enabled.");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

run();
