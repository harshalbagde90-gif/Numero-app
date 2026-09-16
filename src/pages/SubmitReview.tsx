import React, { useEffect } from 'react';
import { ReviewForm } from '@/components/ReviewForm';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ReviewsSection } from '@/components/ReviewsSection';

const SubmitReview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050005] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col md:flex-row relative">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 min-h-[600px] mt-16 md:mt-0">
          <div className="w-full max-w-xl">
            <ReviewForm source="hidden_link" />
          </div>
        </div>

        {/* Right Side: Image & Effects */}
        <div className="hidden md:flex w-1/2 relative bg-[#050005] items-center justify-center">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#050005]/80 to-[#050005] z-10" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050005] via-transparent to-transparent z-10" />
             <img 
               src="/images/review_side_image.jpg" 
               alt="Cosmic numerology" 
               className="w-full h-full object-cover opacity-70 mix-blend-screen"
             />
          </div>
          
          <div className="relative z-20 text-center space-y-6 px-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center animate-pulse">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/40 to-secondary/10 shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-serif font-black text-white italic tracking-tight drop-shadow-2xl">
              Your Voice Shapes <br />
              <span className="text-secondary">The Cosmos</span>
            </h2>
            <p className="text-white/60 max-w-md mx-auto text-lg leading-relaxed font-medium">
              Every review helps another soul find their path. Thank you for sharing your authentic journey with us.
            </p>
          </div>
        </div>
      </main>

      <ReviewsSection />

      <Footer />
    </div>
  );
};

export default SubmitReview;
