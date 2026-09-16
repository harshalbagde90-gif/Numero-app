import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Star, MessageCircle, Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const isPaused = useRef(false);
  
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      if (!isPaused.current) {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleDragStart = (clientX: number) => {
    touchStartX.current = clientX;
    isPaused.current = true;
  };

  const handleDragMove = (clientX: number) => {
    if (touchStartX.current !== null) {
      touchEndX.current = clientX;
    }
  };

  const handleDragEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      
      if (distance > 50) {
         setCurrentIndex((prev) => (prev + 1) % reviews.length);
      } else if (distance < -50) {
         setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    handleDragEnd();
    isPaused.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const handleMouseUp = () => {
    handleDragEnd();
    // Keep paused if mouse is still hovering
  };
  
  const handleMouseEnter = () => { isPaused.current = true; };
  const handleMouseLeave = () => {
    handleDragEnd();
    isPaused.current = false;
  };

  if (loading || reviews.length === 0) {
    return null; // Don't show the section if loading or no approved reviews
  }

  return (
    <section className="relative py-32 px-4 md:px-8 border-t border-white/5 bg-[#050005]">
      {/* Mystical Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest border border-secondary/20 mx-auto">
            <MessageCircle className="w-3.5 h-3.5" />
            Real Transformations
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white">
            What Our Seekers <span className="text-secondary italic">Experience</span>
          </h2>
        </div>

        <div 
          className="relative w-full max-w-5xl mx-auto overflow-hidden px-4 md:px-8 touch-pan-y"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div 
            className="flex transition-transform duration-1000 ease-in-out cursor-grab active:cursor-grabbing"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="w-full shrink-0 px-2 md:px-4">
                <div 
                  className="relative p-10 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex flex-col gap-8 group hover:border-secondary/30 hover:bg-secondary/5 transition-all duration-700 min-h-[300px] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-secondary/10 transition-colors duration-700" />
                  
                  <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                    <Quote className="w-16 h-16 text-secondary" />
                  </div>

                  <div className="flex items-center gap-1.5 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-6 h-6 ${i < review.rating ? 'fill-secondary text-secondary drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-white/10'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-white/80 font-medium leading-relaxed italic text-xl md:text-2xl relative z-10">
                    "{review.review_text}"
                  </p>

                  <div className="mt-auto pt-8 border-t border-white/10 flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary/40 to-secondary/10 flex items-center justify-center text-secondary font-black text-2xl border border-secondary/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">{review.name}</span>
                      <span className="text-[11px] uppercase tracking-widest text-secondary font-black">
                        Verified Seeker
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-3 mt-12">
               {reviews.map((_, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setCurrentIndex(idx)}
                   className={`h-2 rounded-full transition-all duration-500 ease-out ${
                     currentIndex === idx 
                       ? 'w-10 bg-secondary shadow-[0_0_10px_rgba(234,179,8,0.8)]' 
                       : 'w-2 bg-white/20 hover:bg-white/40'
                   }`}
                   aria-label={`Go to slide ${idx + 1}`}
                 />
               ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
