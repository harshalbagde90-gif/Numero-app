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
-- Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can submit a review)
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.reviews;
CREATE POLICY "Allow anonymous inserts" ON public.reviews
    FOR INSERT 
    WITH CHECK (true);

-- Allow anonymous reads (anyone can view reviews)
DROP POLICY IF EXISTS "Allow anonymous reads" ON public.reviews;
CREATE POLICY "Allow anonymous reads" ON public.reviews
    FOR SELECT
    USING (true);
      `;
      
      await client.query(sql);
      console.log('Reviews table created perfectly!');
      await client.end();
      return;
    } catch (e) {
      console.log(`Failed: ${e.message}`);
    }
  }
}

run();
