import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Orbit, CheckCircle2, BookOpen, Star, Activity, Binary, Brain } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const Science = () => {
  useEffect(() => {
    document.title = "The Science of Numerology | NumGuru";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Discover the ancient mathematical science behind Pythagorean Numerology. Learn how vibrational frequencies of numbers map to your cosmic destiny and life path.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d000d] text-white font-sans selection:bg-secondary/30 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-secondary/5 rounded-full blur-[150px] opacity-30" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
      </div>

      <Navbar />

      <main className="relative pt-24 md:pt-40 pb-32 px-4 md:px-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="relative mb-16 md:mb-24 text-center flex flex-col items-center reveal-up stagger-1">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-6 md:w-8 bg-secondary/40" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-secondary">Mathematical Mysticism</span>
              <div className="h-px w-6 md:w-8 bg-secondary/40" />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-[1.1] md:leading-[0.9] mb-6 px-2">
              The Science Behind <br />
              <span className="text-secondary italic">Pythagorean Numerology</span>
            </h1>
            <p className="max-w-2xl text-slate-400 text-base md:text-lg font-medium leading-relaxed opacity-80 px-4 md:px-0 mt-4">
              Numerology is not magic. It is the ancient study of vibrational mathematics, structural frequencies, and cosmic geometry introduced by the Greek philosopher Pythagoras.
            </p>
          </div>

          <div className="mb-16 md:mb-24 relative group rounded-3xl overflow-hidden reveal-up stagger-2">
            <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10" />
            <img 
              src="/images/science_hero.png" 
              alt="Ancient Pythagorean Numerology tablet with glowing mathematical symbols"
              className="w-full h-[300px] md:h-[500px] object-cover border border-white/10 shadow-[0_0_50px_rgba(234,179,8,0.15)] grayscale-[0.3] contrast-125 group-hover:scale-105 transition-transform duration-[2000ms]"
            />
          </div>

          <article className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-headings:font-black prose-p:text-slate-400 prose-p:leading-relaxed prose-a:text-secondary">
            <section className="mb-16 reveal-up stagger-3">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Brain className="h-8 w-8 text-secondary" />
                </div>
                <h2 className="text-3xl m-0 text-white">The Origin: Pythagoras of Samos</h2>
              </div>
              <p>
                In the 6th century BC, the Greek mathematician and philosopher <strong>Pythagoras</strong> made a profound discovery that would bridge the gap between abstract mathematics and human psychology. Pythagoras, the father of modern geometry (famous for the Pythagorean theorem), believed that the entire universe could be expressed through numbers.
              </p>
              <p>
                He theorized that everything in existence vibrates at a specific frequency, a concept later proven by modern quantum physics. In Pythagorean Numerology, the numbers 1 through 9 are not merely symbols for counting; they are structural energetic blueprints that dictate the vibration of names, birth dates, and ultimately, human destiny.
              </p>
            </section>

            <section className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Activity className="h-8 w-8 text-secondary" />
                </div>
                <h2 className="text-3xl m-0 text-white">How Vibrational Frequencies Work</h2>
              </div>
              <p>
                According to the Pythagorean system, the alphabet is mathematically mapped to numbers from 1 to 9. When you speak your name, you are emitting a specific acoustic and vibrational frequency. 
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h3 className="text-xl font-black text-white mb-2">The Life Path Number</h3>
                  <p className="text-sm text-slate-400">Calculated from your exact Date of Birth, this is your unchangeable cosmic DNA. It outlines your core struggles, ultimate purpose, and natural talents.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h3 className="text-xl font-black text-white mb-2">The Expression Number</h3>
                  <p className="text-sm text-slate-400">Derived from the total numeric value of your full birth name, this reveals your physical capabilities and how you express your Life Path in the real world.</p>
                </div>
              </div>
              <p>
                By calculating the root sum of these numbers, we can determine an individual's dominant vibrational frequency. If your frequency resonates with the number 8, your life is heavily influenced by themes of material power, structure, and karmic balance. If it resonates with a 5, your trajectory is governed by adaptability, chaos, and communication.
              </p>
            </section>

            <section className="mb-16 p-8 rounded-3xl border border-secondary/20 bg-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[50px]" />
              <h2 className="text-2xl text-white mt-0 relative z-10">Why Pythagorean Over Chaldean?</h2>
              <p className="relative z-10">
                While Chaldean numerology focuses on the mystical and astrological ties of numbers, the Pythagorean system is strictly analytical and sequential. The Pythagorean alphabet mapping moves in a straight line (1-9) across the English alphabet, offering a psychological and evolutionary map of the human soul. It provides a more accurate psychological framework for modern individuals seeking self-awareness rather than predictive divination.
              </p>
            </section>

            <section>
              <h2 className="text-3xl text-white border-b border-white/10 pb-4 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6 not-prose">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" /> Is Numerology scientifically proven?
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Numerology is considered a metaphysical science. While it is not an empirical hard science like physics, it is a highly structured symbolic language and psychological profiling system. Much like Carl Jung's archetypes, numerology provides a profound framework for understanding human behavior and subconscious motivations.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" /> Why do Master Numbers (11, 22, 33) matter?
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    In Pythagorean calculation, numbers are typically reduced to a single digit (1-9). However, 11, 22, and 33 are considered Master Numbers. They are not reduced because they carry a highly intensified frequency of their root numbers (2, 4, 6), representing immense potential combined with extreme psychological tension.
                  </p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Science;
