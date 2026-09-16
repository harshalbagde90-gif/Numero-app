import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, MessageCircleQuestion } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "What is Pythagorean Numerology?",
      answer: "Pythagorean Numerology is an ancient science developed by the Greek philosopher Pythagoras. It assigns numerical values to the letters of your name and uses your birth date to decode your core vibrational frequency, revealing your life purpose, strengths, and destiny."
    },
    {
      question: "How accurate is the Destiny Matrix?",
      answer: "The Destiny Matrix is highly accurate as it is based on pure mathematical principles. While it doesn't predict the future in a fortune-telling sense, it maps out your inherent cosmic blueprint and the energetic cycles you will experience throughout your life."
    },
    {
      question: "What do I get in the Premium Cosmic Report?",
      answer: "The premium report is a comprehensive 20+ page deep-dive into your soul's blueprint. It includes your core numbers (Life Path, Destiny, Soul Urge), personal year cycles, karmic lessons, power colors, and sacred remedies to align your energy for success and harmony."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We use enterprise-grade encryption to protect your birth details and name. We never sell your data to third parties, and your numerology readings are completely private and confidential."
    },
    {
      question: "How can numerology improve my life?",
      answer: "By understanding your numerical blueprint, you can make decisions that align with your natural strengths rather than fighting against them. It helps in choosing the right career path, understanding relationship dynamics, and knowing the best timing for major life changes."
    }
  ];

  return (
    <section className="relative py-24 z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 space-y-4 reveal-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-indigo-400">
            <MessageCircleQuestion className="h-4 w-4" />
            Seekers' Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-white tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-amber-500">Questions</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Everything you need to know about NumGuru and the ancient science of numerology.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl reveal-up stagger-1">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 bg-white/5 rounded-2xl px-6 data-[state=open]:bg-white/10 transition-all">
                <AccordionTrigger className="text-left font-bold text-base md:text-lg text-slate-200 hover:text-white py-6 hover:no-underline">
                  <span className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 text-sm md:text-base leading-relaxed pb-6 pl-8 pr-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
