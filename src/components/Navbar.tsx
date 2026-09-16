import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Orbit, Menu, X, BookOpen, Crown, Star, Phone, Info } from 'lucide-react';
import LanguageTranslator from '@/components/LanguageTranslator';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleScrollToTop = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full sticky top-0 z-50 glass-panel bg-[#020005]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" onClick={handleScrollToTop}>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all duration-500">
              <Orbit className="h-6 w-6 text-amber-500 group-hover:rotate-180 transition-transform duration-1000 ease-in-out" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-white group-hover:text-amber-500 transition-colors">NumGuru</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link className="text-sm font-medium text-slate-300 hover:text-amber-500 px-3 py-1.5 rounded-full hover:bg-amber-500/10 transition-colors" to="/science">The Science</Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-amber-500 px-3 py-1.5 rounded-full hover:bg-amber-500/10 transition-colors" to="/blog">Blog</Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-amber-500 px-3 py-1.5 rounded-full hover:bg-amber-500/10 transition-colors" to="/review">Reviews</Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-amber-500 px-3 py-1.5 rounded-full hover:bg-amber-500/10 transition-colors" to="/about">About Us</Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-amber-500 px-3 py-1.5 rounded-full hover:bg-amber-500/10 transition-colors" to="/contact">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              <LanguageTranslator id={`google_translate_element_nav_${Math.random().toString(36).substring(7)}`} />
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 transition-all"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#05000a] border-b border-white/10 shadow-2xl">
          <div className="px-4 py-6 space-y-4 flex flex-col">
            <Link to="/science" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-amber-500 p-3 rounded-xl hover:bg-amber-500/10">
              <Orbit className="h-5 w-5" /> The Science
            </Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-amber-500 p-3 rounded-xl hover:bg-amber-500/10">
              <BookOpen className="h-5 w-5" /> Wisdom Blog
            </Link>
            <Link to="/review" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-amber-500 p-3 rounded-xl hover:bg-amber-500/10">
              <Star className="h-5 w-5" /> Reviews
            </Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-amber-500 p-3 rounded-xl hover:bg-amber-500/10">
              <Info className="h-5 w-5" /> About Us
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 hover:text-amber-500 p-3 rounded-xl hover:bg-amber-500/10">
              <Phone className="h-5 w-5" /> Contact
            </Link>
            <div className="pt-4 border-t border-white/10">
              <LanguageTranslator id="google_translate_mobile_nav" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
