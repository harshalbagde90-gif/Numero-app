const { Client } = require('pg');

async function run() {
  const passwordsToTry = [
    'numguru',
    '[numguru]',
    'postgresql://postgres:[numguru]@db.oirxfaoorbzpfijlrchq.supabase.co:5432/postgres', 
    'postgresql%3A%2F%2Fpostgres%3A%5Bnumguru%5D%40db.oirxfaoorbzpfijlrchq.supabase.co%3A5432%2Fpostgres'
  ];

  for (const pwd of passwordsToTry) {
    const connStr = `postgresql://postgres:${encodeURIComponent(pwd)}@db.oirxfaoorbzpfijlrchq.supabase.co:5432/postgres`;
    console.log(`Trying connection with password: ${pwd}`);
    const client = new Client({ connectionString: connStr });
    try {
      await client.connect();
      console.log('Connected successfully!');
      
      const sql = `
        create table if not exists promo_codes (
          id uuid default gen_random_uuid() primary key,
          code text not null unique,
          usage_count int default 0,
          max_uses int default 50,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        insert into promo_codes (code, max_uses) 
        values ('NUMGURU50', 50)
        on conflict (code) do nothing;

        alter table promo_codes enable row level security;

        drop policy if exists "Allow public read access" on promo_codes;
        create policy "Allow public read access"
          on promo_codes for select
          to public
          using (true);

        drop policy if exists "Allow public update access" on promo_codes;
        create policy "Allow public update access"
          on promo_codes for update
          to public
          using (true);
      `;
      
      await client.query(sql);
      console.log('Database initialized perfectly!');
      await client.end();
      return;
    } catch (e) {
      console.log(`Failed: ${e.message}`);
    }
  }
}

run();
