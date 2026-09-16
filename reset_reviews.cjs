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
    const client = new Client({ connectionString: connStr, connectionTimeoutMillis: 5000 });
    try {
      await client.connect();
      console.log('Connected successfully!');
      
      const sql = `
        DELETE FROM public.reviews;
        INSERT INTO public.reviews (name, rating, review_text, is_approved)
        VALUES 
        ('Rahul M.', 5, 'I was a bit skeptical at first, but the numerology report I received was incredibly accurate. It highlighted career blocks I didn''t even realize I had. After following the name correction suggestions, things have genuinely started shifting in my favor. Highly recommended!', true),
        ('Priya S.', 5, 'The detailed PDF report was completely eye-opening. It felt like someone had read my entire life story. The remedies are simple to follow and I''m already feeling much more aligned and at peace with my decisions.', true),
        ('Aman V.', 4, 'Very insightful reading. The soul urge number explanation perfectly described my internal conflicts. The only reason for 4 stars is that I wish the report had even more details about future timing, but overall a great experience.', true);
      `;
      await client.query(sql);
      console.log('Reviews reset perfectly!');
      await client.end();
      return;
    } catch (e) {
      console.log(`Failed: ${e.message}`);
    }
  }
}

run();
