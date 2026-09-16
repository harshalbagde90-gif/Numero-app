import React, { useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us | NumGuru";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Get in touch with NumGuru support for queries regarding premium numerology reports, billing, or general questions.");
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-[#020005] min-h-screen text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Navbar />
      <div className="flex-grow max-w-4xl mx-auto px-6 py-20 md:py-32 w-full relative z-10 flex flex-col items-center justify-center">
        <div className="w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-amber-500 mb-2 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <MessageSquare className="h-4 w-4" />
            Support & Inquiry
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-tight text-white drop-shadow-xl">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Touch</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            Have questions about your numerology report or need assistance? We're here to help guide you on your cosmic journey.
          </p>
          
          <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-12" />
          
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white/[0.02] border border-white/10 p-10 sm:p-14 rounded-[3rem] flex flex-col items-center text-center shadow-2xl backdrop-blur-sm relative group hover:border-amber-500/30 transition-all duration-700">
              
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />
              
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(245,158,11,0.4)] relative z-10 group-hover:scale-110 transition-transform duration-500">
                <Mail className="w-10 h-10 text-[#020005]" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4 relative z-10">Email Support</h3>
              <p className="text-slate-400 mb-10 relative z-10 max-w-md">
                For queries regarding premium reports, billing, or general numerology questions, drop us an email. We typically reply within 24 hours.
              </p>
              
              <div className="bg-black/60 border border-amber-500/30 p-6 rounded-2xl mb-10 w-full flex items-center justify-center shadow-inner relative z-10 overflow-hidden group/email">
                <div className="absolute inset-0 bg-amber-500/10 blur-xl opacity-0 group-hover/email:opacity-100 transition-opacity duration-500" />
                <span className="text-amber-400 font-bold text-xl md:text-3xl tracking-wider select-all relative z-10">
                  support@numguru.online
                </span>
              </div>
              
              <a href="mailto:support@numguru.online" className="w-full relative z-10 block">
                <Button className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all uppercase tracking-widest">
                  Send an Email
                </Button>
              </a>
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
