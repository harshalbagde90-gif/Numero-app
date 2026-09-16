-- Create the reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can submit a review)
CREATE POLICY "Allow anonymous inserts" ON public.reviews
    FOR INSERT 
    WITH CHECK (true);

-- Allow anonymous reads (anyone can view reviews)
CREATE POLICY "Allow anonymous reads" ON public.reviews
    FOR SELECT
    USING (true);
