import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Star, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

export const ReviewForm = ({ source = 'in_report' }: { source?: 'in_report' | 'hidden_link' }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!name.trim() || !reviewText.trim()) {
      setError('Please provide your name and review.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('reviews')
        .insert([
          { 
            name: name.trim(), 
            rating, 
            review_text: reviewText.trim(),
            is_approved: true
          }
        ]);

      if (dbError) throw dbError;

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-green-500/10 border border-green-500/30 text-center flex flex-col items-center gap-4">
        <CheckCircle2 className="w-12 h-12 text-green-400" />
        <h3 className="text-2xl font-serif text-green-400 font-bold">Thank You!</h3>
        <p className="text-white/70">Your review has been submitted successfully and will be visible once approved.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 md:p-10 rounded-[2.5rem] bg-[#0d000d]/60 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1/2 bg-secondary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-secondary/10 transition-colors duration-700" />
      
      <div className="relative z-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest mb-4 border border-secondary/20">
          <Sparkles className="w-3.5 h-3.5" />
          Share Your Experience
        </div>
        <h3 className="text-3xl font-serif font-bold text-white mb-2">Did this resonate?</h3>
        <p className="text-white/50 text-sm">Help others discover their numerological blueprint by sharing your honest feedback.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-bold text-white/70 uppercase tracking-widest">Rate your experience</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-secondary text-secondary drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                      : 'text-white/20'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest pl-2">Your First Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah"
            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 focus:bg-white/[0.05] transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest pl-2">Your Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="How accurate was your reading? Did it help you?"
            rows={4}
            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 focus:bg-white/[0.05] transition-all resize-none"
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-[#1a0f02] font-black h-14 rounded-2xl text-base tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all active:scale-[0.98]"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "SUBMIT REVIEW"}
        </Button>
      </form>
      </div>
    </div>
  );
};
