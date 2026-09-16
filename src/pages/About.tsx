import React, { useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Orbit, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    document.title = "About Us | NumGuru";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Learn about NumGuru and our mission to decode the universe's blueprint through accurate Pythagorean numerology.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#020005] min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-4">
            <Orbit className="h-4 w-4 animate-spin-slow" />
            About NumGuru
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-amber-200 to-amber-600">
            Decoding the Universe's Blueprint
          </h1>
          
          <div className="h-px w-full bg-gradient-to-r from-amber-500/50 via-indigo-500/50 to-transparent my-8" />
          
          <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-light">
            <p>
              Welcome to <strong className="text-amber-500 font-bold">NumGuru</strong>, your ultimate portal for spiritual awakening and self-discovery through the ancient science of Pythagorean Numerology.
            </p>
            <p>
              We believe that the universe communicates through numbers. Every birth date and name carries a unique vibrational frequency that dictates life paths, career choices, relationships, and ultimate destiny. Our mission is to decode these frequencies for you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <Compass className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Our Mission</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  To provide accurate, deeply insightful numerology readings that empower individuals to make aligned life choices and manifest their highest potential.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <Sparkles className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">The Science</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Rooted in the ancient mathematical principles of Pythagoras, we use advanced algorithms to calculate your core numbers with absolute precision.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-white mt-12 mb-4 tracking-tight">Why Choose NumGuru?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-amber-500 font-black mr-4 text-xl">•</span>
                <span><strong>Instant Clarity:</strong> Get comprehensive life path analysis in seconds.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 font-black mr-4 text-xl">•</span>
                <span><strong>Premium Remedies:</strong> Actionable spiritual remedies, power colors, and habit trackers to align your vibration.</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 font-black mr-4 text-xl">•</span>
                <span><strong>Secure & Private:</strong> Your personal data and destiny matrix are encrypted and completely secure.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
